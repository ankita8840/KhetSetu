# KhetSetu — AI Smart Farming Platform

Full MERN-stack implementation of the roadmap: authentication, farmer/farm profile,
AI-driven soil analysis & fertilizer advice, crop recommendation & compatibility,
disease detection (demo mode), AI chat assistant, weather intelligence, market
insights, soil-test booking, government scheme matching, farm finance tracking,
task reminders, and an analytics dashboard.

## Stack
- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT auth, bcrypt, multer
- **Frontend:** React 18, Vite, Tailwind CSS, React Router, Recharts, Lucide icons

## Project structure
```
khetsetu/
├── backend/
│   ├── config/db.js              MongoDB connection
│   ├── models/                   Mongoose schemas
│   ├── controllers/               Route logic
│   ├── routes/                    Express routers
│   ├── middleware/                Auth + error handling
│   ├── utils/                     Rule-based AI engines (soil, crop, disease, market, schemes)
│   └── server.js                  App entry point
└── frontend/
    └── src/
        ├── components/             Sidebar, Topbar, StatCard, etc.
        ├── context/AuthContext.jsx Auth state
        ├── pages/                  One page per dashboard module
        └── services/api.js         Axios instance with JWT interceptor
```

## Running locally

### 1. Backend
```bash
cd backend
npm install
cp .env.example .env
# edit .env: set MONGO_URI (local mongod or MongoDB Atlas) and JWT_SECRET
npm run dev
```
Runs on `http://localhost:5000`. Health check: `GET /api/health`.

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```
Runs on `http://localhost:5173` and talks to the backend at `http://localhost:5000/api`
(override with a `VITE_API_URL` env variable if needed).

### 3. MongoDB
Either run MongoDB locally (`mongod`) or use a free MongoDB Atlas cluster and paste
its connection string into `backend/.env` as `MONGO_URI`.

## What's real AI vs. rule-based vs. demo

| Module | Current implementation |
|---|---|
| Soil analysis & fertilizer advice | Deterministic rule engine using ICAR-style NPK/pH/organic-carbon thresholds (`utils/soilAnalysisEngine.js`) |
| Crop recommendation & compatibility | Rule-based scoring against a 12-crop reference table (`utils/cropRecommendationEngine.js`) |
| AI Assistant chat | Calls the Anthropic API if `ANTHROPIC_API_KEY` is set in `.env`; otherwise falls back to keyword-based canned responses |
| Disease detection | **Demo placeholder** — returns a deterministic mock result per image; needs a real trained CNN (e.g. via a Python FastAPI microservice) to become genuine AI |
| Weather | Calls OpenWeatherMap if `OPENWEATHER_API_KEY` is set; otherwise returns realistic mock data |
| Market prices & predictions | Mock mandi price table with trend-based sell/hold logic; can be swapped for the data.gov.in Agmarknet API |
| Government schemes | Static reference data + simple eligibility rules based on land area |

This is intentionally structured so each "engine" file can be swapped for a real
ML/external-API call later without changing the controller or frontend contract.

## Suggested next steps (Phase 2)
- Soil report PDF/image upload with OCR (e.g. Tesseract.js or a cloud OCR API)
- Real CNN-based disease detection via a Python microservice
- Crop rotation planner and yield/income prediction models
- Hindi voice assistant using the Web Speech API
- Push/SMS notifications for task reminders
