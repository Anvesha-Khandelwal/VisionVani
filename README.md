VisionVani

VisionVani is a full-stack web application designed for scalable, modern development, with a structured frontend, backend, and real-time/chat capabilities. The project uses modern tooling like React, TypeScript, Tailwind CSS, and Supabase.

📁 Project Structure
VisionVani/
│
├── backend/          # Backend services (APIs, logic, database handling)
├── frontend/         # Main frontend application
├── chat/             # Chat / realtime module
│   ├── src/
│   ├── public/
│   ├── supabase/     # Supabase config & client
│   └── node_modules/
│
├── .env              # Environment variables
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── bun.lockb
├── tailwind.config.ts
├── postcss.config.js
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── eslint.config.js
├── components.json
└── README.md

🚀 Tech Stack
Frontend

React

TypeScript

Tailwind CSS

Vite

Backend

Node.js

Express (or similar framework)

REST APIs

Database & Auth

Supabase (Auth, Database, Realtime)

Tooling

ESLint

PostCSS

Bun / npm

⚙️ Setup Instructions
1️⃣ Clone the repository
git clone https://github.com/your-username/visionvani.git
cd visionvani

2️⃣ Install dependencies
npm install


or (if using bun)

bun install

3️⃣ Environment Variables

Create a .env file in the root (and inside chat/ if needed):

VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

▶️ Run the Project
Frontend
npm run dev

Backend
cd backend
npm start

Chat Module
cd chat
npm run dev

✨ Features

✅ Modular frontend & backend architecture

✅ Real-time chat support

✅ Authentication with Supabase

✅ Responsive UI with Tailwind

✅ Type-safe development using TypeScript

✅ Scalable and clean codebase

📌 Future Improvements

Role-based authentication

AI-powered chat enhancements

Dashboard & analytics

Deployment (Vercel / Netlify / AWS)

📜 License

This project is licensed under the MIT License.