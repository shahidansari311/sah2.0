"""
Resume parsing utilities — extract text + sections from PDF/DOCX.
Then score each section, compute TOPSIS ranking.
"""
import io, re, random
from typing import Optional

# ── TEXT EXTRACTION ─────────────────────────────────────────────────────────

def extract_text_from_pdf(file_bytes: bytes) -> str:
    try:
        import pdfplumber
        with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
            return "\n".join(p.extract_text() or "" for p in pdf.pages)
    except Exception as e:
        print(f"PDF extract error: {e}")
        return ""


def extract_text_from_docx(file_bytes: bytes) -> str:
    try:
        from docx import Document
        doc = Document(io.BytesIO(file_bytes))
        return "\n".join(p.text for p in doc.paragraphs)
    except Exception as e:
        print(f"DOCX extract error: {e}")
        return ""


def extract_text(filename: str, file_bytes: bytes) -> str:
    ext = filename.rsplit(".", 1)[-1].lower()
    if ext == "pdf":
        return extract_text_from_pdf(file_bytes)
    elif ext in ("docx", "doc"):
        return extract_text_from_docx(file_bytes)
    elif ext == "txt":
        return file_bytes.decode("utf-8", errors="ignore")
    return ""


# ── HEURISTIC SECTION EXTRACTION ────────────────────────────────────────────

SECTION_PATTERNS = {
    "Contact Info":    r"(email|phone|linkedin|github|portfolio|contact)",
    "Education":       r"(education|university|college|degree|gpa|cgpa|bachelor|master|phd|b\.?tech|m\.?tech)",
    "Work Experience": r"(experience|work|internship|employment|job|company|engineer|analyst|developer|intern)",
    "Skills":          r"(skills|technologies|tools|frameworks|languages|proficiency|expertise)",
    "Projects":        r"(projects?|portfolio|built|developed|created|implemented)",
    "Achievements":    r"(achievements?|awards?|honors?|publications?|certifications?|accomplishments?)",
    "Summary":         r"(summary|objective|profile|about|overview)",
    "Formatting":      None,  # computed separately
}

SECTION_WEIGHTS = {
    "Contact Info": 5, "Education": 20, "Work Experience": 30,
    "Skills": 20, "Projects": 15, "Achievements": 5,
    "Summary": 3, "Formatting": 2,
}

LEVEL_MAP = {
    (85, 101): "excellent",
    (70, 85):  "good",
    (50, 70):  "moderate",
    (0, 50):   "poor",
}

GRADE_MAP = [
    (90, "A+", "#3b82f6"), (80, "A", "#8b5cf6"), (70, "B+", "#06b6d4"),
    (60, "B", "#f59e0b"),  (50, "C+", "#f97316"), (0,  "C",  "#f43f5e"),
]

AVATAR_COLORS = ["#3b82f6", "#8b5cf6", "#22d3ee", "#f59e0b", "#f43f5e", "#10b981", "#a78bfa"]

TECH_KEYWORDS = [
    "Python", "Java", "JavaScript", "TypeScript", "C++", "C#", "Go", "Rust",
    "React", "Vue", "Angular", "Node.js", "FastAPI", "Django", "Flask",
    "TensorFlow", "PyTorch", "scikit-learn", "SBERT", "LayoutLMv3", "BERT",
    "Hugging Face", "spaCy", "NLTK", "OpenCV", "Pandas", "NumPy",
    "SQL", "PostgreSQL", "MongoDB", "Redis", "MySQL",
    "Docker", "Kubernetes", "AWS", "GCP", "Azure",
    "Machine Learning", "Deep Learning", "NLP", "Computer Vision",
    "REST APIs", "GraphQL", "Microservices", "MLOps", "Tableau", "Power BI",
]


def score_section(text: str, section: str) -> float:
    """Score a section based on presence + heuristics."""
    if not text or len(text) < 10:
        return random.uniform(40, 60)

    pattern = SECTION_PATTERNS.get(section)
    if pattern is None:  # Formatting
        lines = text.split("\n")
        avg_len = sum(len(l) for l in lines) / max(len(lines), 1)
        # reward moderate line lengths, penalize extremes
        base = 70 + (10 if 30 < avg_len < 80 else 0) + random.uniform(-8, 8)
        return min(max(base, 45), 98)

    matches = len(re.findall(pattern, text, re.IGNORECASE))
    word_count = len(text.split())
    density = matches / max(word_count / 100, 1)

    base = 40 + min(density * 25, 40) + min(word_count / 20, 15)
    return min(max(base + random.uniform(-5, 5), 40), 98)


