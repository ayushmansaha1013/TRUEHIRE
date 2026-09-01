# pyrefly: ignore [missing-import]
from pydantic import BaseModel
from typing import Optional, List


# ─────────────────────────────────────────
# SCAN REQUEST
# What Person A sends TO your API
# ─────────────────────────────────────────
class ScanRequest(BaseModel):
    input_type: str   # "url" or "text" or "screenshot"
    content: str      # The actual job URL or job description text


# ─────────────────────────────────────────
# SINGLE SIGNAL
# One fraud signal result
# ─────────────────────────────────────────
class Signal(BaseModel):
    id: int
    name: str        # Short name: "domain_age"
    label: str       # Human readable: "Domain created recently"
    reason: str      # Full explanation shown to user
    severity: str    # "high", "medium", "low"
    category: str    # "company", "jd", "contact", "community", "meta"
    fired: bool      # True = red flag | False = passed check


# ─────────────────────────────────────────
# SCAN RESPONSE
# What your API sends BACK to Person A
# This is the full fraud report
# ─────────────────────────────────────────
class ScanResponse(BaseModel):
    scan_id: str
    share_token: str
    fraud_score: int              # 0 to 100
    risk_level: str               # "LOW" "MEDIUM" "HIGH" "CRITICAL"
    ml_probability: float         # Raw ML output 0.0 to 1.0
    signals_fired: List[Signal]   # Red flags list
    signals_passed: List[Signal]  # Passed checks list
    company_name: Optional[str]
    job_title: Optional[str]
    salary_claimed: Optional[str]
    city: Optional[str]
    community_reports_count: int
    recommended_actions: List[str]
    created_at: str


# ─────────────────────────────────────────
# COMMUNITY REPORT REQUEST
# When user submits a scam report
# ─────────────────────────────────────────
class ReportRequest(BaseModel):
    company_name: str
    job_title: str
    city: str
    scam_description: str
    amount_lost_inr: Optional[int] = None
    scam_stage: Optional[str] = None


class ReportResponse(BaseModel):
    id: str
    message: str


# ─────────────────────────────────────────
# COMMUNITY FEED ITEM
# One scam report shown in the feed
# ─────────────────────────────────────────
class FeedItem(BaseModel):
    id: str
    company_name: str
    job_title: str
    city: str
    scam_description: str
    amount_lost_inr: Optional[int]
    upvotes: int
    created_at: str


# ─────────────────────────────────────────
# PLATFORM STATS
# Numbers shown on homepage ticker
# ─────────────────────────────────────────
class StatsResponse(BaseModel):
    total_scans: int
    scams_detected: int
    cities_covered: int
    amount_saved_inr: int
    reports_submitted: int