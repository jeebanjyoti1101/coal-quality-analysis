"""
eda.py
------
Exploratory Data Analysis for the Coal Quality Prediction project.
Generates and saves:
  - Dataset summary (printed to console)
  - Correlation heatmap      → reports/heatmap.png
  - Feature distributions    → reports/distributions.png
  - Boxplots (outlier check) → reports/boxplots.png
  - Quality class balance    → reports/class_balance.png
"""

import sys
import os
import pandas as pd
import matplotlib
matplotlib.use("Agg")          # non-interactive backend - safe for scripts
import matplotlib.pyplot as plt
import seaborn as sns

# Force UTF-8 output on Windows (avoids cp1252 UnicodeEncodeError)
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

# ─── Paths ────────────────────────────────────────────────────────────────────
BASE_DIR    = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REPORTS_DIR = os.path.join(BASE_DIR, "reports")
os.makedirs(REPORTS_DIR, exist_ok=True)

FEATURE_COLS = ["moisture", "ash", "volatile_matter",
                "fixed_carbon", "sulfur", "calorific_value"]


def print_summary(df: pd.DataFrame) -> None:
    """Print shape, dtypes, missing values, and descriptive statistics."""
    print("=" * 60)
    print("DATASET SUMMARY")
    print("=" * 60)
    print(f"\nShape  : {df.shape[0]} rows × {df.shape[1]} columns")
    print("\nData Types:")
    print(df.dtypes)
    print("\nMissing Values:")
    print(df.isnull().sum())
    print("\nDescriptive Statistics:")
    print(df.describe().round(3))
    print("\nClass Distribution (quality):")
    print(df["quality"].value_counts())


def plot_correlation_heatmap(df: pd.DataFrame) -> None:
    """Correlation heatmap of all numeric features + encoded target."""
    numeric_df = df.copy()
    # Encode 'quality' if it's still a string
    if numeric_df["quality"].dtype == object:
        numeric_df["quality"] = numeric_df["quality"].map({"Good": 1, "Bad": 0})

    corr = numeric_df[FEATURE_COLS + ["quality"]].corr()

    fig, ax = plt.subplots(figsize=(9, 7))
    sns.heatmap(corr, annot=True, fmt=".2f", cmap="coolwarm",
                square=True, linewidths=0.5, ax=ax)
    ax.set_title("Feature Correlation Heatmap", fontsize=14, fontweight="bold")
    plt.tight_layout()
    path = os.path.join(REPORTS_DIR, "heatmap.png")
    fig.savefig(path, dpi=150)
    plt.close(fig)
    print(f"[EDA] Heatmap saved → {path}")


def plot_feature_distributions(df: pd.DataFrame) -> None:
    """Histogram + KDE for each numeric feature, coloured by quality."""
    fig, axes = plt.subplots(2, 3, figsize=(15, 9))
    axes = axes.flatten()

    palette = {0: "#e74c3c", 1: "#2ecc71"}   # Bad=red, Good=green

    for i, col in enumerate(FEATURE_COLS):
        # Encode quality for hue if string
        hue_col = df["quality"].map({"Good": 1, "Bad": 0}) \
                  if df["quality"].dtype == object else df["quality"]
        for label, color in palette.items():
            subset = df[hue_col == label][col]
            axes[i].hist(subset, bins=30, alpha=0.6, color=color,
                         label=("Good" if label == 1 else "Bad"), edgecolor="white")
        axes[i].set_title(f"Distribution: {col}", fontsize=11)
        axes[i].set_xlabel(col)
        axes[i].set_ylabel("Frequency")
        axes[i].legend()

    fig.suptitle("Feature Distributions by Coal Quality", fontsize=14, fontweight="bold")
    plt.tight_layout()
    path = os.path.join(REPORTS_DIR, "distributions.png")
    fig.savefig(path, dpi=150)
    plt.close(fig)
    print(f"[EDA] Distributions plot saved → {path}")


def plot_boxplots(df: pd.DataFrame) -> None:
    """Boxplots for outlier detection across all features."""
    fig, axes = plt.subplots(2, 3, figsize=(15, 9))
    axes = axes.flatten()

    for i, col in enumerate(FEATURE_COLS):
        axes[i].boxplot(df[col].dropna(), vert=True, patch_artist=True,
                        boxprops=dict(facecolor="#3498db", color="#2c3e50"),
                        medianprops=dict(color="#e74c3c", linewidth=2))
        axes[i].set_title(f"Boxplot: {col}", fontsize=11)
        axes[i].set_ylabel(col)

    fig.suptitle("Boxplots – Outlier Detection", fontsize=14, fontweight="bold")
    plt.tight_layout()
    path = os.path.join(REPORTS_DIR, "boxplots.png")
    fig.savefig(path, dpi=150)
    plt.close(fig)
    print(f"[EDA] Boxplots saved → {path}")


def plot_class_balance(df: pd.DataFrame) -> None:
    """Bar chart showing the balance between Good and Bad quality samples."""
    quality_col = df["quality"].map({"Good": "Good", "Bad": "Bad"}) \
                  if df["quality"].dtype != object \
                  else df["quality"]
    # Re-map numeric labels back to strings for display
    if df["quality"].dtype != object:
        quality_col = df["quality"].map({1: "Good", 0: "Bad"})
    else:
        quality_col = df["quality"]

    counts = quality_col.value_counts()
    colors = ["#2ecc71", "#e74c3c"]

    fig, ax = plt.subplots(figsize=(6, 5))
    bars = ax.bar(counts.index, counts.values, color=colors, edgecolor="white",
                  width=0.5)
    ax.bar_label(bars, fmt="%d", fontsize=12, fontweight="bold")
    ax.set_title("Class Balance (Good vs Bad)", fontsize=13, fontweight="bold")
    ax.set_ylabel("Number of Samples")
    ax.set_xlabel("Coal Quality")
    plt.tight_layout()
    path = os.path.join(REPORTS_DIR, "class_balance.png")
    fig.savefig(path, dpi=150)
    plt.close(fig)
    print(f"[EDA] Class balance chart saved → {path}")


def run_eda(df: pd.DataFrame) -> None:
    """Run the full EDA pipeline."""
    print_summary(df)
    plot_correlation_heatmap(df)
    plot_feature_distributions(df)
    plot_boxplots(df)
    plot_class_balance(df)
    print("\n[EDA] All reports generated in the 'reports/' folder.")


# ─── Run directly ─────────────────────────────────────────────────────────────
if __name__ == "__main__":
    from preprocessing import preprocess
    _, _, _, _, _, _, df_clean = preprocess()
    run_eda(df_clean)
