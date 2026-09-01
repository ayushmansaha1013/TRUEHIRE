# pyrefly: ignore [missing-import]
import joblib
import os


class MLService:
    """
    Handles loading the trained ML model
    and running predictions on job descriptions.
    """

    def __init__(self):
        self.model = None
        self.tfidf = None
        self.is_loaded = False

    def load(self):
        """Load model from disk into memory."""
        try:
            from pathlib import Path
            base_dir = Path(__file__).resolve().parent.parent
            model_path = base_dir / "ml" / "model.pkl"
            tfidf_path = base_dir / "ml" / "tfidf_vectorizer.pkl"

            self.model = joblib.load(model_path)
            self.tfidf = joblib.load(tfidf_path)
            self.is_loaded = True
            print("ML model loaded successfully")
        except FileNotFoundError:
            print("ML model not found — run ml/train.py first")
            self.is_loaded = False
        except Exception as e:
            print(f"Failed to load ML model: {e}")
            self.is_loaded = False

    def predict(self, job_text: str, metadata: dict = None) -> float:
        """
        Predict fraud probability for a job description.
        Returns float between 0.0 and 1.0.
        0.0 = definitely legitimate
        1.0 = definitely fraudulent
        """
        if not self.is_loaded:
            return 0.5

        try:
            # pyrefly: ignore [missing-import]
            from scipy.sparse import hstack, csr_matrix
            from ml.features import prepare_inference_features

            clean_text, numeric_features = prepare_inference_features(
                job_text, metadata or {}
            )

            X_text = self.tfidf.transform([clean_text])
            X_numeric = csr_matrix([list(numeric_features.values())])
            X = hstack([X_text, X_numeric])

            prob = self.model.predict_proba(X)[0][1]
            return float(prob)

        except Exception as e:
            print(f"Prediction error: {e}")
            return 0.5


# Single instance loaded once at startup
ml_service = MLService()