# DPS Shiksha Samiti NGO — Community Engagement Platform

A full-stack **Digital Community Engagement and Volunteer Support Platform** for
[DPS Shiksha Samiti NGO](https://www.instagram.com/dpsngoindia), a community NGO in
Sadarpur, Sector 45, Noida working for education, health and women empowerment.

Built to satisfy the project problem statement: a centralized platform that communicates the
organisation's activities, requirements, contact information, and opportunities for community
participation — with volunteer registration, donation/support enquiry forms, and an admin
interface for the NGO to manage everything.

## Tech Stack

| Layer    | Technology                                   |
| -------- | -------------------------------------------- |
| Frontend | React 18 (Vite), React Router, plain CSS     |
| Backend  | Node.js, Express                            |
| Database | MongoDB via Mongoose (with in-memory demo fallback) |

## Project Structure

```
├── client/                  # React frontend (Vite)
│   └── src/
│       ├── pages/           # Home, About, Volunteer, Support, Contact, Admin
│       └── components/      # Navbar, Footer, form fields, content manager
├── server/                  # Express + Mongoose API
│   └── src/
│       ├── models/          # Volunteer, Enquiry, Requirement, Activity
│       ├── routes/          # public, volunteers, enquiries, admin
│       ├── data/            # mongo store + in-memory demo store (same interface)
│       └── auth.js          # admin password/token auth
└── package.json             # convenience scripts
```

## Quick Start

Requires Node.js 18+.

```bash
# 1. Install everything (root + server + client)
npm run install:all

# 2. Run both server (port 5000) and client (port 5173)
npm run dev
```

Open http://localhost:5173.

### Database (optional)

By default the server runs in **DEMO mode** with in-memory data — no database needed, but data
resets when the server restarts. To use a real MongoDB:

```bash
cd server
copy .env.example .env     # on Windows
# or: cp .env.example .env
# Edit MONGODB_URI, ADMIN_PASSWORD, ADMIN_SECRET in .env
```

Then restart the server. On first start it auto-seeds sample requirements and activities.
You can also reseed manually: `npm run seed --prefix server`.

## Admin Panel

- URL: http://localhost:5173/admin
- Default password: **admin123** (override with `ADMIN_PASSWORD` in `server/.env`)

The admin panel lets the NGO:

- View and update the status of donation/support enquiries (new → contacted → resolved)
- View and delete volunteer registrations
- Add / edit / delete current requirements (shown on the homepage)
- Add / edit / delete activities (shown on the homepage)

## API Overview

Public:

| Method | Endpoint            | Description                        |
| ------ | ------------------- | ---------------------------------- |
| GET    | `/api/health`       | Health check — `db: connected`/`demo` plus whether `MONGODB_URI` is set and why the last connection failed |
| GET    | `/api/requirements` | Current requirements               |
| GET    | `/api/activities`   | Recent activities                  |
| GET    | `/api/stats`        | Live counts (volunteers, needs, activities, supporters) |
| POST   | `/api/volunteers`   | Register as a volunteer            |
| POST   | `/api/enquiries`    | Submit donation/support enquiry    |

Admin (all require `Authorization: Bearer <token>` from `POST /api/admin/login`):

| Method | Endpoint                          | Description                    |
| ------ | --------------------------------- | ------------------------------ |
| POST   | `/api/admin/login`                | Get admin token                |
| GET    | `/api/admin/volunteers`           | List volunteers                |
| DELETE | `/api/admin/volunteers/:id`       | Remove a volunteer             |
| GET    | `/api/admin/enquiries`            | List enquiries                 |
| PATCH  | `/api/admin/enquiries/:id`        | Update enquiry status          |
| DELETE | `/api/admin/enquiries/:id`        | Delete an enquiry              |
| GET/POST | `/api/admin/requirements`       | List / create requirements     |
| PATCH/DELETE | `/api/admin/requirements/:id` | Update / delete a requirement  |
| GET/POST | `/api/admin/activities`        | List / create activities       |
| PATCH/DELETE | `/api/admin/activities/:id`   | Update / delete an activity    |

## Frontend animations

- Animated hero (shifting gradient, floating blobs, staggered entrance)
- Live count-up stats pulled from `/api/stats`
- Scrolling marquee band and scroll-reveal animations (IntersectionObserver
  with a rect-polling fallback so content always appears)
- Glass navbar, hover-lift cards, shine buttons, skeleton loaders, page
  transitions — all with `prefers-reduced-motion` support
- Real brand SVG logos (Instagram, Facebook, X, YouTube, LinkedIn) and the
  NGO logo (`client/public/logo.jpg`, pulled from their X profile — swap in
  an official logo file anytime, same filename)

## Deploying to Vercel

The repo deploys as a **single Vercel project**: the Vite client is built to static files, and the
Express API runs as one serverless function (`api/server.js`) mounted at `/api/*`.

`vercel.json` wires this up:

- `installCommand` — installs the `server/` and `client/` dependencies
- `buildCommand` — `npm run build --prefix client`
- `outputDirectory` — `client/dist`
- rewrites — `/api/(.*)` → the serverless function; everything else → `/index.html` (SPA routing)

**Environment variables** (Vercel → Project → Settings → Environment Variables):

| Variable | Why |
| --- | --- |
| `MONGODB_URI` | **Set this.** Serverless instances are ephemeral, so the in-memory demo store isn't shared between them and resets constantly. A free MongoDB Atlas cluster is enough. |
| `ADMIN_PASSWORD` | Replaces the default `admin123` admin password. |
| `ADMIN_SECRET` | Salts the stateless admin token — change it from the default. |

Without `MONGODB_URI` the API still responds, but the admin panel will appear to lose data between
requests. The admin token is a stateless hash (`sha256(password + secret)`), so it keeps working
across serverless instances as long as `ADMIN_PASSWORD` and `ADMIN_SECRET` stay stable.

If a deployment 404s on `/api/*` (typically on admin login), the serverless function wasn't picked
up: confirm `api/server.js` is committed and the `/api/(.*)` rewrite is present in `vercel.json`.

## Notes

- The problem statement alternates between "DPG School" and "DPS Shiksha Samiti NGO" — this
  project uses **DPS Shiksha Samiti NGO** (their real name on all social channels).
- Contact details (address, phone, social links) come from the NGO's public Facebook/Instagram
  profiles and should be verified with the client before going live.
- Demo mode data is seeded in-memory (3 requirements + 3 activities) so the site looks alive
  without a database.