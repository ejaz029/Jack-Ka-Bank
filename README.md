# Jack Ka Bank

Full-stack Jack Ka Bank app with Python backend (FastAPI), MySQL/SQLite, and React frontend.

## Features
- Register user with default balance `100000.00`
- Login with username/password
- JWT in cookie; Dashboard with Check Balance and confetti

## Prerequisites
- **Python 3.12+** (for backend)
- **Node.js** (for frontend)
- **MySQL** (optional; app can use SQLite if MySQL is not set up)

---

## Quick start – run the project

**Terminal 1 – Backend (API on port 8001)**  
From project root:
```powershell
cd D:\Kodnest\Kodbank\backend
.\run.ps1
```
If you get "Create venv first", run once:
```powershell
cd D:\Kodnest\Kodbank\backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```
Then run `.\run.ps1` again.

**Terminal 2 – Frontend (UI on port 5173)**  
```powershell
cd D:\Kodnest\Kodbank\frontend
npm install
npm run dev
```

**Open in browser:** http://localhost:5173  
- Register → Login → Dashboard → Check Balance

**API base URL:** http://localhost:8001 (health: http://localhost:8001/api/health)

---

## Backend details

- **Port:** 8001 (frontend is configured to use this).
- **Database:** Reads `backend\.env`. If `DATABASE_URL` is set to MySQL, it uses MySQL; otherwise or on failure it uses SQLite (`backend/jack_ka_bank.db`).
- **MySQL:** Create DB: `CREATE DATABASE jack_ka_bank;`  
  In `.env`: `DATABASE_URL=mysql+pymysql://root:YOUR_PASSWORD@localhost:3306/jack_ka_bank`  
  (Use `jack_ka_bank`, no spaces. Config normalizes spaces to underscores.)
- **Without venv:** Use the venv’s Python so dependencies are found:  
  `.\run.ps1` or `.\.venv\Scripts\Activate.ps1` then `python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8001`

## Frontend details

- **Port:** 5173
- **API URL:** `http://localhost:8001` (override with `VITE_API_URL` in `frontend/.env` if needed)
- **Dashboard:** Sidebar (Dashboard, Account, Statements, Support, Settings) and in-page sections; floating **Bank Assistant** chatbot (bottom-right).
- **Chatbot (Groq):** The assistant uses **Groq** by default. Create `frontend/.env` and add:
  ```
  VITE_CHATBOT_API_KEY=your-groq-api-key
  ```
  Restart `npm run dev` after adding the key. Optional: `VITE_CHATBOT_ENDPOINT` to use a different API (e.g. OpenAI).  

## API
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/account/balance`
- `GET /api/health`
