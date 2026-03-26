"""
app/main.py
-----------
FastAPI backend for the Coal Quality Prediction System.

Endpoints
---------
  POST /predict   →  Accepts 6 coal features, returns "Good" or "Bad"
  GET  /          →  Health check

Run with:
  uvicorn app.main:app --reload
"""

import os
import joblib
import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field


# ─── Paths ────────────────────────────────────────────────────────────────────
BASE_DIR   = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "models", "coal_model.pkl")


# ─── Load Model Once at Startup ───────────────────────────────────────────────
def load_model():
    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(
            f"Model file not found at '{MODEL_PATH}'. "
            "Please run 'python src/train_model.py' first."
        )
    return joblib.load(MODEL_PATH)


payload = load_model()
model        = payload["model"]
scaler       = payload["scaler"]
feature_cols = payload["feature_cols"]
model_name   = payload.get("model_name", "Unknown")


# ─── FastAPI App ──────────────────────────────────────────────────────────────
app = FastAPI(
    title       = "Coal Quality Prediction API",
    description = "Predict whether a coal sample is **Good** or **Bad** quality "
                  "based on 6 physical/chemical features.",
    version     = "1.0.0",
)

# Allow requests from the HTML frontend (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins  = ["*"],
    allow_methods  = ["*"],
    allow_headers  = ["*"],
)


# ─── Input Schema ─────────────────────────────────────────────────────────────
class CoalFeatures(BaseModel):
    """Input features for coal quality prediction."""
    moisture:        float = Field(..., example=8.5,    description="Moisture content (%)")
    ash:             float = Field(..., example=18.0,   description="Ash content (%)")
    volatile_matter: float = Field(..., example=25.0,   description="Volatile matter (%)")
    fixed_carbon:    float = Field(..., example=45.0,   description="Fixed carbon (%)")
    sulfur:          float = Field(..., example=1.2,    description="Sulfur content (%)")
    calorific_value: float = Field(..., example=6200.0, description="Calorific value (kcal/kg)")


class PredictionResponse(BaseModel):
    quality:    str   # "Good" or "Bad"
    confidence: float # Probability of the predicted class
    model_used: str   # Name of the underlying model


from fastapi.staticfiles import StaticFiles

# ─── Endpoints ────────────────────────────────────────────────────────────────
@app.get("/health", tags=["Health"])
def health_check():
    """Quick health check – confirms the API and model are loaded."""
    return {
        "status":     "✅ API is running",
        "model":      model_name,
        "features":   feature_cols,
    }

@app.post("/predict", response_model=PredictionResponse, tags=["Prediction"])
def predict(features: CoalFeatures):
    """
    Predict coal quality from the given features.

    - **Good** → calorific_value > 5500 AND ash < 30  (in the training data)
    - **Bad**  → otherwise

    The model generalises this rule based on learned patterns.
    """
    try:
        # 1. Build feature vector in the correct column order
        input_data = np.array([[
            features.moisture,
            features.ash,
            features.volatile_matter,
            features.fixed_carbon,
            features.sulfur,
            features.calorific_value,
        ]])

        # 2. Scale using the training scaler
        input_scaled = scaler.transform(input_data)

        # 3. Predict
        prediction_int = int(model.predict(input_scaled)[0])

        # 4. Confidence (probability)
        proba = model.predict_proba(input_scaled)[0]
        confidence = round(float(proba[prediction_int]), 4)

        quality = "Good" if prediction_int == 1 else "Bad"

        return PredictionResponse(
            quality    = quality,
            confidence = confidence,
            model_used = model_name,
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Mount the frontend static files at the root
app.mount("/", StaticFiles(directory=os.path.join(BASE_DIR, "frontend"), html=True), name="frontend")
