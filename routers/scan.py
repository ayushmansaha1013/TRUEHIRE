from fastapi import APIRouter, HTTPException
from models.schemas import ScanRequest, ScanResponse
from services.ml_service import ml_service
from services.rule_engine import run_all_signals
from services.score_aggregator import compute_fraud_score
from database.connection import get_db
import uuid
import re
from datetime import datetime

router = APIRouter()


@router.post("/scan", response_model=ScanResponse)
async def scan_job(request: ScanRequest):
    """
    Scan a job posting using ML + rule engine.
    Returns full fraud report.
    """
    try:
        # ─── 1. Get input text
        job_text = request.content

        if not job_text or len(job_text.strip()) < 10:
            raise HTTPException(
                status_code=400,
                detail="Please provide a valid job description (minimum 10 characters)"
            )

        # ─── 2. Extract basic metadata from text
        company_name = None
        job_title = None
        salary_claimed = None
        city = None
        extracted_url = None
        extracted_email = None

        # Check if URL was directly passed as input
        if request.input_type == "url" or job_text.strip().startswith(("http://", "https://")):
            extracted_url = job_text.strip().split()[0]
        else:
            url_match = re.search(r'https?://[^\s<>"]+|www\.[^\s<>"]+', job_text)
            if url_match:
                extracted_url = url_match.group(0)

        # Extract email
        email_match = re.search(r'[\w\.-]+@[\w\.-]+\.\w+', job_text)
        if email_match:
            extracted_email = email_match.group(0)

        # Extract salary
        salary_match = re.search(
            r'(?:₹|rs\.?|inr)\s*([\d,]+(?:,\d{3})*|\d+)',
            job_text,
            re.IGNORECASE
        )
        if salary_match:
            salary_claimed = salary_match.group(1).replace(',', '')

        # Extract city
        cities = ['mumbai', 'delhi', 'bengaluru', 'bangalore', 'hyderabad',
                  'chennai', 'kolkata', 'pune', 'ahmedabad', 'jaipur',
                  'lucknow', 'nagpur', 'indore', 'bhopal', 'patna',
                  'gurgaon', 'gurugram', 'noida', 'chandigarh', 'surat']
        for c in cities:
            if re.search(rf'\b{c}\b', job_text, re.IGNORECASE):
                city = c.title()
                break

        # Extract company name
        company_match = re.search(
            r'(?:company|organization|employer|firm|hiring\s+at|work\s+at)\s*:\s*([^\n\r,\.;|]+(?:\s+(?:Pvt\s+Ltd|Private\s+Limited|Ltd|LLP|Inc|Corp))?)',
            job_text,
            re.IGNORECASE
        )
        if company_match:
            company_name = company_match.group(1).strip()
        else:
            corp_match = re.search(
                r'\b([A-Z][A-Za-z0-9&\'\-]*(?:\s+[A-Z][A-Za-z0-9&\'\-]*)*\s+(?:Pvt\s+Ltd|Private\s+Limited|Ltd|LLP|Inc|Technologies|Solutions|Services|Enterprises|Infotech))\b',
                job_text
            )
            if corp_match:
                company_name = corp_match.group(1).strip()

        # Extract job title
        title_match = re.search(
            r'(?:job\s*title|role|position|designation|hiring\s+for|profile)\s*:\s*([^\n\r,\.;|]+)',
            job_text,
            re.IGNORECASE
        )
        if title_match:
            job_title = title_match.group(1).strip()

        metadata = {
            "url": extracted_url or "",
            "email": extracted_email or "",
            "salary": salary_claimed,
            "city": city,
            "company_name": company_name,
            "job_title": job_title
        }

        # ─── 3. Run ML model
        ml_probability = ml_service.predict(job_text, metadata=metadata)

        # ─── 4. Run rule engine signals
        signals_result = run_all_signals(job_text, metadata=metadata)

        # ─── 5. Check community reports for this company
        community_count = 0
        if company_name:
            try:
                db = get_db()
                existing = db.table("community_reports").select(
                    "*"
                ).ilike("company_name", f"%{company_name}%").execute()
                if existing.data:
                    community_count = len(existing.data)
            except Exception:
                community_count = 0

        # ─── 6. Compute final fraud score
        result = compute_fraud_score(
            ml_probability=ml_probability,
            signals_result=signals_result,
            community_reports=community_count
        )

        # ─── 7. Create scan record
        scan_id = str(uuid.uuid4())
        share_token = str(uuid.uuid4())[:8]
        created_at = datetime.utcnow().isoformat()

        # ─── 8. Save to database (if working)
        try:
            db = get_db()
            db.table("job_scans").insert({
                "id": scan_id,
                "input_type": request.input_type,
                "raw_input": job_text,
                "fraud_score": result["fraud_score"],
                "risk_level": result["risk_level"],
                "ml_probability": ml_probability,
                "signals_fired": signals_result.get("signals_fired", []),
                "signals_passed": signals_result.get("signals_passed", []),
                "company_name": company_name,
                "job_title": job_title,
                "salary_claimed": salary_claimed,
                "city": city,
                "share_token": share_token,
                "is_public": True
            }).execute()
        except Exception as e:
            print(f"Could not save to DB: {e}")

        # ─── 9. Build response
        return ScanResponse(
            scan_id=scan_id,
            share_token=share_token,
            fraud_score=result["fraud_score"],
            risk_level=result["risk_level"],
            ml_probability=ml_probability,
            signals_fired=signals_result.get("signals_fired", []),
            signals_passed=signals_result.get("signals_passed", []),
            company_name=company_name or "Unknown Company",
            job_title=job_title or "Unknown Role",
            salary_claimed=salary_claimed,
            city=city,
            community_reports_count=community_count,
            recommended_actions=result["recommended_actions"],
            created_at=created_at
        )

    except HTTPException:
        raise
    except Exception as e:
        print(f"Scan error: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Error analysing job posting: {str(e)}"
        )


@router.get("/scan/{share_token}")
async def get_scan_by_token(share_token: str):
    """Get previously saved scan by share token."""
    try:
        db = get_db()
        result = db.table("job_scans").select("*").eq(
            "share_token", share_token
        ).execute()
        if result.data:
            return result.data[0]
        raise HTTPException(status_code=404, detail="Scan report not found")
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=404, detail="Scan report not found")