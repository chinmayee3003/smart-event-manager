# 🎓 Smart Campus Event Management System

A full-stack web application that enables students to discover and register for campus events, organizers to create and manage events, and administrators to monitor system activity through dashboards and analytics.

---

## 🚀 Project Overview

Smart Campus Event Management System is a role-based event platform designed for educational institutions.
It streamlines event participation by providing a centralized interface for event discovery, registration, and management.

This project demonstrates  requirements analysis, system design, backend API development, database integration, frontend UI development, and functional testing.

---

## ✨ Features

### 👨‍🎓 Student

* Browse upcoming events
* Register / unregister for events
* View registered events
* Dashboard with event insights

### 🧑‍💼 Organizer

* Create new events
* Update / delete events
* Manage event capacity

### 🛡️ Admin

* View system analytics
* Monitor registrations
* Manage users and roles

### 🔐 Authentication

* Secure login & registration using JWT
* Role-based access control

---

## 🏗️ Tech Stack

**Frontend**

* React (Vite)
* Context API (State Management)
* CSS

**Backend**

* Node.js
* Express.js

**Database**

* PostgreSQL

**Other Tools**

* Git & GitHub
* REST APIs
* JWT Authentication

---

## 🧠 System Architecture

Frontend (React UI) communicates with Backend (Express REST APIs), which interacts with PostgreSQL database for persistent storage.

```
React Frontend → Express Backend → PostgreSQL Database
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```
git clone https://github.com/chinmayee3003/smart-event-manager.git
cd smart-event-manager
```

---

### 2️⃣ Backend Setup

```
cd backend
npm install
cp .env.example .env
npm run db:setup
npm run dev
```

Backend runs on:

```
http://localhost:5001
```

---

### 3️⃣ Frontend Setup

Open new terminal:

```
cd frontend
npm install
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

## 🧪 Functional Testing

* User registration & login
* Role-based navigation
* Event creation (Organizer/Admin)
* Event registration (Student)
* Dashboard verification
* Session persistence after refresh

---

## 📸 Screenshots

*Add screenshots of login page, dashboard, events page, admin panel.*

---

## 📈 Future Improvements

* Email notifications for event reminders
* Calendar view integration
* QR-based event check-in
* Deployment on cloud platform
* Mobile app version

---

## 👩‍💻 Author

**Chinmayee Mahadeva**

---


