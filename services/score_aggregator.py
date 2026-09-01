SEVERITY_WEIGHTS = {
    "high": 15,
    "medium": 8,
    "low": 3
}


def compute_fraud_score(
    ml_probability: float,
    signals_result: dict,
    community_reports: int = 0
) -> dict:
    """
    Combine ML probability + rule signals + community
    into a final fraud score 0-100.
    """

    # ML score = 40% weight
    ml_score = ml_probability * 40

    # Signal score = up to 55% weight
    signals_fired = signals_result.get("signals_fired", [])
    signal_score = sum(
        SEVERITY_WEIGHTS.get(s.get('severity', 'medium'), 8)
        for s in signals_fired
    )
    signal_score = min(signal_score, 55)

    # Community score = up to 5% weight
    community_score = min(community_reports * 1.5, 5)

    # Final score
    final_score = int(ml_score + signal_score + community_score)
    final_score = max(0, min(100, final_score))

    # Risk level
    if final_score >= 85:
        risk_level = "CRITICAL"
    elif final_score >= 70:
        risk_level = "HIGH"
    elif final_score >= 40:
        risk_level = "MEDIUM"
    else:
        risk_level = "LOW"

    # Recommended actions
    if risk_level in ("HIGH", "CRITICAL"):
        actions = [
            "Do NOT pay any registration or training fee",
            "Verify the company on mca.gov.in before proceeding",
            "Report this job to cybercrime.gov.in",
            "Search for verified safe jobs on our jobs board"
        ]
    elif risk_level == "MEDIUM":
        actions = [
            "Proceed with caution — verify the company independently",
            "Do not share personal documents before a formal offer",
            "Check if the company has a verified LinkedIn page",
            "Trust your instincts — if it feels off, it probably is"
        ]
    else:
        actions = [
            "This job appears legitimate — still verify before applying",
            "Check company reviews on Glassdoor or LinkedIn",
            "Never share Aadhaar or bank details early in the process"
        ]

    return {
        "fraud_score": final_score,
        "risk_level": risk_level,
        "ml_contribution": round(ml_score, 2),
        "signal_contribution": round(signal_score, 2),
        "community_contribution": round(community_score, 2),
        "recommended_actions": actions
    }