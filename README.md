# VisionVani

A full-stack web application with a React/TypeScript frontend, Python backend (FastAPI), and Supabase for auth, database, and realtime features.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, TypeScript, Vite, Tailwind CSS |
| Backend | Python, FastAPI |
| Database & Auth | Supabase (PostgreSQL, Auth, Realtime) |
| Tooling | ESLint, PostCSS, Bun/npm |

## Project Structure

VisionVani/
├── backend/          # Python FastAPI server
│   ├── app.py        # Entry point
│   ├── config.py     # Settings & env vars
│   └── routers/      # API route handlers
└── frontend/         # React/Vite app
├── src/          # Source code
├── public/       # Static assets
└── supabase/     # Supabase config
