## Dream Uni Finder (UniSphere) — Project Overview

This document gives you a quick, clear understanding of the tech stack, architecture, core logic, how to run it locally, and where to find things.

### What it is
- AI-powered platform to help students discover universities, build profiles, get career guidance, and generate study/career roadmaps.

### Tech Stack
- Frontend: React 18 (Vite), TypeScript, TailwindCSS, shadcn/ui (Radix primitives), React Router, TanStack Query
- Backend: Node.js (Express), JWT auth, Helmet, CORS, rate limiting, winston logging
- Database: MongoDB (via Mongoose). If MongoDB is not configured, backend runs in a demo mode with in-memory mock models.
- AI: Google Gemini (`@google/generative-ai`) with optional OpenAI
- Optional Infra: Docker Compose with Postgres/Redis/Nginx scaffolding included (not required by current code paths), Adminer for DB inspection

### Repository Structure (top-level)
```
dream-uni-finder-main/
├─ backend/                    # Express API
│  ├─ src/
│  │  ├─ config/               # MongoDB connection (Mongoose)
│  │  ├─ middleware/           # auth, errors, 404
│  │  ├─ models/               # Mongoose models (+ demo mock models)
│  │  ├─ routes/               # auth, user, university, career, roadmap, aptitude, admin
│  │  ├─ services/             # AI, email, university business logic
│  │  ├─ utils/                # logger, seeder
│  │  └─ index.js              # Express app setup and start
│  ├─ env.example              # example env vars
│  └─ README.md
├─ src/                        # Frontend app (Vite + React + TS)
│  ├─ components/              # UI components and feature components
│  ├─ pages/                   # Route-level pages
│  ├─ data/                    # Static data (e.g., universities.ts)
│  ├─ hooks/, lib/             # Utilities/hooks
│  ├─ App.tsx, main.tsx        # App entry
│  └─ index.css, App.css       # Styles
├─ public/                     # Static assets
├─ docker-compose.yml          # Optional containers (Postgres/Redis/Nginx)
├─ README.md                   # Main readme
└─ PROJECT_OVERVIEW.md         # This file
```

### How the system works (high-level flow)
1) A user registers/logs in via the frontend.
2) Frontend calls backend REST endpoints under `/api/v1/...`.
3) Backend validates, authenticates (JWT), and either uses MongoDB (if configured) or demo in-memory models.
4) For AI features, backend calls Gemini (and optionally OpenAI) via service modules.
5) Responses are returned to the frontend for display (recommendations, roadmaps, etc.).

### Backend — Key Concepts
- Server: `backend/src/index.js`
  - Loads env, sets CORS + Helmet + compression + morgan logging
  - Adds rate limiting + speed limiting on `/api/*`
  - Health check at `/health`
  - Mounts routes at `/api/v1/*`
  - Connects to MongoDB via `src/config/database.js`
  - If MongoDB connection fails, initializes demo mode with mock models so you can test without a DB
- Auth: `backend/src/routes/auth.js`
  - POST `/register`, `/login`, `/logout`
  - GET/PUT `/profile` — profile fetch/update using JWT
  - Uses bcrypt for password hashing and `jsonwebtoken` for tokens
- Universities, Career, Roadmap, Aptitude, Admin:
  - Routes in `backend/src/routes/*`
  - Business logic in `backend/src/services/*` (e.g., `geminiService.js`, `universityService.js`)
- Models:
  - `backend/src/models/index.js` exports `initializeModels(connection)`
  - With a real MongoDB connection: use actual Mongoose models
  - Without DB: falls back to in-memory mock implementations for a smooth demo experience
- Security:
  - Helmet headers, CORS allow-list, rate limiting (`express-rate-limit`), slowdown (`express-slow-down`), input validation (`express-validator`), JWT
- Logging:
  - `winston` with daily rotate file, see `backend/logs/*`

### Frontend — Key Concepts
- Stack: React + TypeScript + Vite + TailwindCSS + shadcn/ui
- Routing: `react-router-dom` with pages in `src/pages` and components under `src/components`
- State/Data fetching: TanStack Query for API calls, React Hook Form + Zod for forms/validation
- UI: shadcn/ui components in `src/components/ui/*` built on Radix
- Typical flow:
  - User interacts with forms (login/register/profile)
  - Calls backend endpoints defined by environment variable `VITE_API_BASE_URL` (default in docker-compose to `http://localhost:5000/api/v1`)
  - Renders results: university search/recommendations, roadmap, career insights

