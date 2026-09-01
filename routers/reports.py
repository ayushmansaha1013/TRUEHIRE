# pyrefly: ignore [missing-import]
from fastapi import APIRouter
from database.connection import get_db
from models.schemas import ReportRequest, ReportResponse, FeedItem
from typing import List
import uuid

router = APIRouter()


@router.get("/reports/feed")
async def get_reports_feed(city: str = None, page: int = 1):
    """
    Get community scam reports feed.
    Filter by city optionally.
    """
    db = get_db()
    try:
        query = db.table("community_reports").select("*").order(
            "created_at", desc=True
        ).limit(10)

        if city:
            query = query.eq("city", city)

        result = query.execute()
        return result.data or []
    except Exception as e:
        print(f"Error fetching reports: {e}")
        return []


@router.post("/reports")
async def submit_report(report: ReportRequest):
    """
    Submit a new scam report to the community database.
    """
    db = get_db()
    try:
        data = {
            "company_name": report.company_name,
            "job_title": report.job_title,
            "city": report.city,
            "scam_description": report.scam_description,
            "amount_lost_inr": report.amount_lost_inr,
            "scam_stage": report.scam_stage,
        }
        db.table("community_reports").insert(data).execute()
        return {
            "id": str(uuid.uuid4()),
            "message": "Report submitted. Thank you for protecting others."
        }
    except Exception as e:
        print(f"Error submitting report: {e}")
        return {
            "id": str(uuid.uuid4()),
            "message": "Report received."
        }


@router.post("/reports/{report_id}/upvote")
async def upvote_report(report_id: str):
    """
    Upvote a community report to confirm it is real.
    """
    db = get_db()
    try:
        current = db.table("community_reports").select(
            "upvotes"
        ).eq("id", report_id).execute()

        if current.data:
            current_votes = current.data[0].get("upvotes", 0)
            db.table("community_reports").update(
                {"upvotes": current_votes + 1}
            ).eq("id", report_id).execute()

        return {"message": "Upvote recorded"}
    except Exception as e:
        print(f"Error upvoting: {e}")
        return {"message": "Upvote received"}