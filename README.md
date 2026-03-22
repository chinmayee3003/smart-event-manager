# 🎓 Smart Campus Event Management System

A full-stack web application for managing college events — built with React, Node.js, Express, and PostgreSQL.

## 👥 Roles
- **Student** — Browse events, register, view personal dashboard
- **Organizer** — Create and manage events
- **Admin** — Full system control and analytics

## 🗂 Project Structure
```
smart-campus/
├── frontend/        # React + Vite
├── backend/         # Node + Express + PostgreSQL
└── README.md
```

## 🚀 Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/yourusername/smart-campus.git
cd smart-campus
```

### 2. Setup Backend
```bash
cd backend
npm install
cp .env.example .env
# Fill in your PostgreSQL credentials in .env
npm run db:setup
npm run dev
```

### 3. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend runs on → http://localhost:5173
Backend runs on  → http://localhost:5000

## 🛠 Tech Stack
| Layer     | Tech                        |
|-----------|-----------------------------|
| Frontend  | React 18, Vite, React Router |
| Backend   | Node.js, Express            |
| Database  | PostgreSQL                  |
| Auth      | JWT + bcrypt                |
| Styling   | CSS Variables + Custom CSS  |
