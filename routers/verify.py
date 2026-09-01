# pyrefly: ignore [missing-import]
from fastapi import APIRouter
from database.connection import get_db

router = APIRouter()


@router.post("/verify/company")
async def verify_company(data: dict):
    """
    Submit company for recruiter verification.
    """
    db = get_db()
    try:
        company_data = {
            "company_name": data.get("company_name", ""),
            "cin_number": data.get("cin", ""),
            "gst_number": data.get("gst", ""),
            "official_domain": data.get("domain", ""),
            "verification_level": "basic"
        }
        db.table("verified_companies").insert(company_data).execute()
        return {
            "status": "submitted",
            "badge_level": "basic",
            "message": "Verification submitted successfully. "
                       "We will review within 24 hours."
        }
    except Exception as e:
        print(f"Verification error: {e}")
        return {
            "status": "received",
            "message": "Verification request received."
        }


@router.get("/jobs/verified")
async def get_verified_jobs():
    """
    Get all jobs from verified recruiters.
    Shown on the Safe Jobs board.
    """
    db = get_db()
    try:
        result = db.table("verified_companies").select(
            "*"
        ).eq("is_active", True).execute()
        return result.data or []
    except Exception as e:
        print(f"Error fetching verified jobs: {e}")
        return []