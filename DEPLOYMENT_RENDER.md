# 🚀 Deploying Legacy Gym (Frontend + Backend) on Render.com

This guide explains how to deploy both the **React Frontend** and **Django Backend** on [Render.com](https://render.com) using two different methods:

- **Method 1 (Recommended): Unified Monolith (Frontend & Backend in ONE Service)**
- **Method 2: Separate Web Services (Standalone Frontend & Backend)**

---

## 📌 Method 1: Unified Monolith (Both Frontend & Backend in ONE Render Service)

This is the simplest, cost-effective approach. Render builds the React app, bundles it inside Django static files, and serves both the website (`/`) and API (`/api/`) on a **single domain URL** (e.g. `https://legacy-gym.onrender.com`).

### Step 1: Prepare `render.yaml` in your project root

Create or verify [`render.yaml`](./render.yaml) in your repository root:

```yaml
services:
  - type: web
    name: legacy-gym-app
    env: python
    region: singapore
    buildCommand: cd frontend && npm install --include=dev && npm run build && cd ../backend && pip install -r requirements.txt && python manage.py collectstatic --noinput && python manage.py migrate
    startCommand: cd backend && gunicorn config.wsgi:application
    envVars:
      - key: PYTHON_VERSION
        value: "3.11"
      - key: SECRET_KEY
        generateValue: true
      - key: DEBUG
        value: "False"
      - key: VITE_API_URL
        value: "/api"
```

---

### Step 2: 1-Click Deploy on Render using Blueprint

1. **Push your code to GitHub**:
   ```bash
   git add .
   git commit -m "Deploy Legacy Gym to Render"
   git push origin main
   ```
2. Log into your [Render Dashboard](https://dashboard.render.com).
3. Click **New +** -> Select **Blueprint**.
4. Connect your GitHub Repository (`Legacy_gym`).
5. Render will automatically detect `render.yaml` and select `legacy-gym-app`.
6. Click **Apply**. Render will automatically:
   - Install Node & Python dependencies
   - Build Vite React production assets
   - Collect Django static files
   - Run database migrations
   - Launch Gunicorn server
7. **Your Live App URL**: `https://legacy-gym-app.onrender.com`

---

## 📌 Method 2: Deploying as 2 Separate Services on Render

If you prefer keeping the Frontend and Backend on separate dedicated URLs:
- **Frontend URL**: `https://legacy-gym-frontend.onrender.com`
- **Backend API URL**: `https://legacy-gym-backend.onrender.com`

### Use this `render.yaml` for 2 Separate Services:

```yaml
services:
  # 1. Standalone Backend Web Service (Django REST API)
  - type: web
    name: legacy-gym-backend
    env: python
    region: singapore
    buildCommand: cd backend && pip install -r requirements.txt && python manage.py migrate
    startCommand: cd backend && gunicorn config.wsgi:application
    envVars:
      - key: PYTHON_VERSION
        value: "3.11"
      - key: SECRET_KEY
        generateValue: true
      - key: DEBUG
        value: "False"

  # 2. Standalone Frontend Static Site (React Vite App)
  - type: web
    name: legacy-gym-frontend
    env: static
    buildCommand: cd frontend && npm install --include=dev && npm run build
    staticPublishPath: ./frontend/dist
    envVars:
      - key: NPM_CONFIG_PRODUCTION
        value: "false"
      - key: VITE_API_URL
        value: "https://legacy-gym-backend.onrender.com/api"
    routes:
      - type: rewrite
        source: /*
        destination: /index.html
```

---

## 🛠️ Step 3: Seed Demo Data on Render (Optional)

After deploying on Render, if you want to initialize default admin (`nagendraappu`), member accounts, workouts, and diet plans:

1. Open **Render Dashboard** -> Click your web service (`legacy-gym-app` or `legacy-gym-backend`).
2. Click **Shell** in the left sidebar menu.
3. Run the seed script:
   ```bash
   cd backend
   python seed_portal.py
   ```

---

## 🔒 Step 4: Access Your Live Admin & Member Dashboards

Once deployed:
- **Member Dashboard**: `https://your-app-url.onrender.com/dashboard`
- **Gym Admin Portal**: `https://your-app-url.onrender.com/admin-portal`
- **Django Master Admin**: `https://your-app-url.onrender.com/admin/`

| Role | Username | Password |
| :--- | :--- | :--- |
| **Super Admin / Owner** | `nagendraappu` | `Nagendralegacy123` |
| **Admin / Head Coach** | `admin` | `admin123` |
| **Member / Athlete** | `johndoe` | `member123` |
