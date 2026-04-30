# VisionVani

> AI-powered vision intelligence — a full-stack web application built with React, TypeScript, FastAPI, and Supabase.

![VisionVani](https://img.shields.io/badge/VisionVani-v1.0-6366f1?style=flat-square)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)
![FastAPI](https://img.shields.io/badge/FastAPI-Python-009688?style=flat-square&logo=fastapi)
![Supabase](https://img.shields.io/badge/Supabase-Auth%20%26%20DB-3ECF8E?style=flat-square&logo=supabase)

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Local Setup](#local-setup)
- [Environment Variables](#environment-variables)
- [Running the Project](#running-the-project)
- [Deployment](#deployment)
  - [Frontend → Vercel](#frontend--vercel)
  - [Backend → Render](#backend--render)
  - [Database → Supabase](#database--supabase)
- [Features](#features)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

VisionVani is a modular, full-stack web application that combines a React/TypeScript frontend with a Python/FastAPI backend and Supabase for authentication, database, and realtime features. The name "VisionVani" reflects a platform built around intelligent visual communication.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui |
| **Backend** | Python 3.11+, FastAPI |
| **Auth & Database** | Supabase (PostgreSQL, Row Level Security, Auth) |
| **Realtime** | Supabase Realtime |
| **Tooling** | ESLint, PostCSS, Bun / npm |

---

## Project Structure

```
VisionVani/
├── backend/
│   ├── app.py            # FastAPI entry point
│   ├── config.py         # Settings & environment config
│   ├── router.py         # Route registration
│   └── routers/          # Individual API route modules
│
├── frontend/
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── integrations/
│   │   │   └── supabase/ # Supabase client & types
│   │   ├── lib/          # Utility functions
│   │   └── pages/        # Route-level page components
│   ├── public/           # Static assets
│   ├── supabase/         # Supabase project config
│   ├── .env              # Environment variables (do not commit)
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── .gitignore
└── README.md
```

---

## Prerequisites

Make sure you have the following installed:

- **Node.js** v18+ — [nodejs.org](https://nodejs.org)
- **npm** v9+ (comes with Node.js) or **Bun** — [bun.sh](https://bun.sh)
- **Python** 3.11+ — [python.org](https://python.org)
- **pip** (comes with Python)
- A **Supabase** account — [supabase.com](https://supabase.com)

---

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-username/visionvani.git
cd visionvani
```

### 2. Install frontend dependencies

```bash
cd frontend
npm install
# or: bun install
```

### 3. Install backend dependencies

```bash
cd ../backend
pip install -r requirements.txt
```

If `requirements.txt` doesn't exist yet, install core packages:

```bash
pip install fastapi uvicorn python-dotenv pydantic-settings supabase
pip freeze > requirements.txt
```

---

## Environment Variables

### Frontend — `frontend/.env`

Create this file (never commit it):

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-anon-key
VITE_API_BASE_URL=http://localhost:8000
```

Find these values in your Supabase dashboard:
**Project Settings → API → Project URL** and **anon / public key**

### Backend — `backend/.env`

```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=your-supabase-service-role-key
ALLOWED_ORIGINS=http://localhost:5173
```

> ⚠️ Use the **service role key** (not the anon key) for backend operations. Keep it secret.

---

## Running the Project

Open two terminal windows:

**Terminal 1 — Frontend** (runs at `http://localhost:5173`):

```bash
cd frontend
npm run dev
```

**Terminal 2 — Backend** (runs at `http://localhost:8000`):

```bash
cd backend
uvicorn app:app --reload --port 8000
```

The API docs will be available at `http://localhost:8000/docs` (Swagger UI).

---

## Deployment

### Frontend → Vercel

Vercel is the recommended platform for deploying the Vite/React frontend.

**Option A: Vercel CLI**

```bash
# Install Vercel CLI globally
npm install -g vercel

# From the frontend directory
cd frontend
vercel

# Follow the prompts:
# - Link to existing project or create new
# - Set root directory to: frontend
# - Build command: npm run build
# - Output directory: dist
```

**Option B: Vercel Dashboard (recommended for first-time)**

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"Add New Project"**
3. Import your `visionvani` GitHub repository
4. Set **Root Directory** to `frontend`
5. Framework preset: **Vite**
6. Build Command: `npm run build`
7. Output Directory: `dist`
8. Under **Environment Variables**, add:
   ```
   VITE_SUPABASE_URL         = https://your-project.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY = your-anon-key
   VITE_API_BASE_URL         = https://your-backend.onrender.com
   ```
9. Click **Deploy**

Your frontend will be live at `https://your-project.vercel.app`

---

### Backend → Render

Render is the recommended platform for deploying the FastAPI backend.

1. Go to [render.com](https://render.com) and sign in with GitHub
2. Click **"New +"** → **"Web Service"**
3. Connect your `visionvani` repository
4. Configure the service:
   | Setting | Value |
   |---------|-------|
   | **Root Directory** | `backend` |
   | **Environment** | `Python 3` |
   | **Build Command** | `pip install -r requirements.txt` |
   | **Start Command** | `uvicorn app:app --host 0.0.0.0 --port $PORT` |
5. Under **Environment Variables**, add:
   ```
   SUPABASE_URL              = https://your-project.supabase.co
   SUPABASE_KEY              = your-service-role-key
   ALLOWED_ORIGINS           = https://your-project.vercel.app
   ```
6. Click **Create Web Service**

Your backend API will be live at `https://your-service.onrender.com`

> After deployment, update `VITE_API_BASE_URL` in your Vercel environment variables to point to your Render URL, then redeploy the frontend.

---

### Database → Supabase

Your database is already hosted on Supabase. A few things to configure for production:

**1. Enable Email Confirmation (Auth Settings)**

- Go to **Authentication → Providers → Email**
- Enable "Confirm email" for production security

**2. Update Redirect URLs**

- Go to **Authentication → URL Configuration**
- Add your production URL to **Redirect URLs**:
  ```
  https://your-project.vercel.app/**
  ```

**3. Set up Row Level Security (RLS)**

- Go to **Database → Tables**
- Enable RLS on all tables that store user data
- Add policies to restrict access per user:
  ```sql
  -- Example: users can only read their own data
  CREATE POLICY "Users can view own data"
  ON your_table FOR SELECT
  USING (auth.uid() = user_id);
  ```

**4. Restore a paused project**

If your project is on the free tier and has been inactive, it may be paused. Go to your [Supabase Dashboard](https://supabase.com/dashboard), find the project, and click **Restore Project**.

---

## Features

- ✅ Secure authentication (sign up, sign in, email confirmation) via Supabase Auth
- ✅ Split-panel login UI with animated dark theme
- ✅ Modular frontend architecture (React + TypeScript + shadcn/ui)
- ✅ FastAPI backend with auto-generated Swagger docs
- ✅ Environment-based configuration for local and production
- ✅ Responsive design — works on mobile and desktop

---

## Roadmap

- [ ] Role-based access control (admin / user roles)
- [ ] AI-powered image/video analysis integration
- [ ] User dashboard with analytics
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] End-to-end tests (Playwright)
- [ ] Docker support for local full-stack dev

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

Please follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages.

---

## License

This project is licensed under the **MIT License**. See [LICENSE](./LICENSE) for details.

---

<p align="center">Built with ❤️ by the VisionVani team</p>