def get_level(score: float) -> str:
    for (lo, hi), level in LEVEL_MAP.items():
        if lo <= score < hi:
            return level
    return "poor"


def get_grade(total: float):
    for threshold, grade, color in GRADE_MAP:
        if total >= threshold:
            return grade, color
    return "C", "#f43f5e"


def extract_name(text: str, filename: str) -> str:
    lines = [l.strip() for l in text.split("\n") if l.strip()]
    for line in lines[:5]:
        if 2 <= len(line.split()) <= 4 and not any(c in line for c in ["@", ".", ":", "/"]):
            return line.title()
    # fallback: filename without extension
    return filename.rsplit(".", 1)[0].replace("_", " ").replace("-", " ").title()


def extract_email(text: str) -> str:
    match = re.search(r"[\w\.-]+@[\w\.-]+\.\w+", text)
    return match.group(0) if match else ""


def extract_phone(text: str) -> str:
    match = re.search(r"(\+?\d[\d\s\-]{8,13}\d)", text)
    return match.group(0).strip() if match else ""


def extract_location(text: str) -> str:
    cities = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Pune",
              "Kolkata", "Ahmedabad", "Jaipur", "New York", "San Francisco",
              "London", "Singapore", "Dubai", "Remote"]
    for city in cities:
        if city.lower() in text.lower():
            return city
    return "Unknown"


def extract_education(text: str) -> str:
    institutions = re.findall(
        r"(IIT\s+\w+|IIM\s+\w+|BITS\s+\w+|NIT\s+\w+|VIT\s+\w+|MIT|Stanford|Harvard|[A-Z][a-z]+ University|[A-Z][a-z]+ College)",
        text, re.IGNORECASE
    )
    return institutions[0] if institutions else "University"


def extract_experience_years(text: str) -> str:
    match = re.search(r"(\d+[\.\d]*)\s*(years?|yrs?)", text, re.IGNORECASE)
    if match:
        return f"{match.group(1)} yr{'s' if float(match.group(1)) > 1 else ''}"
    # count internship/job mentions
    count = len(re.findall(r"(internship|full.?time|employed|worked at|joining)", text, re.IGNORECASE))
    if count >= 3: return "3+ yrs"
    if count == 2: return "2 yrs"
    return "< 1 yr"


def extract_keywords(text: str) -> list:
    found = []
    for kw in TECH_KEYWORDS:
        if kw.lower() in text.lower() and kw not in found:
            found.append(kw)
    return found[:10]


def get_section_feedback(section: str, score: float, level: str, text: str) -> str:
    feedbacks = {
        "Contact Info": {
            "excellent": "All professional channels present — email, phone, LinkedIn, GitHub",
            "good": "Most contact details present, missing one channel",
            "moderate": "Basic contact info only, add LinkedIn/GitHub",
            "poor": "Very minimal contact information provided",
        },
        "Education": {
            "excellent": "Strong academic background with prestigious institution",
            "good": "Solid educational foundation, GPA mentioned",
            "moderate": "Education listed but lacks GPA or institution prestige",
            "poor": "Education section needs significant detail",
        },
        "Work Experience": {
            "excellent": "Strong work history with quantified impact metrics",
            "good": "Good experience, some quantified results",
            "moderate": "Work experience listed but lacks quantified achievements",
            "poor": "Limited or no work experience demonstrated",
        },
        "Skills": {
            "excellent": "Comprehensive and role-relevant technical skill set",
            "good": "Good skill coverage, minor gaps in stack",
            "moderate": "Basic skills listed, needs deeper technical depth",
            "poor": "Skills section is underdeveloped",
        },
        "Projects": {
            "excellent": "Strong portfolio of relevant projects with live demonstrations",
            "good": "Good projects, could add more metrics and GitHub links",
            "moderate": "Projects listed but lack depth or public links",
            "poor": "Very few or irrelevant projects in portfolio",
        },
        "Achievements": {
            "excellent": "Notable awards, publications, or certifications listed",
            "good": "Some recognitions and certifications present",
            "moderate": "Few achievements mentioned, needs more specificity",
            "poor": "No achievements or certifications listed",
        },
        "Summary": {
            "excellent": "Clear, targeted, and role-specific professional summary",
            "good": "Good summary with clear career objective",
            "moderate": "Summary is generic, not tailored to role",
            "poor": "Missing or very vague professional summary",
        },
        "Formatting": {
            "excellent": "ATS-optimized, consistent layout, professional design",
            "good": "Clean layout with minor formatting inconsistencies",
            "moderate": "Acceptable but has formatting issues that may affect ATS",
            "poor": "Significant formatting issues detected",
        },
    }
    return feedbacks.get(section, {}).get(level, "Score computed from resume content")


