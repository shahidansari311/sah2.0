@echo off
echo Starting RankSense AI Backend (FastAPI + PostgreSQL)...
echo Make sure PostgreSQL is running and .env is configured!
echo.
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
pause
