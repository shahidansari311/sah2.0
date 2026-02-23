# RankSense AI 2.0 — Full-Stack Setup Guide

## Architecture

```
d:\sah2.0\
├── client/          (React + Vite frontend)
│   └── src/
│       ├── services/api.js      ← All API calls
│       ├── context/AuthContext  ← Real JWT auth
│       └── pages/
│           ├── Upload.jsx       ← Real file upload
│           ├── Analysis.jsx     ← Real API data
│           └── Ranking.jsx      ← Real TOPSIS ranking
└── server/          (Python FastAPI backend)
    ├── main.py          ← API endpoints
    ├── auth.py          ← JWT + bcrypt
    ├── database.py      ← PostgreSQL init
    ├── resume_parser.py ← Resume analysis engine
    └── schema.sql       ← DB schema reference
```

## Prerequisites

- **Python 3.10+**
- **PostgreSQL 14+** running locally
- **Node.js 18+**

---

## 1. PostgreSQL Setup

```sql
-- In psql or pgAdmin:
CREATE DATABASE ranksense;
```

The tables are auto-created when the server starts (`database.py → init_db()`).

---

## 2. Backend Setup

```powershell
cd d:\sah2.0\server

# Install dependencies
pip install -r requirements.txt

# Configure environment (edit as needed)
# .env already has defaults for local development
```

Edit `server/.env` to match your PostgreSQL credentials:
```env
DATABASE_URL=postgresql://YOUR_USER:YOUR_PASSWORD@localhost:5432/ranksense
SECRET_KEY=your-secret-key-here
FRONTEND_URL=http://localhost:5173
```

Start the backend:
```powershell
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

API docs available at: http://localhost:8000/docs

---

## 3. Frontend Setup

```powershell
cd d:\sah2.0\client
npm install
npm run dev
```

Frontend at: http://localhost:5173

The `client/.env` is pre-configured:
```env
VITE_API_URL=http://localhost:8000
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Create account |
| POST | `/auth/login` | Login, returns JWT |
| GET  | `/auth/me` | Get current user |
| POST | `/analyze` | Upload & analyze resumes |
| GET  | `/batches` | List past batches |
| GET  | `/batches/{id}` | Get batch results |
| GET  | `/latest-batch` | Get most recent batch |
| GET  | `/health` | Health check |

---

## Database Schema

- **users**: id, name, email, password (bcrypt), plan, created_at
- **batches**: id, user_id, job_title, job_desc, status, created_at
- **candidates**: id, batch_id, name, role, scores, grade, avatar, keywords, ...
- **sections**: id, candidate_id, section_name, score, weight, level, feedback
- **insights**: id, candidate_id, type, text

---

## Resume Analysis Pipeline

1. **Upload** → Files sent via multipart form to `/analyze`
2. **Parse** → pdfplumber (PDF) / python-docx (DOCX) extract text
3. **Score** → 8 sections scored: Contact, Education, Experience, Skills, Projects, Achievements, Summary, Formatting
4. **TOPSIS** → NumPy/SciPy geometric distance ranking
5. **Persist** → Results saved to PostgreSQL
6. **Return** → JSON with all candidate data, sections, insights