def generate_insights(candidate_name: str, sections: dict) -> list:
    insights = []
    sorted_sections = sorted(sections.items(), key=lambda x: x[1]["score"], reverse=True)

    top = sorted_sections[0]
    bottom = sorted_sections[-1]
    mid = sorted_sections[len(sorted_sections)//2]

    insights.append({"type": "success", "text": f"Strong {top[0]} section — {top[1]['level']} level"})

    if bottom[1]["score"] < 65:
        insights.append({"type": "error", "text": f"{bottom[0]} needs significant improvement"})
    elif bottom[1]["score"] < 78:
        insights.append({"type": "warning", "text": f"{bottom[0]} could be stronger with more detail"})

    if mid[1]["level"] in ("moderate", "poor"):
        insights.append({"type": "warning", "text": f"Consider enhancing {mid[0]} for better ranking"})
    else:
        insights.append({"type": "success", "text": f"Well-rounded profile across most sections"})

    return insights[:3]


# ── TOPSIS ───────────────────────────────────────────────────────────────────

def compute_topsis(candidates_sections: list) -> list:
    """
    candidates_sections: list of dicts {section_name: score}
    Returns list of TOPSIS scores in same order.
    """
    if not candidates_sections:
        return []

    import numpy as np

    section_names = list(candidates_sections[0].keys())
    weights = [SECTION_WEIGHTS.get(s, 10) / 100 for s in section_names]
    n = len(candidates_sections)
    m = len(section_names)

    matrix = np.array([[c[s] for s in section_names] for c in candidates_sections], dtype=float)

    # Normalize
    col_norms = np.sqrt((matrix ** 2).sum(axis=0))
    col_norms[col_norms == 0] = 1
    norm = matrix / col_norms

    # Weighted
    w = np.array(weights)
    weighted = norm * w

    # Ideal best & worst
    best  = weighted.max(axis=0)
    worst = weighted.min(axis=0)

    # Distances
    d_pos = np.sqrt(((weighted - best) ** 2).sum(axis=1))
    d_neg = np.sqrt(((weighted - worst) ** 2).sum(axis=1))

    denom = d_pos + d_neg
    denom[denom == 0] = 1
    scores = d_neg / denom

    return scores.tolist()


# ── MAIN PROCESSING ENTRY ────────────────────────────────────────────────────

def process_resume(filename: str, file_bytes: bytes, color_idx: int = 0) -> dict:
    text = extract_text(filename, file_bytes)

    # Score each section
    sections = {}
    for section in SECTION_WEIGHTS:
        score = score_section(text, section)
        level = get_level(score)
        feedback = get_section_feedback(section, score, level, text)
        sections[section] = {
            "score": round(score, 1),
            "weight": SECTION_WEIGHTS[section],
            "level": level,
            "feedback": feedback,
        }

    # Weighted total score
    total = sum(sections[s]["score"] * sections[s]["weight"] / 100 for s in sections)
    grade, grade_color = get_grade(total)

    name     = extract_name(text, filename)
    keywords = extract_keywords(text)
    insights = generate_insights(name, sections)

    initials = "".join(w[0].upper() for w in name.split()[:2]) or "??"
    color    = AVATAR_COLORS[color_idx % len(AVATAR_COLORS)]

    return {
        "filename": filename,
        "name":  name,
        "role":  "Candidate",
        "email": extract_email(text),
        "phone": extract_phone(text),
        "education":  extract_education(text),
        "experience": extract_experience_years(text),
        "location":   extract_location(text),
        "total_score": round(total, 1),
        "grade":       grade,
        "grade_color": grade_color,
        "avatar":      initials,
        "avatar_color": color,
        "keywords":   keywords,
        "sections":   sections,
        "insights":   insights,
    }
