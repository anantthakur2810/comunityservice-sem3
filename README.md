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
| Backend  | Node.js, Express (Vercel serverless)         |
| Database | MongoDB via Mongoose (with in-memory demo fallback) |

## Project Structure

```
├── client/                  # React frontend (Vite)
│   └── src/
│       ├── pages/           # Home, About, Volunteer, Support, Contact, Admin
│       └── components/      # Navbar, Footer, form fields, SocialFeed, gallery
├── server/                  # Express + Mongoose API
│   └── src/
│       ├── models/          # Volunteer, Enquiry, Requirement, Activity, Post
│       ├── routes/          # public, volunteers, enquiries, admin, posts, cron
│       ├── services/posts.js# YouTube/Instagram URL parsing + channel sync
│       ├── data/            # mongo store + in-memory demo store (same interface)
│       └── auth.js          # admin password/token auth
├── api/server.js            # Vercel serverless entry (mounts the Express app)
└── vercel.json              # build config, /api routing, SPA fallback, daily cron
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

### Database (required for real use)

Without `MONGODB_URI` the server runs in **DEMO mode** with in-memory data (resets on every
restart). For anything real, set `MONGODB_URI` in `server/.env` (local) or the Vercel project
environment variables (production). A free MongoDB Atlas cluster works; the connection is
verified at `GET /api/health` (`db: connected` vs `demo`).

Starter content is **not** seeded automatically. Create real requirements and activities in the
admin panel, or run `npm run seed --prefix server` to insert the old sample content manually.

## Admin Panel

- URL: http://localhost:5173/admin (or `https://<your-deployment>/admin`)
- Default password: **admin123** (override with `ADMIN_PASSWORD` — do this before going live)

The admin panel lets the NGO:

- View and update the status of donation/support enquiries (new → contacted → resolved)
- View and delete volunteer registrations
- Add / edit / delete current requirements (shown on the homepage)
- Add / edit / delete activities (shown on the homepage)
- **Posts** — paste a YouTube video/short or Instagram reel/post URL, see a live preview, and
  publish it to the homepage "Reels & Posts" section. One click syncs the NGO's YouTube channel.

## Reels & Posts (auto-sync from social media)

The homepage shows the latest posts with click-to-play embeds. Content comes from two places:

1. **Automatic** — a daily Vercel cron (`/api/cron/sync-posts`, 02:00 UTC, defined in
   `vercel.json`) pulls the NGO's newest public YouTube videos into the posts collection.
   Duplicate-proof via a unique index, so running it any number of times is safe.
2. **Manual** — admins paste any YouTube/Instagram link in the admin panel. Instagram embeds
   only render while Instagram is reachable; YouTube embeds always work.

Environment variables:

| Variable | Why |
| --- | --- |
| `MONGODB_URI` | MongoDB connection string (required for persistence) |
| `ADMIN_PASSWORD` | Admin panel password (default `admin123`) |
| `ADMIN_SECRET` | Salts the stateless admin token |
| `YOUTUBE_CHANNEL_ID` | Defaults to the NGO's channel `UCtDooLADLvqTO82z6UWlvng` |
| `CRON_SECRET` | If set, the cron endpoint requires `Authorization: Bearer <secret>` |

## API Overview

Public:

| Method | Endpoint            | Description                        |
| ------ | ------------------- | ---------------------------------- |
| GET    | `/api/health`       | Health check — `db: connected`/`demo` plus whether `MONGODB_URI` is set and why the last connection failed |
| GET    | `/api/requirements` | Current requirements               |
| GET    | `/api/activities`   | Recent activities                  |
| GET    | `/api/stats`        | Live counts (volunteers, needs, activities, supporters) |
| GET    | `/api/posts`        | Latest social posts (YouTube/Instagram) |
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
| GET    | `/api/admin/posts`                | List all posts                 |
| POST   | `/api/admin/posts/preview`        | Preview a post URL before saving |
| POST   | `/api/admin/posts`                | Publish a post from a URL      |
| DELETE | `/api/admin/posts/:id`            | Remove a post from the site    |
| POST   | `/api/admin/posts/sync`           | Sync the YouTube channel now   |

Cron: `GET /api/cron/sync-posts` (called daily by Vercel; protected by `CRON_SECRET` when set).

## Deploying to Vercel

The repo deploys as a **single Vercel project**: the Vite client is built to static files, and the
Express API runs as one serverless function (`api/server.js`) mounted at `/api/*`.

`vercel.json` wires this up:

- `installCommand` — installs the `server/` and `client/` dependencies
- `buildCommand` — `npm run build --prefix client`
- `outputDirectory` — `client/dist`
- rewrites — `/api/(.*)` → the serverless function; everything else → `/index.html` (SPA routing)
- crons — daily YouTube sync

**Root Directory must stay empty (repo root)** — the API lives outside `client/`, so pointing
the project at `client/` would silently drop it.

Set the environment variables from the table above in Vercel → Settings → Environment Variables
(the MongoDB Atlas Vercel Marketplace integration creates `MONGODB_URI` automatically), then
redeploy — env var changes only apply to new deployments.

If a deployment 404s on `/api/*` (typically on admin login), the serverless function wasn't picked
up: confirm `api/server.js` is committed and the `/api/(.*)` rewrite is present in `vercel.json`.

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

## Notes

- The problem statement alternates between "DPG School" and "DPS Shiksha Samiti NGO" — this
  project uses **DPS Shiksha Samiti NGO** (their real name on all social channels).
- Contact details (address, phone, social links) come from the NGO's public Facebook/Instagram
  profiles and should be verified with the client before going live.
