# PaperBlog — Blog Management Application (Next.js)

PaperBlog is a full-featured, newspaper-themed blog platform frontend built with **Next.js (App Router)** and **Tailwind CSS**. It is the client for the companion **Blog Management REST API** and supports three kinds of visitors — **guests**, **users** and **admins**.

Every piece of data in the app comes from the REST API. There are no mock blogs, hardcoded users, static JSON lists, or direct database access, and authentication is backed by real JWTs issued by the backend.

---

## Table of contents

1. [Project overview](#project-overview)
2. [Main features](#main-features)
3. [Technologies](#technologies)
4. [Project structure](#project-structure)
5. [Installation](#installation)
6. [Environment variables](#environment-variables)
7. [Running the application](#running-the-application)
8. [Backend dependency](#backend-dependency)
9. [Application routes](#application-routes)
10. [Role-based access](#role-based-access)
11. [API integration](#api-integration)
12. [Screenshots](#screenshots)

---

## Project overview

The interface is built around two layouts:

| Layout | Used by | Contains |
| --- | --- | --- |
| **Public** | Guests and logged-in visitors | Fixed navbar · main content · footer |
| **Dashboard** | Authenticated users / admins | Fixed navbar · responsive sidebar · main content |

Guests can discover and read blogs. Registered users manage their profile, avatar, password and their own blogs. Admins additionally manage every user and moderate any blog.

## Main features

### Guest
- Browse a responsive grid of blog cards (`GET /api/blogs`)
- Live, debounced search by title (`?title=`)
- Filter by category (`?category=`), combinable with search
- Read full blog details with author, avatar and date
- A clear **Blog Not Found** screen for missing posts
- Register and log in

### User
- Persistent JWT session via React Context + `localStorage` (survives refresh)
- Protected dashboard with overview stats and recent blogs
- Create, edit and delete **their own** blogs
- Update first/last name
- Upload a JPG/PNG/WEBP avatar (≤ 2 MB) — the navbar avatar updates instantly
- Change password
- Forgot-password → email reset-link → reset-password flow
- Logout (clears the session and blocks protected pages)

### Admin
- Everything a user can do, plus:
- View **all** blogs and edit/delete any of them
- View all users, inspect a single user, and activate/deactivate accounts
- Admin-only routes that non-admins cannot reach (enforced in the UI **and** by the backend)

### UX throughout
Loading spinners and skeletons, pending/disabled buttons (no double submits), friendly backend-driven error messages, confirmation dialogs for destructive actions, toast notifications, and empty states.

## Technologies

| Purpose | Technology |
| --- | --- |
| Framework | Next.js (App Router) |
| UI library | React 19 |
| Styling | Tailwind CSS v4 |
| Fonts | `next/font` — Plus Jakarta Sans (UI) + Lora (article body) |
| HTTP | Native `fetch` via a shared API client |
| State | React Context (`AuthProvider`, `NotificationProvider`) |
| Backend | Node.js · Express · Sequelize · MySQL · JWT |

## Project structure

```text
src/
├── app/
│   ├── layout.jsx                 # root layout + providers + fonts
│   ├── globals.css                # Tailwind theme tokens
│   ├── not-found.jsx
│   ├── (public)/                  # navbar + footer layout
│   │   ├── page.jsx               # home (blog explorer)
│   │   └── blogs/[id]/page.jsx    # blog details
│   ├── (auth)/                    # centered auth layout
│   │   ├── login/ · register/
│   │   ├── forgot-password/
│   │   └── reset-password/[token]/
│   ├── dashboard/                 # protected (user + admin)
│   │   ├── layout.jsx             # <Protected> + dashboard chrome
│   │   ├── page.jsx               # overview
│   │   ├── blogs/ · blogs/create/ · blogs/[id]/edit/
│   │   ├── profile/
│   │   └── change-password/
│   └── admin/                     # protected (admin only)
│       ├── layout.jsx             # <Protected requireAdmin>
│       └── users/page.jsx
├── components/
│   ├── layout/   # SiteNavbar, SiteFooter, DashboardChrome, DashboardSidebar, AccountMenu
│   ├── blog/     # BlogCard, BlogBrowser, BlogComposer, BlogTable
│   ├── user/     # UserTable, UserDetailDialog, AvatarUploader
│   ├── route/    # Protected (auth + role guard)
│   └── ui/       # Button, Field, Avatar, Badge, Spinner, ConfirmDialog, EmptyState, SearchInput, CategoryTabs
├── providers/    # AuthProvider, NotificationProvider
├── hooks/        # useBlogs
└── lib/
    ├── apiClient.js   # fetch wrapper + ApiError + envelope unwrap
    ├── session.js     # localStorage token helpers
    ├── format.js      # names, dates, avatar URLs, excerpts
    ├── validators.js  # client-side form validation
    ├── constants.js   # app name, categories, limits
    └── api/           # auth.js, users.js, blogs.js  (one module per resource)
```

## Installation

```bash
# from the project root
npm install
```

## Environment variables

Copy `.env.example` to `.env.local` and adjust if needed:

```bash
cp .env.example .env.local   # Windows: copy .env.example .env.local
```

| Variable | Description | Example |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | REST API base URL — **must** end with `/api` | `http://localhost:5000/api` |
| `NEXT_PUBLIC_UPLOADS_URL` | Origin serving uploaded avatars (API origin without `/api`). Optional — derived from the API URL when blank. | `http://localhost:5000` |

> The real `.env.local` is git-ignored. Only `.env.example` is committed.

## Running the application

```bash
npm run dev     # start the dev server on http://localhost:3000
npm run build   # production build
npm start       # run the production build
```

Open <http://localhost:3000>. **The backend API must be running first** (see below).

## Backend dependency

This frontend talks to the **Blog Management REST API** (Express + Sequelize + MySQL), which lives in the sibling `../backend` folder. Start it on `http://localhost:5000` before using the app:

```bash
cd ../backend
npm install
npm run dev
```

Create an admin by registering an account and promoting it in MySQL:

```sql
UPDATE users SET role = 'admin' WHERE email = 'admin@example.com';
```

### Password reset

The API exposes `POST /api/auth/forgot-password` and `PATCH /api/auth/reset-password/:token`. When the backend is configured with Gmail credentials (`GMAIL_USER` / `GMAIL_APP_PASSWORD`), the reset link is emailed to the user. When mail isn't configured and the API runs in development, the response returns the raw reset link and the Forgot-Password page surfaces an **"Open reset link →"** shortcut, so the full flow can be tested locally without a mail server.

## Application routes

| Route | Access |
| --- | --- |
| `/` | Public |
| `/blogs/[id]` | Public |
| `/login`, `/register` | Public |
| `/forgot-password`, `/reset-password/[token]` | Public |
| `/dashboard` | User / Admin |
| `/dashboard/blogs` | User / Admin |
| `/dashboard/blogs/create` | User / Admin |
| `/dashboard/blogs/[id]/edit` | User / Admin (owner) / Admin (any) |
| `/dashboard/profile` | User / Admin |
| `/dashboard/change-password` | User / Admin |
| `/admin/users` | Admin only |

Guests who open a protected route are redirected to `/login`. A non-admin who opens an admin route sees an **Access Denied** screen. These are also enforced by the backend, whose `401`/`403` responses the UI always respects.

## Role-based access

- The sidebar renders different menus for users and admins, and the active item is highlighted.
- Route protection lives in `components/route/Protected.jsx` (`requireAdmin` flag).
- Blog ownership is checked in the UI and on the server — a normal user can only edit/delete their own blogs; admins can act on any.
- The UI never exposes controls for `role` or `isActive`, and blog creation never sends `userId` (the server derives the owner from the token).

## API integration

A thin, reusable layer wraps every endpoint so pages never embed raw fetch logic:

| Method | Endpoint | Used by |
| --- | --- | --- |
| POST | `/api/auth/register` | Register |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/forgot-password` | Forgot Password |
| PATCH | `/api/auth/reset-password/:token` | Reset Password |
| GET | `/api/users` | Admin · Users |
| GET | `/api/users/:id` | Admin · View user |
| PATCH | `/api/users/:id/status` | Admin · Activate/Deactivate |
| GET | `/api/users/profile` | Session bootstrap · Profile |
| PUT | `/api/users/profile/update` | Edit profile |
| PATCH | `/api/users/profile/image` | Avatar upload |
| PATCH | `/api/users/password` | Change password |
| POST | `/api/blogs/create` | Create blog |
| GET | `/api/blogs` | Home · Dashboard lists |
| GET | `/api/blogs/:id` | Blog details · Edit |
| PUT | `/api/blogs/update/:id` | Edit blog |
| DELETE | `/api/blogs/delete/:id` | Delete blog |

All responses follow the `{ success, message, data }` envelope; the client unwraps `data` and turns any failure into a readable message.

## Screenshots

Add screenshots of the major pages to `docs/screenshots/` and reference them here, e.g.:

| Page | Image |
| --- | --- |
| Home | `docs/screenshots/home.png` |
| Blog details | `docs/screenshots/blog-details.png` |
| Login / Register | `docs/screenshots/login.png` |
| Dashboard | `docs/screenshots/dashboard.png` |
| My Blogs | `docs/screenshots/my-blogs.png` |
| Create Blog | `docs/screenshots/create-blog.png` |
| Profile | `docs/screenshots/profile.png` |
| Admin · Users | `docs/screenshots/admin-users.png` |
