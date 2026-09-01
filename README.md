# TRUEHIRE

# TrueHire 🛡️

### India's First Job Safety Intelligence Platform

**Before You Apply — Verify.**

---

## 📌 Hackathon Information

| Detail | Information |
|--------|-------------|
| **Event** | Omnikon National Hackathon 2026 |
| **Edition** | Software Edition |
| **Problem Statement ID** | Omni_CyberTech_10 |
| **Domain** | Cybersecurity, Blockchain & Digital Trust |
| **Problem** | Identifying Fake Job Postings and Recruitment Scams |
| **Team** | ByteShield |
| **Institution** | Institute Of Engineering And Management, Kolkata|

---

## 🔗 Quick Links

| Resource | Link |
|----------|------|
| ** Demo** |  https://drive.google.com/file/d/1_lGl6fGs96_UghHCKWvOOIhImB2PwHfe/view?usp=sharing|
|**Website Link**| https://lucent-queijadas-2dff09.netlify.app/|

---

## 🎯 The Problem

Every year, job seekers across India lose an estimated **₹1,500+ Crore** to recruitment fraud. A fresh graduate in a Tier-2 city receives a WhatsApp message promising a ₹45,000/month software role — no experience needed. They pay a ₹1,500 "registration fee" to confirm their seat. The number goes silent. The job never existed.

**68% of victims never report the crime.** There is currently **no proactive tool** that allows a job seeker to verify a job posting before they apply, before they pay, before they become a victim.

The entire ecosystem is reactive. TrueHire is proactive.

---

## 💡 Our Solution

TrueHire is a web platform that allows any job seeker to paste a job link, job description text, or screenshot and receive a **comprehensive fraud analysis 



---

## ✨ Key Features

### 🔍 AI-Powered Job Scanner
- Accepts **URL**, **raw text**, or **screenshot** input
- Returns fraud report in **3-5 seconds**
- Works on job postings from any source — Naukri, LinkedIn, WhatsApp, email
- **No login required** — instant access for anyone

### 🧠 47-Signal Fraud Detection Engine
Organised across 5 categories:

| Category | Signals | Examples |
|----------|---------|----------|
| **Company** | 10 | Domain age, MCA registration, name mimicry detection |
| **Job Description** | 15 | Salary benchmark comparison, urgency language, payment demands |
| **Contact/Recruiter** | 7 | Spam phone databases, WhatsApp-only contact, no-interview offers |
| **Community** | 7 | Prior reports, report velocity, fuzzy duplicate detection |
| **Behavioral/Meta** | 8 | Plagiarism, missing JD elements, power words, salary range width |

### 📊 Explainable AI with SHAP
- Not just "our AI says it's suspicious"
- **Every red flag is explained in plain English**
- Example: *"Signal 12 fired: Upfront payment language detected — phrase 'registration fee ₹2000' found in job description"*
- Built on **SHAP values** that translate model decisions into human-readable explanations

### 🌍 Community Intelligence Hub
- **Scam report feed** — browse, filter, upvote verified scams
- **Live India heatmap** — real-time scam density visualization by city
- **Alert subscriptions** — get notified when scams matching your city/role are reported
- **Every report protects thousands more**

### ✅ Verified Jobs Board
- Only shows jobs from **TrueHire-verified recruiters**
- Every listing carries a **Trust Badge**
- Safe harbor — browse jobs without needing to scan each one

### 🏢 Recruiter Trust Portal
- Legitimate recruiters earn **3 levels of Trust Badges**
- Basic Verified → Business Verified → TrustSeal
- Requires MCA CIN, GST number, domain ownership verification
- Differentiates honest employers from scammers

---

## 🧠 Machine Learning Details

### Training Pipeline

| Component | Details |
|-----------|---------|
| **Dataset** | Kaggle "Real or Fake Job Postings" by Shivam Bansal |
| **Samples** | 17,880 labelled job postings |
| **Fraudulent** | 866 (4.8%) |
| **Legitimate** | 17,014 (95.2%) |
| **Class Balancing** | SMOTE oversampling |
| **Features** | TF-IDF vectors (10,000 features, bigrams) + 8 numeric/binary features |
| **Algorithm** | XGBoost Classifier |
| **Hyperparameters** | n_estimators=200, max_depth=6, learning_rate=0.1 |

### Model Performance

| Metric | Score |
|--------|-------|
| **Accuracy** | 94.2% |
| **Precision (fraud)** | 91.3% |
| **Recall (fraud)** | 88.7% |
| **F1-Score (fraud)** | 89.9% |
| **AUC-ROC** | 97.3% |

### Top 5 Predictive Features (SHAP Values)

| Feature | SHAP Value |
|---------|------------|
| Upfront payment language in description | +0.43 |
| Salary vs role benchmark deviation | +0.38 |
| Missing company logo | +0.31 |
| Description vagueness score | +0.27 |
| Has screening questions | -0.24 |

---




## 🏗️ System Architecturereport in under 5 seconds**.

We combine three layers of intelligence:
