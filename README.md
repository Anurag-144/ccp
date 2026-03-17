# HydroScan 💧

Rainwater harvesting assessment tool built with React + Vite (frontend) and Express + lowdb (backend).

## Project Structure

```
ccp/
  src/
    App.jsx          ← Main app with HydroScan calculator
    Login.jsx        ← Auth (sign in / sign up)
    LandingPage.jsx  ← Aetherfield-inspired landing page
    main.jsx         ← Entry point
  server/
    index.js         ← Express API
    package.json     ← Server dependencies
  package.json       ← Frontend dependencies
```

## Setup

### Frontend
```bash
npm install
npm run dev
```

### Backend (in a separate terminal)
```bash
cd server
npm install
npm run dev
```

Frontend runs at: http://localhost:5173  
Backend runs at:  http://localhost:3001

## Deployment

- **Frontend**: Vercel (auto-deploys from GitHub)
- **Backend**: Railway (set root directory to `server/`)

After deploying to Railway, update the `API` constant in `src/Login.jsx`:
```js
const API = "https://your-railway-url.up.railway.app";
```

## API Routes

| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/signup | Create new account |
| POST | /api/signin | Sign in, returns JWT |
| GET  | /api/me | Get current user (auth required) |
| GET  | /api/admin/users | View all users (remove in production) |
