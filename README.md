# ShareMeal - Food Donation Platform

ShareMeal is a food donation platform built with the MERN-style stack (React frontend, Node.js/Express backend, PostgreSQL database via Supabase). It follows an MVC architecture on the backend and features role-based access control for Donors, NGOs, Receivers, and Admins.

---

## Workspace Structure

```text
sharemeal/
├── client/          # React (Vite) Frontend Application
├── server/          # Node.js + Express MVC Backend API
├── .gitignore
├── README.md
└── package.json     # Workspace Root
```

---

## Setup & Installation Instructions

### 1. Prerequisites
- Node.js (v18 or higher)
- npm or pnpm
- PostgreSQL / Supabase Instance

### 2. Install Dependencies
Run the install command from the root directory:
```bash
npm run install:all
```
Or manually install in both subfolders:
```bash
cd server && npm install
cd ../client && npm install
```

### 3. Environment Variables Setup
Copy `.env.example` in the `server/` directory to `.env` and fill in your configuration:
```bash
cp server/.env.example server/.env
```

Required environment variables in `server/.env`:
- `PORT` (e.g. 5000)
- `DATABASE_URL` (PostgreSQL connection string)
- `JWT_SECRET` & `JWT_EXPIRES_IN`
- `CLOUDINARY_URL` / `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET`

---

## Running Development Servers

### Run Both Server & Client Concurrently:
```bash
npm run dev
```

### Run Individually:
- **Server**: `npm run dev --workspace=server` (starts Express server on `http://localhost:5000`)
- **Client**: `npm run dev --workspace=client` (starts Vite dev server on `http://localhost:5173`)

---

## Features & Roles
- **Donor**: Post surplus food, track food journey, view donation ratings and notifications.
- **NGO**: Request food collections, manage pickup points, maintain serving logs, manage receiver requests.
- **Receiver**: Find available food, submit food requests, view request status and history.
- **Admin**: User management, NGO verification queue, platform reports, analytics, and system bot alerts.
