# PaperBlog — Blog Management Application

A full-stack, newspaper-themed blog platform for the **Road to SDET** assignment. It pairs a **Next.js** frontend with a JWT-secured **Express / Sequelize / MySQL** REST API, supporting three roles: **guest**, **user** and **admin**.

All application data comes from the REST API — there are no mock blogs, hardcoded users, static lists or direct database access.

## Repository layout

```text
Blog Management Application with Next.js/
├── backend/     # Express + Sequelize + MySQL REST API  (runs on :5000)
└── frontend/    # Next.js (App Router) + Tailwind CSS UI (runs on :3000)
```

Each folder is a standalone project with its own `package.json`, `.env.example` and README. See:

- [`backend/README.md`](backend/README.md) — API reference, endpoints, auth, env vars
- [`frontend/README.md`](frontend/README.md) — pages, components, features, env vars

## Prerequisites

- **Node.js** 18+ (tested on Node 22)
- **MySQL** 8.x running locally

## Quick start

Open two terminals.

**1 — Backend (API):**

```bash
cd backend
npm install
cp .env.example .env     # Windows: copy .env.example .env
#   edit .env with your MySQL credentials + a JWT secret
npm run dev              # http://localhost:5000
```

The API creates its tables automatically on first boot. Make yourself an admin after registering:

```sql
UPDATE users SET role = 'admin' WHERE email = 'you@example.com';
```

**2 — Frontend (UI):**

```bash
cd frontend
npm install
cp .env.example .env.local   # Windows: copy .env.example .env.local
npm run dev                  # http://localhost:3000
```

Open <http://localhost:3000>. Start the backend first so the UI has an API to talk to.

## Features at a glance

- **Guest:** browse / search / filter blogs, read full posts, register, log in
- **User:** protected dashboard, blog CRUD (own posts), profile editing, avatar upload, change password, forgot/reset password
- **Admin:** manage all users (view, activate/deactivate) and moderate any blog

## Theme

PaperBlog uses a light **newspaper** look: a warm newsprint canvas, a masthead-red brand colour, serif headlines, and colour-coded category tags that read like newspaper section labels.
