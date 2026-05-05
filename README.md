# Smart Expense Tracker (MERN)

Production-ready MERN stack expense tracker.

## Stack
- **Frontend:** React 18 + Vite + Tailwind CSS + Recharts + React Router + Axios + Context API
- **Backend:** Node.js + Express + MongoDB (Mongoose) + JWT (access + refresh) + bcrypt + node-cron
- **PDF export:** jsPDF + html2canvas
- **Auth:** JWT access (15m) + refresh token (7d, httpOnly cookie)

## Folder structure
```
expense-tracker/
├── server/   # Express + MongoDB API
└── client/   # React + Vite + Tailwind
```

## Quick start

### 1. Backend
```bash
cd server
cp .env.example .env   # fill MONGO_URI, JWT secrets
npm install
npm run dev            # http://localhost:5000
```

### 2. Frontend
```bash
cd client
cp .env.example .env   # VITE_API_URL=http://localhost:5000/api
npm install
npm run dev            # http://localhost:5173
```

## Deployment
- **Backend:** Render / Railway (set env vars from `.env.example`)
- **Frontend:** Vercel (set `VITE_API_URL` to deployed backend URL)
- **DB:** MongoDB Atlas

## API documentation
See `server/API.md`.

## Features
- JWT auth (register / login / refresh / logout) + bcrypt
- Transactions CRUD with category, type, date, notes
- Pagination + filters (date range, category, type) + search
- Dashboard with Recharts (Bar / Pie / Line)
- Monthly insights (top category, average daily, % breakdown)
- Monthly budget with 80% / exceeded alerts
- Recurring transactions via node-cron (daily 00:05)
- PDF export of monthly report
- Dark mode, responsive sidebar layout, loading + error states
