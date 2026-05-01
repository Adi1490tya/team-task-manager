<div align="center">

# 🚀 TeamFlow — Team Task Manager

**A full-stack team task management app with role-based access control, Kanban boards, and real-time dashboard.**

Built with React · Node.js · Express · SQLite · Tailwind CSS · JWT

---

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![SQLite](https://img.shields.io/badge/SQLite-sql.js-003B57?style=for-the-badge&logo=sqlite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Railway](https://img.shields.io/badge/Deploy-Railway-0B0D0E?style=for-the-badge&logo=railway&logoColor=white)

</div>

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [Database Schema](#-database-schema)
- [Role Permissions](#-role-permissions)
- [Deployment on Railway](#-deployment-on-railway)
- [License](#-license)

---

## 🧭 Overview

TeamFlow is a full-stack web application where teams can manage projects, assign tasks, and track progress — all secured with role-based access control.

```
Landing Page
├── Admin Login / Signup  →  Full control over projects, tasks & members
└── Member Login / Signup →  View assigned projects & update own tasks
```

> Admins manage everything. Members focus on their own work.

---

## ✨ Features

### 👑 Admin Can
- ✅ Create, update, and delete projects
- ✅ Add or remove team members from projects
- ✅ Create, assign, and delete tasks
- ✅ Set task due dates and status
- ✅ View **global dashboard** — total tasks, overdue count, team stats

### 👤 Member Can
- ✅ View only projects they have been added to
- ✅ See all tasks in a Kanban board view
- ✅ Update the **status** of tasks assigned to them
- ✅ View **personal dashboard** — their own task stats

### 🔒 Security
- ✅ JWT authentication with 7-day token expiry
- ✅ Passwords hashed with bcrypt (12 salt rounds)
- ✅ Role-enforced middleware on every protected route
- ✅ Separate login and signup flows for Admin and Member
- ✅ Auto-redirect to login on token expiry

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18 + Vite |
| **Styling** | Tailwind CSS |
| **HTTP Client** | Axios with interceptors |
| **State Management** | React Context API |
| **Routing** | React Router v6 |
| **Backend** | Node.js + Express.js (MVC pattern) |
| **Database** | SQLite via sql.js (pure JS, no native build needed) |
| **Authentication** | JSON Web Tokens (JWT) |
| **Password Hashing** | bcryptjs |
| **Deployment** | Railway |

---

## 📁 Project Structure

```
team-task-manager/
│
├── README.md
├── .gitignore
│
├── backend/
│   ├── config/
│   │   └── db.js                   # SQLite init + schema creation
│   ├── controllers/
│   │   ├── authController.js       # Signup & login for admin and member
│   │   ├── projectController.js    # Project CRUD + member management
│   │   ├── taskController.js       # Task CRUD with role-based logic
│   │   └── dashboardController.js  # Stats scoped by user role
│   ├── middleware/
│   │   ├── authMiddleware.js       # JWT token verification
│   │   └── roleMiddleware.js       # Admin-only route guard
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── projectRoutes.js
│   │   ├── taskRoutes.js
│   │   └── dashboardRoutes.js
│   ├── utils/
│   │   └── response.js             # Unified API response helper
│   ├── .env.example
│   ├── server.js                   # Express entry point
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── axios.js            # Axios instance + auth interceptors
    │   ├── context/
    │   │   └── AuthContext.jsx     # Global auth state
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── AuthForm.jsx        # Reusable login/signup form
    │   │   ├── ProtectedRoute.jsx
    │   │   ├── TaskCard.jsx        # Task card with overdue detection
    │   │   └── ProjectCard.jsx
    │   ├── pages/
    │   │   ├── LandingPage.jsx     # Admin / Member entry buttons
    │   │   ├── AuthPages.jsx       # 4 auth pages
    │   │   ├── Dashboard.jsx       # Role-scoped stats + recent tasks
    │   │   ├── ProjectList.jsx     # Project grid + create form
    │   │   └── ProjectDetail.jsx   # Kanban board + members + task modal
    │   ├── App.jsx
    │   └── main.jsx
    ├── index.html
    ├── tailwind.config.js
    ├── vite.config.js
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have these installed on your computer:

- [Node.js v18+](https://nodejs.org) — download and install
- npm — comes automatically with Node.js
- [Git](https://git-scm.com/downloads) — for cloning the project

> **Windows Users:** If you get a PowerShell error when running `npm install`, open PowerShell as Administrator and run:
> ```powershell
> Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
> ```
> Or just use **Command Prompt (cmd)** instead of PowerShell.

---

### Step 1 — Clone the Repository

```bash
git clone https://github.com/your-username/team-task-manager.git
cd team-task-manager
```

---

### Step 2 — Set Up the Backend

```bash
cd backend
npm install
```

Create your environment file:

```bash
# On Mac/Linux
cp .env.example .env

# On Windows (Command Prompt)
copy .env.example .env
```

Open the `.env` file and fill in your values:

```env
PORT=5000
JWT_SECRET=your_super_secret_key_change_this
DB_PATH=./data/taskmanager.db
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

Start the backend:

```bash
npm run dev
```

You should see this output:

```
✅ Database ready at ./data/taskmanager.db
🚀 Server running on port 5000
```

---

### Step 3 — Set Up the Frontend

Open a **new terminal window** and run:

```bash
cd frontend
npm install
npm run dev
```

You should see:

```
VITE ready in xxx ms
➜ Local: http://localhost:5173/
```

> The Vite dev server automatically forwards all `/api` requests to `localhost:5000` — no extra setup needed.

---

### Step 4 — Open the App

Visit **http://localhost:5173** in your browser.

**Quick Test:**
1. Click **Admin Signup** → create an admin account
2. Create a project and add a task
3. Click **Member Signup** → create a member account
4. Go back to Admin → add the member to the project
5. Log in as Member → see the project and update task status

---

## 🔐 Environment Variables

### Backend `.env`

| Variable | Description | Example |
|---|---|---|
| `PORT` | Port the server runs on | `5000` |
| `JWT_SECRET` | Secret key for JWT — keep this private! | `my_secret_key_123` |
| `DB_PATH` | Path to SQLite database file | `./data/taskmanager.db` |
| `NODE_ENV` | Environment mode | `development` |
| `CLIENT_URL` | Frontend URL for CORS | `http://localhost:5173` |

### Frontend `.env` (only needed for production)

| Variable | Description | Example |
|---|---|---|
| `VITE_API_URL` | Backend API URL | `https://your-backend.railway.app/api` |

> In development, the Vite proxy handles the API URL automatically. You do not need to set `VITE_API_URL` locally.

---

## 🌐 API Reference

All API responses use this consistent format:

```json
{
  "success": true,
  "message": "Description of result",
  "data": {}
}
```

---

### Auth Endpoints

| Method | Endpoint | Login Required | Description |
|---|---|---|---|
| POST | `/api/auth/admin/signup` | No | Register a new admin |
| POST | `/api/auth/admin/login` | No | Login as admin |
| POST | `/api/auth/member/signup` | No | Register a new member |
| POST | `/api/auth/member/login` | No | Login as member |
| GET | `/api/auth/me` | Yes | Get current logged-in user |

**Signup Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "password": "password123"
}
```

**Signup Response:**
```json
{
  "success": true,
  "message": "admin account created.",
  "data": {
    "user": {
      "id": 1,
      "name": "Jane Smith",
      "email": "jane@example.com",
      "role": "admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### Project Endpoints

| Method | Endpoint | Login Required | Role | Description |
|---|---|---|---|---|
| GET | `/api/projects` | Yes | Both | List all accessible projects |
| POST | `/api/projects` | Yes | Admin only | Create a new project |
| GET | `/api/projects/:id` | Yes | Both | Get project details with tasks |
| PUT | `/api/projects/:id` | Yes | Admin only | Update project |
| DELETE | `/api/projects/:id` | Yes | Admin only | Delete project and all its tasks |
| POST | `/api/projects/:id/members` | Yes | Admin only | Add a member to project |
| DELETE | `/api/projects/:id/members/:userId` | Yes | Admin only | Remove a member |
| GET | `/api/projects/:id/members/available` | Yes | Admin only | List members not yet added |

---

### Task Endpoints

| Method | Endpoint | Login Required | Role | Description |
|---|---|---|---|---|
| GET | `/api/tasks` | Yes | Both | Get tasks (add `?projectId=1` to filter) |
| POST | `/api/tasks` | Yes | Admin only | Create a new task |
| PUT | `/api/tasks/:id` | Yes | Both | Update task (members: status only) |
| DELETE | `/api/tasks/:id` | Yes | Admin only | Delete task |

**Create Task Request Body:**
```json
{
  "title": "Design homepage",
  "description": "Create wireframes for the landing page",
  "projectId": 1,
  "assignedTo": 3,
  "status": "todo",
  "dueDate": "2025-12-31"
}
```

---

### Dashboard Endpoint

| Method | Endpoint | Login Required | Description |
|---|---|---|---|
| GET | `/api/dashboard/summary` | Yes | Get stats — scoped by your role |

**Admin gets:**
```json
{
  "totalProjects": 5,
  "totalTasks": 24,
  "completedTasks": 10,
  "inProgressTasks": 8,
  "todoTasks": 6,
  "overdueTasks": 2,
  "totalMembers": 7,
  "recentTasks": []
}
```

**Member gets:**
```json
{
  "myProjects": 3,
  "myTasks": 8,
  "myCompleted": 3,
  "myInProgress": 2,
  "myTodo": 3,
  "myOverdue": 1,
  "recentTasks": []
}
```

---

## 🗃 Database Schema

```sql
-- Users table
users (
  id         INTEGER PRIMARY KEY,
  name       TEXT NOT NULL,
  email      TEXT UNIQUE NOT NULL,
  password   TEXT NOT NULL,       -- bcrypt hashed
  role       TEXT NOT NULL,       -- 'admin' or 'member'
  created_at DATETIME
)

-- Projects table
projects (
  id          INTEGER PRIMARY KEY,
  name        TEXT NOT NULL,
  description TEXT,
  created_by  INTEGER → users.id,
  created_at  DATETIME
)

-- Project Members (who is in which project)
project_members (
  project_id  INTEGER → projects.id  ON DELETE CASCADE,
  user_id     INTEGER → users.id     ON DELETE CASCADE
)

-- Tasks table
tasks (
  id          INTEGER PRIMARY KEY,
  title       TEXT NOT NULL,
  description TEXT,
  project_id  INTEGER → projects.id  ON DELETE CASCADE,
  assigned_to INTEGER → users.id     ON DELETE SET NULL,
  status      TEXT,   -- 'todo' | 'in-progress' | 'done'
  due_date    TEXT,   -- YYYY-MM-DD format, optional
  created_at  DATETIME
)
```

---

## 🔐 Role Permissions

| Action | Admin | Member |
|---|:---:|:---:|
| Create and delete projects | ✅ | ❌ |
| Add and remove team members | ✅ | ❌ |
| Create and delete tasks | ✅ | ❌ |
| Assign tasks to users | ✅ | ❌ |
| Edit any task fully | ✅ | ❌ |
| Update status of own tasks | ✅ | ✅ |
| View all projects | ✅ | ❌ |
| View only assigned projects | — | ✅ |
| See global team dashboard | ✅ | ❌ |
| See personal task dashboard | — | ✅ |

---

## ⚠️ Edge Cases Handled

| Situation | What Happens |
|---|---|
| Task assigned to user not in project | Returns `400` error — must be a project member |
| Project deleted that has tasks | All tasks are automatically deleted (CASCADE) |
| JWT token expired or invalid | Returns `401` and user is redirected to login |
| Member tries to access admin route | Returns `403 Forbidden` |
| Signup with existing email | Returns `409 Conflict` |
| Invalid due date format | Returns `400` — must be `YYYY-MM-DD` |
| Member tries to update someone else's task | Returns `403 Forbidden` |

---

## 🚂 Deployment on Railway

### Important Note About SQLite

Railway resets its filesystem on every deploy. You must attach a **Volume** so your database file is not lost.

---

### Deploy the Backend

1. Push your project to GitHub
2. Go to [railway.app](https://railway.app) and sign in
3. Click **New Project** → **Deploy from GitHub repo**
4. Select your repo and set **Root Directory** to `backend`
5. Go to **Variables** and add:

| Variable | Value |
|---|---|
| `JWT_SECRET` | any long random string |
| `DB_PATH` | `/data/taskmanager.db` |
| `CLIENT_URL` | your frontend Railway URL |
| `NODE_ENV` | `production` |

6. Go to **Volumes** → **Add Volume** → set mount path to `/data`
7. Railway will auto-deploy every time you push to GitHub

---

### Deploy the Frontend

1. In Railway, click **New Service** → **Deploy from GitHub repo**
2. Select the same repo, set **Root Directory** to `frontend`
3. Go to **Variables** and add:

| Variable | Value |
|---|---|
| `VITE_API_URL` | `https://your-backend.up.railway.app/api` |

4. Set **Build Command** to: `npm run build`
5. Set **Start Command** to: `npx serve dist -p $PORT`

---

## 🤝 Contributing

Contributions are welcome!

1. Fork this repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Make your changes and commit: `git commit -m "Add your feature"`
4. Push to your branch: `git push origin feature/your-feature-name`
5. Open a Pull Request on GitHub

---

## 📄 License

This project is licensed under the **MIT License** — feel free to use it for learning or building on top of it.

---

<div align="center">

Made with ❤️ using React, Node.js, Express, and SQLite

⭐ If you found this helpful, give it a star on GitHub!

</div>
