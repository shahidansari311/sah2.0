"""
RankSense AI — Database layer (PostgreSQL via psycopg2)
"""
import os, psycopg2, psycopg2.extras
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/ranksense")


def get_conn():
    return psycopg2.connect(DATABASE_URL, cursor_factory=psycopg2.extras.RealDictCursor)


def init_db():
    """Create tables if they don't exist."""
    conn = get_conn()
    cur = conn.cursor()

    cur.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id          SERIAL PRIMARY KEY,
            name        TEXT NOT NULL,
            email       TEXT UNIQUE NOT NULL,
            password    TEXT NOT NULL,
            plan        TEXT NOT NULL DEFAULT 'Free',
            created_at  TIMESTAMP DEFAULT NOW()
        );
    """)

    cur.execute("""
        CREATE TABLE IF NOT EXISTS batches (
            id          SERIAL PRIMARY KEY,
            user_id     INTEGER REFERENCES users(id) ON DELETE CASCADE,
            job_title   TEXT,
            job_desc    TEXT,
            status      TEXT NOT NULL DEFAULT 'processing',
            created_at  TIMESTAMP DEFAULT NOW()
        );
    """)

    cur.execute("""
        CREATE TABLE IF NOT EXISTS candidates (
            id              SERIAL PRIMARY KEY,
            batch_id        INTEGER REFERENCES batches(id) ON DELETE CASCADE,
            name            TEXT NOT NULL,
            role            TEXT,
            email           TEXT,
            phone           TEXT,
            education       TEXT,
            experience      TEXT,
            location        TEXT,
            total_score     FLOAT NOT NULL DEFAULT 0,
            topsis_score    FLOAT NOT NULL DEFAULT 0,
            grade           TEXT,
            grade_color     TEXT,
            rank_position   INTEGER,
            avatar          TEXT,
            avatar_color    TEXT,
            keywords        TEXT[],
            created_at      TIMESTAMP DEFAULT NOW()
        );
    """)

    cur.execute("""
        CREATE TABLE IF NOT EXISTS sections (
            id              SERIAL PRIMARY KEY,
            candidate_id    INTEGER REFERENCES candidates(id) ON DELETE CASCADE,
            section_name    TEXT NOT NULL,
            score           FLOAT NOT NULL DEFAULT 0,
            weight          FLOAT NOT NULL DEFAULT 10,
            level           TEXT NOT NULL DEFAULT 'moderate',
            feedback        TEXT
        );
    """)

    cur.execute("""
        CREATE TABLE IF NOT EXISTS insights (
            id              SERIAL PRIMARY KEY,
            candidate_id    INTEGER REFERENCES candidates(id) ON DELETE CASCADE,
            type            TEXT NOT NULL,
            text            TEXT NOT NULL
        );
    """)

    conn.commit()
    cur.close()
    conn.close()
    print("✅ Database tables initialized.")
