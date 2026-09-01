import sys
import os
from pathlib import Path
import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    classification_report,
    accuracy_score,
    roc_auc_score,
    confusion_matrix
)
from xgboost import XGBClassifier
from imblearn.over_sampling import SMOTE
from scipy.sparse import hstack, csr_matrix
import joblib

# Ensure project root is in sys.path
PROJECT_ROOT = Path(__file__).resolve().parent.parent
ML_DIR = Path(__file__).resolve().parent

if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from ml.features import combine_text_fields, extract_numeric_features


def train_model(
    dataset_path: str = None,
    model_output_path: str = None,
    tfidf_output_path: str = None
):
    """
    Train the TrueHire ML Model using TF-IDF + Numeric features and XGBoost.
    """
    dataset_file = Path(dataset_path) if dataset_path else ML_DIR / "fake_job_postings.csv"
    model_file = Path(model_output_path) if model_output_path else ML_DIR / "model.pkl"
    tfidf_file = Path(tfidf_output_path) if tfidf_output_path else ML_DIR / "tfidf_vectorizer.pkl"

    print("=" * 55)
    print("   TrueHire ML Training Pipeline")
    print("   Omnikon 2026 — Omni_CyberTech_10")
    print("=" * 55)

    # ─────────────────────────────────────────
    # STEP 1: LOAD DATA
    # ─────────────────────────────────────────
    print("\n[1/8] Loading dataset...")
    if not dataset_file.exists():
        print(f"❌ Error: Dataset file not found at '{dataset_file}'.")
        print("   Please ensure 'fake_job_postings.csv' is placed in the ml/ directory.")
        return

    df = pd.read_csv(dataset_file)
    # Ensure fraudulent column is clean
    df = df.dropna(subset=['fraudulent'])
    df['fraudulent'] = df['fraudulent'].astype(int)

    print(f"      Total samples:  {len(df)}")
    print(f"      Fraudulent:     {df['fraudulent'].sum()}")
    print(f"      Legitimate:     {(df['fraudulent'] == 0).sum()}")
    print(f"      Fraud rate:     {df['fraudulent'].mean():.1%}")

    # ─────────────────────────────────────────
    # STEP 2: PREPARE TEXT
    # ─────────────────────────────────────────
    print("\n[2/8] Preparing text features...")
    df['combined_text'] = df.apply(combine_text_fields, axis=1)
    avg_len = df['combined_text'].apply(len).mean()
    print(f"      Average text length: {avg_len:.0f} characters")

    # ─────────────────────────────────────────
    # STEP 3: TF-IDF VECTORIZATION
    # ─────────────────────────────────────────
    print("\n[3/8] TF-IDF vectorization...")
    tfidf = TfidfVectorizer(
        max_features=10000,
        ngram_range=(1, 2),
        min_df=2,
        max_df=0.95,
        sublinear_tf=True
    )
    X_text = tfidf.fit_transform(df['combined_text'])
    print(f"      Text feature matrix: {X_text.shape}")

    # ─────────────────────────────────────────
    # STEP 4: NUMERIC FEATURES
    # ─────────────────────────────────────────
    print("\n[4/8] Extracting numeric features...")
    numeric_df = extract_numeric_features(df)
    X_numeric = csr_matrix(numeric_df.values)
    print(f"      Numeric features: {X_numeric.shape[1]}")

    # ─────────────────────────────────────────
    # STEP 5: COMBINE ALL FEATURES
    # ─────────────────────────────────────────
    print("\n[5/8] Combining all features...")
    X = hstack([X_text, X_numeric]).tocsr()
    y = df['fraudulent'].values
    print(f"      Final feature matrix: {X.shape}")
    print(f"      Target distribution: {y.sum()} fraud / {(y == 0).sum()} legit")

    # ─────────────────────────────────────────
    # STEP 6: TRAIN TEST SPLIT + SMOTE
    # ─────────────────────────────────────────
    print("\n[6/8] Train/test split and SMOTE balancing...")
    X_train, X_test, y_train, y_test = train_test_split(
        X, y,
        test_size=0.2,
        random_state=42,
        stratify=y
    )
    print(f"      Training samples: {X_train.shape[0]}")
    print(f"      Testing samples:  {X_test.shape[0]}")

    smote = SMOTE(random_state=42)
    X_train_bal, y_train_bal = smote.fit_resample(X_train, y_train)
    print(f"      After SMOTE: {X_train_bal.shape[0]} training samples")
    print(f"      Fraud in training: {y_train_bal.sum()} ({y_train_bal.mean():.1%})")

    # ─────────────────────────────────────────
    # STEP 7: TRAIN XGBOOST MODEL
    # ─────────────────────────────────────────
    print("\n[7/8] Training XGBoost classifier...")
    print("      Training in progress...")

    model = XGBClassifier(
        n_estimators=200,
        max_depth=6,
        learning_rate=0.1,
        subsample=0.8,
        colsample_bytree=0.8,
        scale_pos_weight=1,
        random_state=42,
        eval_metric='logloss',
        verbosity=0,
        n_jobs=-1
    )

    model.fit(X_train_bal, y_train_bal)
    print("      Training complete!")

    # ─────────────────────────────────────────
    # STEP 8: EVALUATE MODEL
    # ─────────────────────────────────────────
    print("\n[8/8] Evaluating model performance...")
    y_pred = model.predict(X_test)
    y_prob = model.predict_proba(X_test)[:, 1]

    accuracy = accuracy_score(y_test, y_pred)
    auc = roc_auc_score(y_test, y_prob)

    print("\n" + "=" * 55)
    print("   MODEL PERFORMANCE RESULTS")
    print("=" * 55)
    print(f"   Accuracy:        {accuracy * 100:.2f}%")
    print(f"   AUC-ROC:         {auc * 100:.2f}%")
    print("\n   Detailed Report:")
    print(classification_report(
        y_test, y_pred,
        target_names=['Legitimate', 'Fraudulent']
    ))
    print("   Confusion Matrix:")
    cm = confusion_matrix(y_test, y_pred)
    print(f"   True Negatives:  {cm[0][0]}  (Legit correctly identified)")
    print(f"   False Positives: {cm[0][1]}  (Legit wrongly flagged)")
    print(f"   False Negatives: {cm[1][0]}  (Fraud missed)")
    print(f"   True Positives:  {cm[1][1]}  (Fraud correctly caught)")
    print("=" * 55)

    # ─────────────────────────────────────────
    # SAVE MODEL ARTIFACTS
    # ─────────────────────────────────────────
    print("\nSaving model artifacts...")
    model_file.parent.mkdir(parents=True, exist_ok=True)
    tfidf_file.parent.mkdir(parents=True, exist_ok=True)

    joblib.dump(model, model_file)
    joblib.dump(tfidf, tfidf_file)
    print(f"   ✅ {model_file} saved")
    print(f"   ✅ {tfidf_file} saved")

    print("\n" + "=" * 55)
    print("   TRAINING COMPLETE!")
    print(f"   Your model achieves {accuracy * 100:.1f}% accuracy")
    print("   Ready to connect to the API")
    print("=" * 55)


if __name__ == "__main__":
    train_model()