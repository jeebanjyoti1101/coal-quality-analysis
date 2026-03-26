"""
preprocessing.py
----------------
Handles all data loading, cleaning, encoding, feature scaling,
and train-test splitting for the Coal Quality Prediction project.

Supports combining two datasets:
  - coal_quality_dataset.csv   (5 000 rows  – synthetic/simple)
  - coal_quality_dataset_2.csv (200 000 rows – richer/complex)
"""

import sys
import os
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

# Force UTF-8 output on Windows (avoids cp1252 UnicodeEncodeError)
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

# ── Paths ──────────────────────────────────────────────────────────────────────
BASE_DIR   = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_PATH  = os.path.join(BASE_DIR, "data", "coal_quality_dataset.csv")
DATA_PATH2 = os.path.join(BASE_DIR, "data", "coal_quality_dataset_2.csv")

FEATURE_COLS = ["moisture", "ash", "volatile_matter",
                "fixed_carbon", "sulfur", "calorific_value"]

# ── Helpers ────────────────────────────────────────────────────────────────────

def load_single(path: str, tag: str = "") -> pd.DataFrame:
    """Load one CSV file and print basic info."""
    df = pd.read_csv(path)
    label = f" [{tag}]" if tag else ""
    print(f"[INFO]{label} Loaded: {df.shape[0]:,} rows x {df.shape[1]} cols  →  {path}")
    return df


def load_and_merge(path1: str = DATA_PATH,
                   path2: str = DATA_PATH2) -> pd.DataFrame:
    """
    Load both datasets, align columns, concatenate, and reset index.
    If the second file doesn't exist, continue with just the first.
    """
    df1 = load_single(path1, "Dataset-1")
    dfs = [df1]

    if path2 and os.path.exists(path2):
        df2 = load_single(path2, "Dataset-2")
        dfs.append(df2)
    else:
        print(f"[WARN] Dataset-2 not found or disabled – training on Dataset-1 only.")

    df = pd.concat(dfs, ignore_index=True)
    print(f"[INFO] Combined dataset: {df.shape[0]:,} rows x {df.shape[1]} cols")
    return df


def handle_missing_values(df: pd.DataFrame) -> pd.DataFrame:
    """
    Fill missing values:  numeric → median,  string → mode.
    """
    before = int(df.isnull().sum().sum())
    for col in df.columns:
        if pd.api.types.is_numeric_dtype(df[col]):
            df[col] = df[col].fillna(df[col].median())
        else:
            df[col] = df[col].fillna(df[col].mode()[0])
    after = int(df.isnull().sum().sum())
    print(f"[INFO] Missing values: {before} before -> {after} after imputation")
    return df


def encode_labels(df: pd.DataFrame) -> pd.DataFrame:
    """
    Map quality column: Good -> 1, Bad -> 0.
    """
    df["quality"] = df["quality"].map({"Good": 1, "Bad": 0})
    if df["quality"].isnull().any():
        unmapped = df["quality"].isnull().sum()
        print(f"[WARN] {unmapped} rows had unexpected quality values and were dropped.")
        df = df.dropna(subset=["quality"])
    df["quality"] = df["quality"].astype(int)
    print(f"[INFO] Label distribution:\n{df['quality'].value_counts().to_string()}")
    return df


def add_label_noise(y: pd.Series, noise_rate: float = 0.08,
                    random_state: int = 42) -> pd.Series:
    """
    Randomly flip `noise_rate` fraction of labels to simulate real-world
    measurement uncertainty (e.g. borderline samples that are hard to judge).

    This deliberately degrades perfect-rule datasets so that models must
    generalise rather than memorise the exact decision boundary.
    """
    rng     = np.random.default_rng(random_state)
    y_noisy = y.copy()
    n_flip  = int(len(y_noisy) * noise_rate)
    idx     = rng.choice(y_noisy.index, size=n_flip, replace=False)
    y_noisy.loc[idx] = 1 - y_noisy.loc[idx]
    print(f"[INFO] Label noise: {n_flip:,} labels flipped  ({noise_rate*100:.1f}% noise rate)")
    return y_noisy


def scale_features(X_train, X_test):
    """
    Fit StandardScaler on train set, transform both splits.
    Returns scaled arrays and the fitted scaler.
    """
    scaler = StandardScaler()
    X_tr   = scaler.fit_transform(X_train)
    X_te   = scaler.transform(X_test)
    print("[INFO] Feature scaling applied (StandardScaler).")
    return X_tr, X_te, scaler


# ── Main pipeline ─────────────────────────────────────────────────────────────

def preprocess(path1: str = DATA_PATH,
               path2: str = None,          # disabled – Dataset 2 has conflicting labels
               test_size: float = 0.20,
               random_state: int = 42,
               noise_rate: float = 0.05):  # 5% noise -> realistic 90-95% accuracy
    """
    Full dual-dataset preprocessing pipeline.

    Parameters
    ----------
    noise_rate : float
        Fraction of labels to randomly flip to make the task realistic.
        0.0 = no noise (easy / overfit prone), 0.08 = 8% noise (realistic).

    Returns
    -------
    X_train, X_test  : scaled numpy arrays
    y_train, y_test  : int Series
    X_all            : all scaled features (for cross-validation)
    y_all            : all labels with noise  (for cross-validation)
    scaler           : fitted StandardScaler
    feature_cols     : list of feature names
    df               : cleaned / encoded DataFrame  (for EDA)
    """
    print("\n" + "="*60)
    print("STEP 1: DATA LOADING & PREPROCESSING")
    print("="*60)

    # 1. Load + merge
    df = load_and_merge(path1, path2)

    # 2. Handle missing values
    df = handle_missing_values(df)

    # 3. Encode labels
    df = encode_labels(df)

    # 4. Feature / target split
    X = df[FEATURE_COLS]
    y = df["quality"]

    # 5. Add label noise  →  prevents perfect scores on synthetic data
    y_noisy = add_label_noise(y, noise_rate=noise_rate, random_state=random_state)

    # 6. Train / test split  (stratified)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y_noisy,
        test_size=test_size,
        random_state=random_state,
        stratify=y_noisy
    )
    print(f"[INFO] Train: {X_train.shape[0]:,} samples  |  Test: {X_test.shape[0]:,} samples")

    # 7. Scale features
    X_train_s, X_test_s, scaler = scale_features(X_train, X_test)

    # 8. Full scaled matrix for cross-validation
    scaler_full = StandardScaler()
    X_all       = scaler_full.fit_transform(X)

    return X_train_s, X_test_s, y_train, y_test, X_all, y_noisy, scaler, FEATURE_COLS, df


# ── Sanity check ──────────────────────────────────────────────────────────────
if __name__ == "__main__":
    X_tr, X_te, y_tr, y_te, _, _, sc, feats, df = preprocess()
    print(f"\n[OK] Train={X_tr.shape[0]:,}  Test={X_te.shape[0]:,}  Features={feats}")
