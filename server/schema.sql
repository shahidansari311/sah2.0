-- RankSense AI — PostgreSQL Setup Script
-- Run this in psql or pgAdmin before starting the backend

-- Create the database (run as postgres superuser):
-- CREATE DATABASE ranksense;

-- Connect to ranksense and run the rest:

CREATE TABLE IF NOT EXISTS users (
    id          SERIAL PRIMARY KEY,
    name        TEXT NOT NULL,
    email       TEXT UNIQUE NOT NULL,
    password    TEXT NOT NULL,
    plan        TEXT NOT NULL DEFAULT 'Free',
    created_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS batches (
    id          SERIAL PRIMARY KEY,
    user_id     INTEGER REFERENCES users(id) ON DELETE CASCADE,
    job_title   TEXT,
    job_desc    TEXT,
    status      TEXT NOT NULL DEFAULT 'processing',
    created_at  TIMESTAMP DEFAULT NOW()
);

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

CREATE TABLE IF NOT EXISTS sections (
    id              SERIAL PRIMARY KEY,
    candidate_id    INTEGER REFERENCES candidates(id) ON DELETE CASCADE,
    section_name    TEXT NOT NULL,
    score           FLOAT NOT NULL DEFAULT 0,
    weight          FLOAT NOT NULL DEFAULT 10,
    level           TEXT NOT NULL DEFAULT 'moderate',
    feedback        TEXT
);

CREATE TABLE IF NOT EXISTS insights (
    id              SERIAL PRIMARY KEY,
    candidate_id    INTEGER REFERENCES candidates(id) ON DELETE CASCADE,
    type            TEXT NOT NULL,
    text            TEXT NOT NULL
);

-- Useful indexes
CREATE INDEX IF NOT EXISTS idx_batches_user ON batches(user_id);
CREATE INDEX IF NOT EXISTS idx_candidates_batch ON candidates(batch_id);
CREATE INDEX IF NOT EXISTS idx_sections_candidate ON sections(candidate_id);
CREATE INDEX IF NOT EXISTS idx_insights_candidate ON insights(candidate_id);
