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

## Deploy (Vercel + Render)

**Live URLs**  
- **Frontend (Vercel):** https://jack-ka-bank-git-main-ejazs-projects-407c6b14.vercel.app/  
- **Backend (Render):** https://jack-ka-bank.onrender.com  

Use this checklist so the **deployed link works** (login, cookies, balance).

**Backend (Render)**  
1. Deploy the `backend` folder as a Web Service.  
   - Build: `pip install -r requirements.txt`  
   - Start: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
2. **Required env vars:**
   - `DATABASE_URL` — e.g. Render PostgreSQL or leave default for SQLite.
   - `JWT_SECRET` — long random string.
   - **`APP_ENV`** = **`production`** — so cookies work from the Vercel frontend (Secure + SameSite=None).
3. **Optional:** `FRONTEND_ORIGINS` = your Vercel URL (e.g. `https://your-app.vercel.app`) if you use a custom domain; `*.vercel.app` is already allowed.
4. **Cold start:** Free tier sleeps after ~15 min. First request can take 30–60 s; frontend timeout is 65 s. If you see "Cannot reach backend", open `https://jack-ka-bank.onrender.com/api/health` in a tab, wait for `{"status":"ok"}`, then try again.

**Frontend (Vercel)**  
1. Deploy the `frontend` folder.
2. **Required env var:** **`VITE_API_URL`** = **`https://jack-ka-bank.onrender.com`** (no trailing slash).
3. Redeploy after adding the variable so the build picks it up.

**Troubleshooting**  
- **"Not Found" on login:** Set `VITE_API_URL` = `https://jack-ka-bank.onrender.com` on Vercel and redeploy.  
- **"Cannot reach backend":** Backend may be sleeping; wake it via `/api/health` (see above). Ensure Render has `APP_ENV=production`.  
- **Login succeeds but dashboard/balance fails:** Cookies are not set cross-origin. On Render set **`APP_ENV=production`** (and redeploy) so the backend uses Secure + SameSite=None cookies.

---

## Simple debugging (deployed app)

**Step 1 – Is the backend up?**  
Open this in your browser:  
**https://jack-ka-bank.onrender.com/api/health**

- If you see `{"status":"ok"}` → backend is running. Go to Step 2.  
- If it never loads or errors → backend is down or sleeping. Wait 1–2 minutes and try the link again. On Render, check the service is deployed and not crashed.

**Step 2 – Try login on the app**  
Open your **Vercel** app (e.g. `https://jack-ka-bank-git-main-ejazs-projects-407c6b14.vercel.app`), go to Login, enter username/password, click Sign in.

- If you see "Cannot reach backend" → do Step 1 first (open the health link, wait for `{"status":"ok"}`, then try Sign in again).  
- If login works but dashboard says "Unauthorized" or balance fails → on Render set `APP_ENV=production` and redeploy the backend.

**Step 3 – Check env vars (only if still broken)**  
- **Vercel:** Project → Settings → Environment Variables. You must have **`VITE_API_URL`** = **`https://jack-ka-bank.onrender.com`** (no `https://` at the end, no `/api`). Save and redeploy.  
- **Render:** Environment tab. You must have **`APP_ENV`** = **`production`**. Save and redeploy.

**Summary:** Fix one thing at a time: first backend (health link), then login, then env vars if needed.

## API
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/account/balance`
- `GET /api/health`
