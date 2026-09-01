from database.connection import get_db

db = get_db()

reports = [
    {
        "company_name": "Infosys Solutions Pvt Ltd",
        "job_title": "Data Entry Executive",
        "city": "Mumbai",
        "scam_description": "Paid ₹2000 registration fee. Number went unreachable after payment.",
        "amount_lost_inr": 2000,
        "scam_stage": "paid",
        "upvotes": 14
    },
    {
        "company_name": "Amazon India Associates",
        "job_title": "Work From Home Customer Care",
        "city": "Bengaluru",
        "scam_description": "Fake Amazon job. Asked for Aadhaar and PAN before interview.",
        "amount_lost_inr": 0,
        "scam_stage": "applied",
        "upvotes": 8
    },
    {
        "company_name": "TCS Global Services",
        "job_title": "Software Trainee",
        "city": "Hyderabad",
        "scam_description": "Offered ₹45K for freshers. Paid ₹1500 joining fee. Complete scam.",
        "amount_lost_inr": 1500,
        "scam_stage": "paid",
        "upvotes": 21
    },
    {
        "company_name": "Flipkart Delivery Partners",
        "job_title": "Delivery Executive",
        "city": "Delhi",
        "scam_description": "Asked ₹5000 for kit and uniform deposit. No refund.",
        "amount_lost_inr": 5000,
        "scam_stage": "paid",
        "upvotes": 6
    },
    {
        "company_name": "Google India Marketing",
        "job_title": "Digital Marketing Executive",
        "city": "Pune",
        "scam_description": "Fake Google recruiter on WhatsApp collected resume and personal details.",
        "amount_lost_inr": 0,
        "scam_stage": "interviewed",
        "upvotes": 11
    },
    {
        "company_name": "Wipro BPS Ltd",
        "job_title": "Back Office Executive",
        "city": "Chennai",
        "scam_description": "Salary promised ₹35K for data entry. Registration fee ₹1800 taken.",
        "amount_lost_inr": 1800,
        "scam_stage": "paid",
        "upvotes": 9
    },
    {
        "company_name": "HCL Career Solutions",
        "job_title": "HR Executive",
        "city": "Kolkata",
        "scam_description": "Received offer letter with HCL logo. Medical fee ₹3500 demanded.",
        "amount_lost_inr": 3500,
        "scam_stage": "paid",
        "upvotes": 17
    },
    {
        "company_name": "Zomato Franchise India",
        "job_title": "Restaurant Partner Manager",
        "city": "Ahmedabad",
        "scam_description": "Fake franchise opportunity. Collected documents then disappeared.",
        "amount_lost_inr": 0,
        "scam_stage": "applied",
        "upvotes": 4
    }
]

print("Seeding database...")
for r in reports:
    try:
        db.table("community_reports").insert(r).execute()
        print(f"  ✅ {r['company_name']} — {r['city']}")
    except Exception as e:
        print(f"  ❌ Failed: {r['company_name']} — {e}")

print(f"\nDone! {len(reports)} reports seeded.")