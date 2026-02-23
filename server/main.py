"""
RankSense AI — FastAPI main application
PostgreSQL backend with JWT auth + resume analysis
"""
import os
from fastapi import FastAPI, HTTPException, Depends, UploadFile, File, Form, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from dotenv import load_dotenv

from database import get_conn, init_db
from auth import hash_password, verify_password, create_access_token, decode_token
from resume_parser import process_resume, compute_topsis

load_dotenv()

# ── APP ───────────────────────────────────────────────────────────────────────

app = FastAPI(title="RankSense AI API", version="2.0.0")

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL, "http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


@app.on_event("startup")
def startup():
    init_db()
    print("🚀 RankSense AI API started")


# ── AUTH ──────────────────────────────────────────────────────────────────────

class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str


class LoginRequest(BaseModel):
    email: str
    password: str


def get_current_user(token: str = Depends(oauth2_scheme)):
    payload = decode_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token payload")
    conn = get_conn()
    cur = conn.cursor()
    cur.execute("SELECT id, name, email, plan, created_at FROM users WHERE id = %s", (user_id,))
    user = cur.fetchone()
    cur.close(); conn.close()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return dict(user)


@app.post("/auth/register", status_code=201)
def register(body: RegisterRequest):
    if len(body.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters")
    conn = get_conn()
    cur = conn.cursor()

    cur.execute("SELECT id FROM users WHERE email = %s", (body.email,))
    if cur.fetchone():
        cur.close(); conn.close()
        raise HTTPException(status_code=409, detail="Email already registered")

    hashed = hash_password(body.password)
    cur.execute(
        "INSERT INTO users (name, email, password) VALUES (%s, %s, %s) RETURNING id, name, email, plan, created_at",
        (body.name, body.email, hashed)
    )
    user = dict(cur.fetchone())
    conn.commit(); cur.close(); conn.close()

    token = create_access_token({"sub": str(user["id"])})
    return {
        "token": token,
        "user": {
            "id": user["id"],
            "name": user["name"],
            "email": user["email"],
            "plan": user["plan"],
            "avatar": user["name"][0].upper(),
            "joined": user["created_at"].strftime("%b %Y"),
        }
    }


@app.post("/auth/login")
def login(body: LoginRequest):
    conn = get_conn()
    cur = conn.cursor()
    cur.execute("SELECT id, name, email, password, plan, created_at FROM users WHERE email = %s", (body.email,))
    user = cur.fetchone()
    cur.close(); conn.close()

    if not user or not verify_password(body.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    user = dict(user)
    token = create_access_token({"sub": str(user["id"])})
    return {
        "token": token,
        "user": {
            "id": user["id"],
            "name": user["name"],
            "email": user["email"],
            "plan": user["plan"],
            "avatar": user["name"][0].upper(),
            "joined": user["created_at"].strftime("%b %Y"),
        }
    }


@app.get("/auth/me")
def get_me(current_user: dict = Depends(get_current_user)):
    user = current_user
    return {
        "id": user["id"],
        "name": user["name"],
        "email": user["email"],
        "plan": user["plan"],
        "avatar": user["name"][0].upper(),
        "joined": user["created_at"].strftime("%b %Y") if user.get("created_at") else "Unknown",
    }


# ── RESUME UPLOAD & ANALYSIS ─────────────────────────────────────────────────

@app.post("/analyze")
async def analyze_resumes(
    files: List[UploadFile] = File(...),
    job_title: Optional[str] = Form(None),
    job_desc: Optional[str] = Form(None),
    current_user: dict = Depends(get_current_user),
):
    if not files:
        raise HTTPException(status_code=400, detail="No files provided")
    if len(files) > 25:
        raise HTTPException(status_code=400, detail="Maximum 25 files per batch")

    # Create batch
    conn = get_conn()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO batches (user_id, job_title, job_desc, status) VALUES (%s, %s, %s, 'processing') RETURNING id",
        (current_user["id"], job_title, job_desc)
    )
    batch_id = cur.fetchone()["id"]
    conn.commit()

    # Process each resume
    parsed = []
    for idx, file in enumerate(files):
        content = await file.read()
        result = process_resume(file.filename, content, color_idx=idx)
        result["batch_id"] = batch_id
        result["color_idx"] = idx
        parsed.append(result)

    # Compute TOPSIS ranking
    sections_list = [p["sections"] for p in parsed]
    section_scores_list = [{s: d["score"] for s, d in secs.items()} for secs in sections_list]
    topsis_scores = compute_topsis(section_scores_list)

    # Rank candidates
    for i, p in enumerate(parsed):
        p["topsis_score"] = round(topsis_scores[i] if topsis_scores else 0.5, 4)

    parsed.sort(key=lambda x: x["topsis_score"], reverse=True)

    # Save to DB
    candidate_ids = []
    for rank_pos, p in enumerate(parsed, start=1):
        cur.execute("""
            INSERT INTO candidates
              (batch_id, name, role, email, phone, education, experience, location,
               total_score, topsis_score, grade, grade_color, rank_position,
               avatar, avatar_color, keywords)
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
            RETURNING id
        """, (
            batch_id, p["name"], p["role"], p["email"], p["phone"],
            p["education"], p["experience"], p["location"],
            p["total_score"], p["topsis_score"], p["grade"], p["grade_color"],
            rank_pos, p["avatar"], p["avatar_color"], p["keywords"]
        ))
        cand_id = cur.fetchone()["id"]
        candidate_ids.append(cand_id)
        p["db_id"]      = cand_id
        p["rank"]       = rank_pos

        # Sections
        for sec_name, sec_data in p["sections"].items():
            cur.execute("""
                INSERT INTO sections (candidate_id, section_name, score, weight, level, feedback)
                VALUES (%s, %s, %s, %s, %s, %s)
            """, (cand_id, sec_name, sec_data["score"], sec_data["weight"],
                  sec_data["level"], sec_data["feedback"]))

        # Insights
        for ins in p["insights"]:
            cur.execute(
                "INSERT INTO insights (candidate_id, type, text) VALUES (%s, %s, %s)",
                (cand_id, ins["type"], ins["text"])
            )

    cur.execute("UPDATE batches SET status = 'done' WHERE id = %s", (batch_id,))
    conn.commit(); cur.close(); conn.close()

    return {
        "batch_id": batch_id,
        "count": len(parsed),
        "candidates": [_format_candidate(p) for p in parsed],
    }


# ── RESULTS RETRIEVAL ─────────────────────────────────────────────────────────

@app.get("/batches")
def list_batches(current_user: dict = Depends(get_current_user)):
    conn = get_conn()
    cur = conn.cursor()
    cur.execute("""
        SELECT b.id, b.job_title, b.status, b.created_at,
               COUNT(c.id) AS candidate_count
        FROM batches b
        LEFT JOIN candidates c ON c.batch_id = b.id
        WHERE b.user_id = %s
        GROUP BY b.id
        ORDER BY b.created_at DESC
        LIMIT 20
    """, (current_user["id"],))
    rows = [dict(r) for r in cur.fetchall()]
    cur.close(); conn.close()
    return rows


@app.get("/batches/{batch_id}")
def get_batch(batch_id: int, current_user: dict = Depends(get_current_user)):
    conn = get_conn()
    cur = conn.cursor()

    # Verify ownership
    cur.execute("SELECT id FROM batches WHERE id = %s AND user_id = %s", (batch_id, current_user["id"]))
    if not cur.fetchone():
        cur.close(); conn.close()
        raise HTTPException(status_code=404, detail="Batch not found")

    cur.execute("""
        SELECT c.*, array_agg(DISTINCT c.keywords) as kws
        FROM candidates c
        WHERE c.batch_id = %s
        ORDER BY c.rank_position
    """, (batch_id,))
    candidates_raw = [dict(r) for r in cur.fetchall()]

    result = []
    for cand in candidates_raw:
        # Sections
        cur.execute("SELECT * FROM sections WHERE candidate_id = %s", (cand["id"],))
        sections = {r["section_name"]: {
            "score": float(r["score"]),
            "weight": float(r["weight"]),
            "level": r["level"],
            "feedback": r["feedback"],
        } for r in cur.fetchall()}

        # Insights
        cur.execute("SELECT type, text FROM insights WHERE candidate_id = %s", (cand["id"],))
        insights = [{"type": r["type"], "text": r["text"]} for r in cur.fetchall()]

        result.append({
            "id": cand["id"],
            "name": cand["name"],
            "role": cand["role"],
            "email": cand["email"],
            "phone": cand["phone"],
            "education": cand["education"],
            "experience": cand["experience"],
            "location": cand["location"],
            "total": float(cand["total_score"]),
            "topsis": float(cand["topsis_score"]),
            "rank": cand["rank_position"],
            "grade": cand["grade"],
            "gradeColor": cand["grade_color"],
            "avatar": cand["avatar"],
            "color": cand["avatar_color"],
            "keywords": cand["keywords"] or [],
            "sections": sections,
            "insights": insights,
        })

    cur.close(); conn.close()
    return {"batch_id": batch_id, "candidates": result}


@app.get("/latest-batch")
def get_latest_batch(current_user: dict = Depends(get_current_user)):
    conn = get_conn()
    cur = conn.cursor()
    cur.execute("""
        SELECT id FROM batches
        WHERE user_id = %s AND status = 'done'
        ORDER BY created_at DESC
        LIMIT 1
    """, (current_user["id"],))
    row = cur.fetchone()
    cur.close(); conn.close()

    if not row:
        raise HTTPException(status_code=404, detail="No completed batches found")
    return get_batch(row["id"], current_user)


# ── HELPERS ───────────────────────────────────────────────────────────────────

def _format_candidate(p: dict) -> dict:
    return {
        "id": p.get("db_id", 0),
        "name": p["name"],
        "role": p["role"],
        "email": p["email"],
        "education": p["education"],
        "experience": p["experience"],
        "location": p["location"],
        "total": p["total_score"],
        "topsis": p["topsis_score"],
        "rank": p["rank"],
        "grade": p["grade"],
        "gradeColor": p["grade_color"],
        "avatar": p["avatar"],
        "color": p["avatar_color"],
        "keywords": p.get("keywords", []),
        "sections": p["sections"],
        "insights": p["insights"],
    }


# ── HEALTH ────────────────────────────────────────────────────────────────────

@app.get("/health")
def health():
    return {"status": "ok", "service": "RankSense AI API"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
