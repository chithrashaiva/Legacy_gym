# Legacy Fitness Lounge - Run & Deployment Guide

This guide covers everything needed to **run locally**, **seed demo data**, **build for production**, and **deploy** the Legacy Fitness Lounge application (Django REST Framework backend + React Vite frontend).

---

## 📋 Architecture Overview
- **Backend**: Django 5 + Django REST Framework + SimpleJWT (Auth & Portal APIs)
- **Frontend**: React 19 + Vite + TailwindCSS + Lucide Icons
- **Database**: SQLite (default local) / PostgreSQL (production-ready)
- **Portals**:
  - Landing Website: `/`
  - Member Dashboard: `/dashboard` (or `/member-dashboard`)
  - Gym Admin & Trainer Portal: `/admin-portal`
  - Authentication: `/login`, `/register`

---

## 💻 1. Local Development Setup

You will need two terminals: one for the Django backend and one for the React frontend.

### A) Terminal 1: Backend (Django)

1. Open PowerShell in the project root:
   ```powershell
   cd backend
   ```
2. Activate or create virtual environment:
   ```powershell
   # If .venv does not exist:
   python -m venv .venv

   # Activate the virtual environment:
   .\.venv\Scripts\Activate.ps1
   ```
3. Install dependencies:
   ```powershell
   pip install -r requirements.txt
   ```
4. Run migrations:
   ```powershell
   python manage.py migrate
   ```
5. *(Recommended)* Seed sample members, workouts (Mon–Sat), diet plans, and trainer instructions:
   ```powershell
   python seed_portal.py
   ```
6. Start the Django API server:
   ```powershell
   python manage.py runserver 0.0.0.0:8000
   ```
   Backend is now live at: **`http://localhost:8000`**  
   API Health check: `http://localhost:8000/api/`

---

### B) Terminal 2: Frontend (React + Vite)

1. Open a second PowerShell terminal in the project root:
   ```powershell
   cd frontend
   ```
2. Install dependencies:
   ```powershell
   npm install
   ```
3. Start the Vite dev server:
   ```powershell
   npm run dev -- --host 0.0.0.0
   ```
4. Access the web application:
   - **Frontend App**: **`http://localhost:5173`**
   - **Member Dashboard**: `http://localhost:5173/dashboard` or `http://localhost:5173/member-dashboard`
   - **Admin Portal**: `http://localhost:5173/admin-portal`

---

## 🔑 2. Demo Credentials

If you ran `python seed_portal.py`, the following demo accounts are available:

| Role | Username | Password | Access / Features |
| :--- | :--- | :--- | :--- |
| **Super Admin / Owner** | `nagendraappu` | `Nagendralegacy123` | Full Admin Portal & Django Admin control |
| **Admin / Head Coach** | `admin` | `admin123` | Full Admin Portal, member fee updates, instruction broadcasting |
| **Member / Athlete** | `johndoe` | `member123` | Member Dashboard, Mon–Sat workouts, diet plans, balance dues |

---

## 🚀 3. Deployment Guides

The project already includes a production-ready `render.yaml` configuration supporting either **Unified Monolith deployment** or **Decoupled Frontend/Backend deployment**.

### Option A: Render.com (Recommended - Zero Setup)

The repository has a preconfigured [`render.yaml`](./render.yaml).

#### 1-Click / Blueprint Deploy on Render:
1. Push your code to GitHub:
   ```bash
   git add .
   git commit -m "Add Member Dashboard and Admin Portal"
   git push origin main
   ```
2. In [Render Dashboard](https://dashboard.render.com), click **New +** -> **Blueprint**.
3. Connect your repository. Render will automatically detect `render.yaml`.
4. Choose the service mode:
   - **Unified Service (`legacy-gym`)**: Builds React frontend into Django static files and serves everything through Gunicorn on a single domain.
   - **Standalone Backend + Frontend**: Deploys backend web service + static frontend site.
5. Click **Apply**.

---

### Option B: Unified Production Build (Single Server / VPS / Docker)

You can serve both React and Django from a single server:

1. **Build Frontend**:
   ```powershell
   cd frontend
   npm install
   npm run build
   ```
   *(This outputs compiled static files into `frontend/dist/`)*

2. **Collect Static Files in Django**:
   ```powershell
   cd ../backend
   python manage.py collectstatic --noinput
   python manage.py migrate
   ```

3. **Run with Production WSGI Server (Gunicorn or Waitress)**:
   - On Linux/Render:
     ```bash
     gunicorn config.wsgi:application --bind 0.0.0.0:8000
     ```
   - On Windows:
     ```powershell
     pip install waitress
     waitress-serve --port=8000 config.wsgi:application
     ```
   Django serves both the API (`/api/`) and the Single Page Application (`/*`).

---

### Option C: Vercel / Netlify (Frontend) + Render / Railway (Backend)

1. **Deploy Backend (Render / Railway / Fly.io)**:
   - Root directory: `backend`
   - Build command: `pip install -r requirements.txt && python manage.py migrate`
   - Start command: `gunicorn config.wsgi:application`
   - Set environment variables:
     - `DEBUG`: `False`
     - `SECRET_KEY`: `<your-random-secret-key>`
     - `ALLOWED_HOSTS`: `*` (or your domain)
     - `CORS_ALLOWED_ORIGINS`: `https://your-frontend-domain.vercel.app`

2. **Deploy Frontend (Vercel / Netlify / Cloudflare Pages)**:
   - Root directory: `frontend`
   - Build command: `npm run build`
   - Output directory: `dist`
   - Set environment variable:
     - `VITE_API_URL`: `https://your-backend.onrender.com/api`

---

## 🛠️ Common Troubleshooting

| Issue | Solution |
| :--- | :--- |
| **CORS error on API calls** | Ensure `backend/config/settings.py` includes your frontend domain in `CORS_ALLOWED_ORIGINS` or `CORS_ALLOW_ALL_ORIGINS = True`. |
| **Blank page on Member Dashboard** | Run `python seed_portal.py` in `backend/` to populate default workouts and membership data. |
| **Port 8000 or 5173 already in use** | Specify a custom port: `python manage.py runserver 0.0.0.0:8080` or `npm run dev -- --port 3000`. |
| **Static files not loading in production** | Run `python manage.py collectstatic --noinput` and ensure WhiteNoise is enabled in `MIDDLEWARE`. |
