# TeamFlow — Team Task Manager

<div align="center">

![TeamFlow Banner](https://img.shields.io/badge/TeamFlow-Task%20Manager-4f6ef7?style=for-the-badge&logo=checkmarx&logoColor=white)

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![SQLite](https://img.shields.io/badge/SQLite-sql.js-003B57?style=flat-square&logo=sqlite&logoColor=white)](https://sql.js.org)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![JWT](https://img.shields.io/badge/Auth-JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)](https://jwt.io)
[![Railway](https://img.shields.io/badge/Deploy-Railway-0B0D0E?style=flat-square&logo=railway&logoColor=white)](https://railway.app)

A full-stack team task management application with role-based access control, Kanban boards, and a real-time dashboard — built with React, Node.js, Express, and SQLite.

[Features](#-features) · [Tech Stack](#-tech-stack) · [Getting Started](#-getting-started) · [API Reference](#-api-reference) · [Deployment](#-deployment-on-railway)

</div>

---

##  Overview

TeamFlow lets you manage projects, assign tasks to team members, and track progress — all with a clean role-based system where **Admins** control everything and **Members** focus on their own work.

```
Landing Page
├── Admin Login / Signup  →  Full control (projects, tasks, members)
└── Member Login / Signup →  View assigned projects, update own task status
```

---
##  Features
###  Admin
- Create, update, and delete projects
- Add or remove team members from projects
- Create and assign tasks to project members
- Set task due dates and status
- View a **global dashboard** with total tasks, overdue count, team stats
###  Member
- View only projects they've been added to
- See all tasks within those projects (Kanban board)
- Update the status of tasks assigned to them
- View a **personal dashboard** with their own task stats
### Security
- JWT-based authentication (7-day expiry)
- Passwords hashed with bcrypt (12 salt rounds)
- Role-enforced middleware on every protected route
- Separate login/signup flows for Admin and Member roles
- Token expiry handled gracefully with auto-redirect
---

##  Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18 + Vite |
| **Styling** | Tailwind CSS |
| **HTTP Client** | Axios (with interceptors) |
| **State Management** | React Context API |
| **Routing** | React Router v6 |
| **Backend** | Node.js + Express.js (MVC) |
| **Database** | SQLite via sql.js (pure JS, no native build) |
| **Authentication** | JSON Web Tokens (JWT) |
| **Password Hashing** | bcryptjs |
| **Deployment** | Railway |

---

## Project Structure

```
team-task-manager/
│
├── backend/
│   ├── config/
│   │   └── db.js                  # SQLite init, schema creation, file persistence
│   ├── controllers/
│   │   ├── authController.js      # signup/login for admin & member
│   │   ├── projectController.js   # project CRUD + member management
│   │   ├── taskController.js      # task CRUD with role-based logic
│   │   └── dashboardController.js # stats scoped by user role
│   ├── middleware/
│   │   ├── authMiddleware.js      # JWT verification
│   │   └── roleMiddleware.js      # admin-only route guard
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── projectRoutes.js
│   │   ├── taskRoutes.js
│   │   └── dashboardRoutes.js
│   ├── utils/
│   │   └── response.js            # unified API response helper
│   ├── .env.example
│   ├── server.js                  # Express entry point
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── axios.js           # Axios instance + auth interceptors
    │   ├── context/
    │   │   └── AuthContext.jsx    # global auth state (login/logout/rehydrate)
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── AuthForm.jsx       # reusable login/signup form
    │   │   ├── ProtectedRoute.jsx
    │   │   ├── TaskCard.jsx       # status badge + overdue detection
    │   │   └── ProjectCard.jsx
    │   ├── pages/
    │   │   ├── LandingPage.jsx    # Admin / Member entry buttons
    │   │   ├── AuthPages.jsx      # 4 auth pages (thin wrappers)
    │   │   ├── Dashboard.jsx      # role-scoped stats + recent tasks
    │   │   ├── ProjectList.jsx    # project grid + create form
    │   │   └── ProjectDetail.jsx  # Kanban board + member panel + task modal
    │   ├── App.jsx                # routes definition
    │   └── main.jsx
    ├── index.html
    ├── tailwind.config.js
    ├── vite.config.js
    └── package.json
```

---

## Getting Started

### Prerequisites

Make sure you have installed:
- [Node.js](https://nodejs.org) v18 or higher
- npm (comes with Node.js)

> **Windows users:** If you see a PowerShell execution policy error when running `npm install`, open PowerShell **as Administrator** and run:
> ```powershell
> Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
> ```
> Or simply use **Command Prompt (cmd)** instead of PowerShell.

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/team-task-manager.git
cd team-task-manager
```

---

### 2. Set Up the Backend

```bash
cd backend
```

Install dependencies:
```bash
npm install
```

Create your environment file:
```bash
cp .env.example .env
```

Open `.env` and fill in your values:
```env
PORT=5000
JWT_SECRET=your_super_secret_key_change_this    # ← change this!
DB_PATH=./data/taskmanager.db
NODE_ENV=development
```

Start the backend server:
```bash
npm run dev        # development (auto-restarts on changes)
# or
npm start          # production
```

You should see:
```
✅ Database ready at ./data/taskmanager.db
🚀 Server running on port 5000
```

---

### 3. Set Up the Frontend

Open a **new terminal window**, then:

```bash
cd frontend
npm install
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms
  ➜  Local:   http://localhost:5173/
```

> The Vite dev server automatically proxies all `/api/*` requests to `localhost:5000` — no CORS issues during development.

---

### 4. Open the App

Visit **http://localhost:5173** in your browser.

```
Landing Page
├── [Admin Login]   → /admin/login
├── [Admin Signup]  → /admin/signup
├── [Member Login]  → /member/login
└── [Member Signup] → /member/signup
```

**Quick test flow:**
1. Sign up as **Admin** → create a project → add a task
2. Sign up as **Member** → get added to the project by Admin → update task status

---

## 🌐 API Reference

All API responses follow this unified format:
```json
{
  "success": true,
  "message": "Human readable message",
  "data": {}
}
```

### Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/admin/signup` | ❌ | Register as admin |
| `POST` | `/api/auth/admin/login` | ❌ | Login as admin |
| `POST` | `/api/auth/member/signup` | ❌ | Register as member |
| `POST` | `/api/auth/member/login` | ❌ | Login as member |
| `GET` | `/api/auth/me` | ✅ | Get current user info |

**Request body for signup:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "password": "secret123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "admin account created.",
  "data": {
    "user": { "id": 1, "name": "Jane Smith", "email": "jane@example.com", "role": "admin" },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### Projects

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| `GET` | `/api/projects` | ✅ | Both | List projects (admin = all, member = assigned only) |
| `POST` | `/api/projects` | ✅ | Admin | Create a new project |
| `GET` | `/api/projects/:id` | ✅ | Both | Get project with members + tasks |
| `PUT` | `/api/projects/:id` | ✅ | Admin | Update project name/description |
| `DELETE` | `/api/projects/:id` | ✅ | Admin | Delete project (cascades tasks) |
| `POST` | `/api/projects/:id/members` | ✅ | Admin | Add a member to project |
| `DELETE` | `/api/projects/:id/members/:userId` | ✅ | Admin | Remove a member |
| `GET` | `/api/projects/:id/members/available` | ✅ | Admin | List members not yet in project |

---

### Tasks

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| `GET` | `/api/tasks` | ✅ | Both | Get tasks (optional `?projectId=`) |
| `POST` | `/api/tasks` | ✅ | Admin | Create a task |
| `PUT` | `/api/tasks/:id` | ✅ | Both* | Update task |
| `DELETE` | `/api/tasks/:id` | ✅ | Admin | Delete task |

> *Members can only update the `status` field of tasks assigned to them.

**Create task body:**
```json
{
  "title": "Design homepage",
  "description": "Create wireframes for the new landing page",
  "projectId": 1,
  "assignedTo": 3,
  "status": "todo",
  "dueDate": "2025-12-31"
}
```

---

### Dashboard

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/dashboard/summary` | ✅ | Stats scoped by role |

**Admin response data:**
```json
{
  "totalProjects": 5,
  "totalTasks": 24,
  "completedTasks": 10,
  "inProgressTasks": 8,
  "todoTasks": 6,
  "overdueTasks": 2,
  "totalMembers": 7,
  "recentTasks": [...]
}
```

**Member response data:**
```json
{
  "myProjects": 3,
  "myTasks": 8,
  "myCompleted": 3,
  "myInProgress": 2,
  "myTodo": 3,
  "myOverdue": 1,
  "recentTasks": [...]
}
```

---

## 🗃️ Database Schema

```sql
users
  id, name, email (unique), password (hashed), role (admin|member), created_at

projects
  id, name, description, created_by → users.id, created_at

project_members                        ← join table
  project_id → projects.id (CASCADE)
  user_id    → users.id    (CASCADE)

tasks
  id, title, description,
  project_id  → projects.id (CASCADE DELETE),
  assigned_to → users.id    (SET NULL on delete),
  status      (todo | in-progress | done),
  due_date    (YYYY-MM-DD, nullable),
  created_at
```

---

## 🔐 Role Permissions

| Action | Admin | Member |
|--------|:-----:|:------:|
| Create / delete projects | ✅ | ❌ |
| Add / remove team members | ✅ | ❌ |
| Create / delete tasks | ✅ | ❌ |
| Assign tasks to users | ✅ | ❌ |
| Update any task (full edit) | ✅ | ❌ |
| Update own task status | ✅ | ✅ |
| View all projects | ✅ | ❌ |
| View assigned projects only | — | ✅ |
| Global dashboard stats | ✅ | ❌ |
| Personal dashboard stats | — | ✅ |

---

## ⚠️ Edge Cases Handled

| Scenario | Behavior |
|----------|----------|
| Task assigned to non-member | `400` — user must be in `project_members` |
| Delete project with tasks | All tasks cascade-deleted automatically |
| Invalid / expired JWT | `401` → auto-redirected to landing page |
| Member accessing admin route | `403 Forbidden` |
| Duplicate email on signup | `409 Conflict` |
| Invalid `dueDate` format | `400` — must be `YYYY-MM-DD` |
| Overdue detection | `due_date < today AND status != 'done'` |
| Member updating someone else's task | `403 Forbidden` |

---

## 🚂 Deployment on Railway

### ⚠️ Important: SQLite Persistence
Railway's filesystem resets on every deploy. You **must** attach a Volume to persist your database.

### Backend Deployment

1. Push your code to GitHub
2. Go to [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub**
3. Select the repo and set **Root Directory** to `backend`
4. Add these **Environment Variables**:

   | Variable | Value |
   |----------|-------|
   | `JWT_SECRET` | `a_long_random_secret_string` |
   | `DB_PATH` | `/data/taskmanager.db` |
   | `CLIENT_URL` | `https://your-frontend.railway.app` |
   | `NODE_ENV` | `production` |

5. Go to your service → **Volumes** → **Add Volume**
   - Mount path: `/data`
6. Railway will auto-deploy on every push to `main`

### Frontend Deployment

1. Create another Railway service → **Deploy from GitHub**
2. Set **Root Directory** to `frontend`
3. Add this **Environment Variable**:

   | Variable | Value |
   |----------|-------|
   | `VITE_API_URL` | `https://your-backend.railway.app/api` |

4. Set **Build Command**: `npm run build`
5. Set **Start Command**: `npx serve dist -p $PORT`

---

##  Testing the API (with curl)

**Signup as admin:**
```bash
curl -X POST http://localhost:5000/api/auth/admin/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"John Admin","email":"admin@test.com","password":"password123"}'
```

**Create a project (use token from signup):**
```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"name":"Website Redesign","description":"Revamp the company site"}'
```

**Health check:**
```bash
curl http://localhost:5000/api/health
```

---

##  Environment Variables Reference

### Backend `.env`

```env
PORT=5000
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
DB_PATH=./data/taskmanager.db
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### Frontend `.env` (optional for local dev)

```env
VITE_API_URL=http://localhost:5000/api
```

> In development, the Vite proxy handles this automatically — you only need `VITE_API_URL` in production.

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

<div align="center">
Built with using React, Node.js, and SQLite
</div>
#   t e a m - t a s k - m a n a g e r  
 