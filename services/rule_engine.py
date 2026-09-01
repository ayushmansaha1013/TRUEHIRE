import re
from rapidfuzz import fuzz

# Known companies for mimicry detection
KNOWN_COMPANIES = [
    "tcs", "infosys", "wipro", "accenture", "cognizant",
    "hcl", "tech mahindra", "amazon", "google", "microsoft",
    "flipkart", "zomato", "swiggy", "paytm", "byju",
    "razorpay", "zoho", "ola", "uber", "ibm", "capgemini",
    "deloitte", "pwc", "kpmg", "morgan stanley", "goldman"
]

PAYMENT_KEYWORDS = [
    "registration fee", "reg fee", "security deposit",
    "training fee", "joining fee", "application fee",
    "processing fee", "enrollment fee", "activation fee",
    "admission fee", "refundable deposit"
]

URGENCY_KEYWORDS = [
    "apply immediately", "urgent hiring", "limited seats",
    "hurry", "don't miss", "last chance", "closing soon",
    "only today", "last date today", "few seats remaining",
    "apply now before", "final opportunity"
]

POWER_WORDS = [
    "guaranteed income", "guaranteed salary", "no target",
    "instant joining", "earn lakhs", "no experience needed",
    "unlimited earning", "be your own boss", "passive income",
    "work 2 hours", "work two hours"
]

SALARY_BENCHMARKS = {
    "data entry": 20000,
    "customer care": 25000,
    "customer service": 25000,
    "telecaller": 20000,
    "receptionist": 22000,
    "peon": 15000,
    "delivery": 20000,
    "helper": 15000,
    "typist": 18000,
    "clerk": 22000,
    "accountant": 35000,
    "software": 60000,
    "developer": 60000,
    "engineer": 55000,
    "manager": 70000,
    "hr": 35000,
    "marketing": 35000,
    "sales": 30000,
    "teacher": 30000,
    "driver": 20000,
    "security": 18000,
    "nurse": 30000,
}

INDIAN_CITIES = [
    "mumbai", "delhi", "bengaluru", "bangalore", "hyderabad",
    "chennai", "kolkata", "pune", "ahmedabad", "jaipur",
    "lucknow", "nagpur", "indore", "bhopal", "patna",
    "gurgaon", "gurugram", "noida", "chandigarh", "surat",
    "kanpur", "visakhapatnam", "coimbatore", "kochi", "goa",
    "bhubaneswar", "guwahati", "ranchi", "raipur", "dehradun"
]


