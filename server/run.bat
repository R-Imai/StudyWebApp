cd /d %~dp0
uvicorn endpoint:app --reload --host 0.0.0.0 --port 5555