### Environment Variables (common)
- Backend essentials (set in `backend/.env`; see `backend/env.example` and README):
  - `PORT=5000`
  - `NODE_ENV=development`
  - `API_VERSION=v1`
  - `MONGODB_URI=<your Mongo connection string>`
  - `JWT_SECRET`, `JWT_REFRESH_SECRET`, `SESSION_SECRET`
  - `GEMINI_API_KEY`, optionally `OPENAI_API_KEY`
  - `CORS_ORIGIN=http://localhost:3000`
- Frontend (Vite):
  - `VITE_API_BASE_URL=http://localhost:5000/api/v1`
  - `VITE_APP_NAME=UniSphere`

### Run Locally (no Docker)
1) Backend
   - `cd backend`
   - `cp env.example .env` and set `MONGODB_URI` + secrets (or run `npm run setup`)
   - `npm install`
   - `npm run dev`
   - API at `http://localhost:5000` (health: `/health`)
2) Frontend
   - From repo root: `npm install`
   - `npm run dev` (Vite)
   - App at `http://localhost:5173` or `http://localhost:3000` depending on Vite config

Tip: If you don’t have MongoDB ready, the backend still runs in demo mode with mock data so you can test registration/login/profile flows.

### Run with Docker (optional)
- `docker-compose.yml` includes services for Postgres, Redis, Backend, Frontend, Nginx, Adminer.
- Current backend code is wired for MongoDB; Docker services for Postgres/Redis are provided as optional infra scaffolding and are not required for demo flows.
- To use Docker just for app containers (no DB):
  - `docker compose up --build backend frontend`

### Common Commands
- Backend (from `backend/`):
  - `npm run dev` — start dev server
  - `npm start` — start in production mode
  - `npm run seed` — seed sample data (where applicable)
  - `npm test` — run tests
  - `npm run lint` — lint
- Frontend (repo root):
  - `npm run dev` — start Vite dev server
  - `npm run build` — production build
  - `npm run preview` — preview production build

### Key Endpoints (selection)
- Auth:
  - `POST /api/v1/auth/register`
  - `POST /api/v1/auth/login`
  - `GET /api/v1/auth/profile`
  - `PUT /api/v1/auth/profile`
- Universities:
  - `GET /api/v1/university`
  - `GET /api/v1/university/search`
  - `GET /api/v1/university/:id`
  - `POST /api/v1/university/recommend` (if implemented)
- Career/Roadmap:
  - `POST /api/v1/career/assessment|chat|insights` (depending on route)
  - `POST /api/v1/roadmap/generate`

### Data Flow (simplified)
- Register/Login:
  - Frontend form → Backend `/auth/register|login` → bcrypt + JWT → token returned → stored client-side → used in `Authorization: Bearer <token>` header
- Profile:
  - Frontend → `/auth/profile` (GET/PUT) → reads/updates user record in MongoDB (or mock in demo)
- University:
  - Frontend → `/university` and `/university/search` → returns list/details (service and static/demo data)
- AI Assist:
  - Frontend → backend service (Gemini/OpenAI) via `/career/*` or `/roadmap/*` → returns insights/roadmap text/structure

### Notes and Gotchas
- MongoDB vs Postgres: The codebase connects to MongoDB via Mongoose. Docker Compose includes Postgres/Redis as optional infrastructure; they’re not required by current backend code paths. You can ignore them unless you plan a future migration.
- Demo Mode: If MongoDB connection fails, backend uses in-memory mock models. Great for quick demos, but data resets on server restart.
- CORS: In development, requests are allowed from `http://localhost:3000` and `http://localhost:5173`.

### Where to change things
- API base URL (frontend): `.env` → `VITE_API_BASE_URL`
- Add/modify routes: `backend/src/routes/*`
- Add business logic: `backend/src/services/*`
- Update UI: `src/components/*`, `src/pages/*`
- Logging: `backend/src/utils/logger.js`, logs in `backend/logs/`

---
If you need a deeper dive, check `README.md` (root) and `backend/README.md` for expanded details and example commands.


