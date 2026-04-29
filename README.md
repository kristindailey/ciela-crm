# Ciela CRM | Your network is your next opportunity.

Ciela is a CRM built for job seekers. Track the contacts and companies that matter, and turn every conversation into a step forward.

🔗 [Start building your network today.](https://client-production-30ca.up.railway.app/)

## Overview

Ciela CRM tracks the full job-search lifecycle:

- **Companies** organized by tier (Tier 1 / Tier 2 / Tier 3 / Backlog) with metadata such as office policy, employee count, tech stack, and Glassdoor/Blind ratings.
- **Contacts** linked to companies, with social/profile links and outreach notes.
- **Interactions** with contacts (email, phone, meeting, meetup, LinkedIn, Bluesky, etc.), with follow-up dates that drive reminders.
- **Applications** with statuses (Applied → Phone Screen → Technical → Onsite → Offer/Rejected/Withdrawn), referral tracking, and resume/cover-letter URLs.
- **Priorities and Wins** — lightweight dashboard items the user maintains week to week.
- **Dashboard Analytics** — weekly outreach metrics by tier, tier breakdowns, and trend data.

## Architecture

Two-package monorepo. There is no root `package.json` — install and run from each subdirectory.

```
ciela-crm/
├── client/   React 19 + Vite + TypeScript SPA (Tailwind v4, react-router v7, react-aria-components)
└── server/   Express 5 + TypeScript API (Prisma + PostgreSQL, Passport sessions)
```

- **Auth.** Passport with three strategies — Google OAuth, GitHub OAuth, and local (argon2-hashed). Sessions are stored in Postgres via `@quixo3/prisma-session-store` and carried by an HTTP-only cookie. The client sends `credentials: "include"` on every request.
- **Authorization.** Every API resource is per-user. The server mounts each non-auth router behind a `requireAuth` middleware and scopes all queries by `userId`. Cascade deletes flow `User → Company → Job → Application → Interview` and `User → Company → Contact → Interaction`.
- **Uploads.** Logos and document URLs are uploaded directly from the browser to Cloudinary (unsigned preset); only the resulting URL is persisted on the server.
- **Reminders.** A `RemindersContext` on the client polls follow-up dates from interactions to surface upcoming/overdue follow-ups in the UI.

## Prerequisites

- Node.js 20+ (uses native `--env-file` and recent ESM features)
- npm 10+
- A PostgreSQL database (local Postgres or a hosted instance such as Neon/Supabase that exposes both a pooled and a direct connection URL)
- A Cloudinary account with an unsigned upload preset (only required if you want logo/file uploads to work)
- OAuth credentials for Google and/or GitHub (only required if you want social login)

## Quick Start

Clone the repo and install both packages:

```bash
git clone <repo-url> ciela-crm
cd ciela-crm

cd server && npm install && cd ..
cd client && npm install && cd ..
```

Configure environment files (see the sub-package READMEs for the full list):

- `server/.env` — `DATABASE_URL`, `DIRECT_URL`, `SESSION_SECRET`, `FRONTEND_URL`, OAuth client IDs/secrets, callback URLs, `PORT`
- `client/.env` — `VITE_API_BASE_URL`, `VITE_CLOUDINARY_CLOUD_NAME`, `VITE_CLOUDINARY_UPLOAD_PRESET`

Initialize the database and start both processes (each in its own terminal):

```bash
# Terminal 1 — server
cd server
npx prisma migrate dev
npm run dev

# Terminal 2 — client
cd client
npm run dev
```

By default the client runs at `http://localhost:5173` and the server at the `PORT` you set. The two URLs must match what's in `FRONTEND_URL` and `VITE_API_BASE_URL` respectively, or CORS / cookies will fail.

## Sub-package documentation

- [`client/README.md`](client/README.md) — client setup, scripts, env vars, build & deploy
- [`server/README.md`](server/README.md) — server setup, API reference, migrations, deployment

## Tech Stack

- **Frontend:** React 19 (with the React Compiler), Vite 7, TypeScript, Tailwind CSS v4, react-router v7, react-aria-components, Recharts, Lucide / react-icons
- **Backend:** Express 5, TypeScript (ESM, `NodeNext`), Prisma 6, PostgreSQL, Passport (Google / GitHub / Local), argon2, express-session
- **Infra:** Cloudinary (file uploads)
