import re
from typing import Dict, Any
from urllib.parse import urlparse
import urllib.request


class ScrapperService:
    """
    Safely extracts job post content and metadata from URLs or raw text.
    """

    def extract_job_content(self, input_type: str, content: str) -> Dict[str, Any]:
        """
        Extract text, company name, title, salary, city, etc.
        """
        content = content.strip() if content else ""

        if input_type == "url" or content.startswith("http://") or content.startswith("https://"):
            url = content
            extracted_text = self._scrape_url(url)
            parsed_meta = self._parse_metadata_from_text(extracted_text, url)
            parsed_meta["url"] = url
            return {
                "text": extracted_text or content,
                "metadata": parsed_meta
            }
        else:
            parsed_meta = self._parse_metadata_from_text(content)
            return {
                "text": content,
                "metadata": parsed_meta
            }

    def _scrape_url(self, url: str) -> str:
        """Fetch and extract text from a job posting URL."""
        try:
            req = urllib.request.Request(
                url,
                headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 TrueHireBot/1.0"}
            )
            with urllib.request.urlopen(req, timeout=5) as response:
                html = response.read().decode("utf-8", errors="ignore")

            from bs4 import BeautifulSoup
            soup = BeautifulSoup(html, "html.parser")

            # Remove script and style elements
            for element in soup(["script", "style", "nav", "footer", "header", "noscript"]):
                element.extract()

            text = soup.get_text(separator=" ", strip=True)
            return text[:4000]
        except Exception as e:
            print(f"Scraping warning ({url}): {e}")
            return ""

    def _parse_metadata_from_text(self, text: str, url: str = "") -> Dict[str, Any]:
        """Heuristically extract company name, job title, salary, and city from text."""
        company_name = None
        job_title = None
        salary_claimed = None
        city = None
        email = None

        if url:
            domain = urlparse(url).netloc.replace("www.", "")
            company_name = domain.split(".")[0].capitalize()

        # Extract email
        email_match = re.search(r"[\w\.-]+@[\w\.-]+\.\w+", text)
        if email_match:
            email = email_match.group(0)

        # Extract salary
        salary_match = re.search(r"(?:rs\.?|inr|₹|salary[:\s]*)\s*([\d,]+(?:\s*-\s*[\d,]+)?(?:\s*(?:lpa|k|pm|per\s*month|per\s*annum|daily))?)", text, re.IGNORECASE)
        if salary_match:
            salary_claimed = salary_match.group(0).strip()

        # Extract common Indian cities
        cities = ["Bengaluru", "Bangalore", "Mumbai", "Delhi", "Gurgaon", "Gurugram", "Noida", "Hyderabad", "Pune", "Chennai", "Kolkata", "Ahmedabad", "Jaipur", "Chandigarh", "Lucknow", "Indore", "Kochi"]
        for c in cities:
            if re.search(rf"\b{c}\b", text, re.IGNORECASE):
                city = c
                break

        # Common job titles
        titles = ["Software Engineer", "Backend Developer", "Frontend Developer", "Full Stack Developer", "Data Analyst", "Data Entry Operator", "HR Executive", "Recruiter", "Customer Support", "Digital Marketing", "Sales Executive", "Typist"]
        for t in titles:
            if re.search(rf"\b{t}\b", text, re.IGNORECASE):
                job_title = t
                break

        return {
            "company_name": company_name,
            "job_title": job_title,
            "salary_claimed": salary_claimed,
            "city": city,
            "email": email,
            "url": url
        }


scrapper_service = ScrapperService()
