import pandas as pd
import re


def clean_text(text: str) -> str:
    """
    Clean and normalize raw job description text.
    Removes HTML, URLs, special characters.
    """
    if not text or pd.isna(text):
        return ""
    text = str(text).lower()
    text = re.sub(r'<[^>]+>', ' ', text)        # Remove HTML tags
    text = re.sub(r'http\S+', ' ', text)         # Remove URLs
    text = re.sub(r'[^a-z0-9\s]', ' ', text)    # Keep alphanumeric only
    text = re.sub(r'\s+', ' ', text)             # Normalize spaces
    return text.strip()


def combine_text_fields(row) -> str:
    """
    Combine all text columns into one string.
    This gives the ML model maximum context.
    """
    field_names = ['title', 'company_profile', 'description', 'requirements', 'benefits']
    fields = []
    for field in field_names:
        val = row.get(field, '') if hasattr(row, 'get') else (row[field] if field in row else '')
        if pd.notna(val) and val is not None:
            val_str = str(val).strip()
            if val_str and val_str.lower() != 'nan':
                fields.append(val_str)
    combined = ' '.join(fields)
    return clean_text(combined)


def extract_numeric_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Extract numeric and binary features from job posting metadata.
    These features add signal beyond just the text content.
    """
    features = pd.DataFrame(index=df.index)

    # Binary features — yes or no
    features['has_company_logo'] = df['has_company_logo'].fillna(0).astype(int)
    features['has_questions'] = df['has_questions'].fillna(0).astype(int)
    features['telecommuting'] = df['telecommuting'].fillna(0).astype(int)

    # Employment type — categorical to number
    employment_map = {
        'Full-time': 0,
        'Part-time': 1,
        'Contract': 2,
        'Temporary': 3,
        'Other': 4,
        '': 5
    }
    features['employment_type'] = df['employment_type'].fillna('').map(
        employment_map
    ).fillna(5).astype(int)

    # Experience level — categorical to number
    experience_map = {
        'Not Applicable': 0,
        'Internship': 1,
        'Entry level': 2,
        'Associate': 3,
        'Mid-Senior level': 4,
        'Director': 5,
        'Executive': 6,
        '': 3
    }
    features['required_experience'] = df['required_experience'].fillna('').map(
        experience_map
    ).fillna(3).astype(int)

    # Text length features
    features['description_length'] = df['description'].fillna('').apply(len)
    features['requirements_length'] = df['requirements'].fillna('').apply(len)

    # Salary range present or not
    features['has_salary_range'] = df['salary_range'].fillna('').apply(
        lambda x: 1 if x and x != '' else 0
    )

    return features


def prepare_inference_features(job_text: str, metadata: dict = None):
    """
    Prepare features for ONE job posting at inference time.
    Called every time a user scans a job in production.

    Args:
        job_text: Raw job description text from user
        metadata: Optional extra info like salary, remote status

    Returns:
        tuple: (cleaned_text, numeric_features_dict)
    """
    if metadata is None:
        metadata = {}

    numeric = {
        'has_company_logo': metadata.get('has_logo', 0),
        'has_questions': metadata.get('has_questions', 0),
        'telecommuting': metadata.get('is_remote', 0),
        'employment_type': 0,
        'required_experience': 3,
        'description_length': len(job_text),
        'requirements_length': 0,
        'has_salary_range': 1 if metadata.get('salary') else 0,
    }

    return clean_text(job_text), numeric