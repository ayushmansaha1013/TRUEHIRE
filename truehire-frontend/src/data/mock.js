export const mockScanResult = {
  score: 87,
  verdict: "SCAM",
  summary: "This listing shows several high-risk patterns that deserve immediate caution.",
  redFlags: [
    { title: "Salary 3× above market", detail: "Compensation is unusually high for the stated role." },
    { title: "WhatsApp-only contact", detail: "The recruiter avoids a normal company communication channel." },
    { title: "Urgent personal-data request", detail: "The listing asks for sensitive information unusually early." }
  ],
  passedChecks: [
    "Job title detected",
    "Company name provided",
    "Description has sufficient detail",
    "Location information detected"
  ]
};

export const communityReports = [
  { id: 1, city: "Mumbai", jobType: "Data Entry", method: "WhatsApp", title: "Work-from-home registration fee", score: 94 },
  { id: 2, city: "Bengaluru", jobType: "Software", method: "Telegram", title: "Fake product-company interview", score: 82 },
  { id: 3, city: "Delhi", jobType: "Marketing", method: "Email", title: "Training fee requested", score: 76 },
  { id: 4, city: "Mumbai", jobType: "Sales", method: "WhatsApp", title: "Guaranteed salary after payment", score: 91 }
];

export const jobs = [
  { id: 1, title: "Senior Frontend Engineer", company: "Acme Corp", type: "FULL-TIME", mode: "REMOTE", verified: true },
  { id: 2, title: "Software Engineer Intern", company: "Nova Labs", type: "INTERNSHIP", mode: "HYBRID", verified: true },
  { id: 3, title: "Product Designer", company: "PixelWorks", type: "FULL-TIME", mode: "REMOTE", verified: true }
];

export const stats = [
  { label: "Scams flagged", value: 12847 },
  { label: "Reports analyzed", value: 29104 },
  { label: "Verified jobs", value: 1832 }
];