def run_all_signals(job_text: str, metadata: dict = None) -> dict:
    """
    Run all fraud detection signals against a job description.

    Args:
        job_text: The full job description text
        metadata: Optional dict with extra info

    Returns:
        dict with signals_fired, signals_passed, total counts
    """
    if metadata is None:
        metadata = {}

    text_lower = job_text.lower()
    signals_fired = []
    signals_passed = []

    def add_signal(signal_id, name, label, reason,
                   severity, category, fired):
        signal = {
            "id": signal_id,
            "name": name,
            "label": label,
            "reason": reason,
            "severity": severity,
            "category": category,
            "fired": fired
        }
        if fired:
            signals_fired.append(signal)
        else:
            signals_passed.append(signal)

    # ─── SIGNAL 1: Upfront payment language
    payment_found = [k for k in PAYMENT_KEYWORDS if k in text_lower]
    add_signal(
        1, "payment_language",
        "Upfront payment requested",
        f"Detected payment-related phrase: '{payment_found[0]}'. "
        f"Legitimate employers NEVER ask candidates to pay money "
        f"to apply, register, or join."
        if payment_found else
        "No upfront payment language detected in the job description.",
        "high", "jd", bool(payment_found)
    )

    # ─── SIGNAL 2: Company name mimicry
    company_name = (metadata.get('company_name') or '').lower()
    mimicry_detected = False
    mimicry_target = ""
    if company_name:
        for known in KNOWN_COMPANIES:
            similarity = fuzz.partial_ratio(company_name, known)
            if similarity >= 75 and company_name != known:
                mimicry_detected = True
                mimicry_target = known
                break

    add_signal(
        2, "company_mimicry",
        "Company name mimics a known brand",
        f"Company name is {fuzz.partial_ratio(company_name, mimicry_target)}% "
        f"similar to the real company '{mimicry_target.title()}'. "
        f"This is a common impersonation tactic."
        if mimicry_detected else
        "Company name does not closely match any known brand.",
        "high", "company", mimicry_detected
    )

    # ─── SIGNAL 3: Urgency / pressure language
    urgency_found = [k for k in URGENCY_KEYWORDS if k in text_lower]
    add_signal(
        3, "urgency_language",
        "Urgency or pressure tactics detected",
        f"Detected pressure phrase: '{urgency_found[0]}'. "
        f"Scammers create artificial urgency to prevent "
        f"candidates from researching the opportunity."
        if urgency_found else
        "No urgency or pressure language detected.",
        "medium", "jd", bool(urgency_found)
    )

    # ─── SIGNAL 4: Power words / over-promising
    power_found = [k for k in POWER_WORDS if k in text_lower]
    add_signal(
        4, "power_words",
        "Unrealistic promises detected",
        f"Detected over-promising language: '{power_found[0]}'. "
        f"Real jobs describe actual work responsibilities."
        if power_found else
        "No unrealistic promise language detected.",
        "medium", "jd", bool(power_found)
    )

    # ─── SIGNAL 5: Salary too high
    salary_nums = re.findall(r'[\d,]+', job_text)
    salary_value = 0
    for num in salary_nums:
        try:
            val = int(num.replace(',', ''))
            if val > salary_value and val < 500000:
                salary_value = val
        except Exception:
            pass

    salary_high = salary_value > 50000
    add_signal(
        5, "salary_benchmark",
        "Salary appears unrealistically high",
        f"Detected salary of ₹{salary_value:,}. "
        f"For most entry-level roles this is significantly "
        f"above the market rate." if salary_high else
        "Salary appears within a reasonable range.",
        "high", "jd", salary_high
    )

    # ─── SIGNAL 6: WhatsApp-only contact
    whatsapp_only = (
        'whatsapp' in text_lower and
        '@' not in text_lower and
        'email' not in text_lower
    )
    add_signal(
        6, "whatsapp_only",
        "Only WhatsApp contact provided",
        "The job only provides a WhatsApp number for contact. "
        "Legitimate companies use official email addresses."
        if whatsapp_only else
        "Multiple contact channels or official email provided.",
        "medium", "contact", whatsapp_only
    )

    # ─── SIGNAL 7: Personal data requested
    data_keywords = [
        'aadhaar', 'aadhar', 'pan number', 'bank account',
        'account number', 'ifsc', 'passport number', 'mother name'
    ]
    data_requested = any(k in text_lower for k in data_keywords)
    add_signal(
        7, "personal_data",
        "Sensitive personal data requested in job description",
        "The job description requests sensitive personal documents "
        "(Aadhaar/PAN/Bank details). This is a red flag for "
        "identity theft."
        if data_requested else
        "No requests for sensitive personal data found.",
        "high", "jd", data_requested
    )

    # ─── SIGNAL 8: Vague description
    word_count = len(job_text.split())
    is_vague = word_count < 80
    add_signal(
        8, "vague_description",
        "Job description is extremely vague",
        f"The job description contains only {word_count} words. "
        f"Legitimate postings include detailed responsibilities "
        f"and requirements."
        if is_vague else
        f"Job description appears detailed ({word_count} words).",
        "medium", "jd", is_vague
    )

    # ─── SIGNAL 9: WFH + high salary combo
    is_wfh = any(k in text_lower for k in [
        'work from home', 'wfh', 'work at home',
        'remote work', 'work from anywhere'
    ])
    combo = is_wfh and salary_high
    add_signal(
        9, "wfh_high_salary",
        "Work from home with unusually high salary",
        "Combination of work-from-home and very high salary "
        "is a common pattern in job scams targeting people "
        "seeking flexible income."
        if combo else
        "Work arrangement and salary combination appears reasonable.",
        "medium", "jd", combo
    )

    # ─── SIGNAL 10: Excessive CAPS
    if len(job_text) > 0:
        caps_ratio = sum(1 for c in job_text if c.isupper()) / len(job_text)
    else:
        caps_ratio = 0
    excessive_caps = caps_ratio > 0.3
    add_signal(
        10, "excessive_caps",
        "Excessive use of capital letters",
        f"{caps_ratio*100:.0f}% of the text is in capitals. "
        f"Associated with low-quality and fraudulent postings."
        if excessive_caps else
        "Normal capitalization pattern in the text.",
        "low", "meta", excessive_caps
    )

    # ─── SIGNAL 11: Missing standard JD elements
    has_responsibilities = any(k in text_lower for k in [
        'responsibilities', 'duties', 'you will', 'role',
        'key responsibility'
    ])
    has_requirements = any(k in text_lower for k in [
        'requirements', 'qualifications', 'skills required',
        'must have', 'eligibility', 'we are looking for'
    ])
    missing_elements = not has_responsibilities or not has_requirements
    add_signal(
        11, "missing_jd_elements",
        "Missing standard job description sections",
        "Posting is missing 'Responsibilities' or 'Requirements' "
        "sections. Legitimate postings always include both."
        if missing_elements else
        "Posting includes standard responsibility and requirement sections.",
        "medium", "jd", missing_elements
    )

    # ─── SIGNAL 12: No company email
    has_company_email = (
        '@' in job_text and
        'gmail' not in text_lower and
        'yahoo' not in text_lower and
        'hotmail' not in text_lower
    )
    add_signal(
        12, "no_company_email",
        "No official company email detected",
        "No official company email address found in the posting. "
        "Legitimate companies always provide one."
        if not has_company_email else
        "Official company email detected in the posting.",
        "low", "contact", not has_company_email
    )

    return {
        "signals_fired": signals_fired,
        "signals_passed": signals_passed,
        "total_fired": len(signals_fired),
        "total_checked": len(signals_fired) + len(signals_passed)
    }