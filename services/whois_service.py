from urllib.parse import urlparse
from typing import Dict, Any


class WhoisService:
    """
    Analyzes domain safety, structure, and risk indicators.
    """

    def analyze_domain(self, url: str) -> Dict[str, Any]:
        if not url:
            return {"is_safe": True, "domain": "", "risk_score": 0}

        try:
            parsed = urlparse(url)
            domain = parsed.netloc.lower().replace("www.", "")

            suspicious_keywords = ["free-job", "instant-offer", "daily-earn", "task-payout", "telecom-jobs"]
            is_suspicious_name = any(kw in domain for kw in suspicious_keywords)

            suspicious_tlds = [".xyz", ".top", ".buzz", ".work", ".click", ".site", ".online"]
            is_suspicious_tld = any(domain.endswith(tld) for tld in suspicious_tlds)

            risk_score = 0
            if is_suspicious_name:
                risk_score += 40
            if is_suspicious_tld:
                risk_score += 30

            return {
                "domain": domain,
                "is_suspicious": risk_score > 30,
                "risk_score": risk_score
            }
        except Exception:
            return {"domain": "", "is_suspicious": False, "risk_score": 0}


whois_service = WhoisService()
