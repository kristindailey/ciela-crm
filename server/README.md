# Ciela CRM — Server

Express 5 API written in TypeScript (ESM, `NodeNext`). Uses Prisma against PostgreSQL, with Passport-based session auth backed by a Prisma session store.

## Stack

- **Express 5** + **TypeScript** (ESM, `module: NodeNext`)
- **Prisma 6** + **PostgreSQL**
- **Passport** with `passport-local`, `passport-google-oauth20`, `passport-github2`
- **express-session** with `@quixo3/prisma-session-store`
- **argon2** for password hashing
- **morgan** for request logging
- **tsx** for the dev runner

## Setup

From the `server/` directory:

```bash
npm install              # also runs `prisma generate` via postinstall
touch .env               # then fill in the variables listed below before continuing
npx prisma migrate dev   # apply migrations and regenerate the Prisma client
npm run dev              # tsx watch mode
```

The dev server listens on `process.env.PORT` and logs `Server is listening on PORT <PORT>...` on startup.

## Environment variables

`server/.env` is loaded via `tsx --env-file=.env` in development and read directly by Node in production.

| Variable                | Required        | Description                                                                                              |
| ----------------------- | --------------- | -------------------------------------------------------------------------------------------------------- |
| `PORT`                  | yes             | Port to listen on.                                                                                       |
| `DATABASE_URL`          | yes             | Postgres connection string used at runtime. Use the **pooled** URL if your provider has one.             |
| `DIRECT_URL`            | yes             | Direct (non-pooled) Postgres URL used by Prisma for migrations. With Neon/Supabase this is the unpooled connection. |
| `SESSION_SECRET`        | yes             | Secret for `express-session` signing. Use a long random string.                                          |
| `FRONTEND_URL`          | yes             | Exact origin of the client (no trailing slash). Used for the CORS allowlist and for OAuth redirects.     |
| `NODE_ENV`              | prod            | Set to `production` to flip session cookies to `secure: true, sameSite: "none"`.                         |
| `GOOGLE_CLIENT_ID`      | for Google      | Google OAuth client ID.                                                                                  |
| `GOOGLE_CLIENT_SECRET`  | for Google      | Google OAuth client secret.                                                                              |
| `GOOGLE_CALLBACK_URL`   | for Google      | Must equal what's registered in the Google console, e.g. `https://api.example.com/auth/google/callback`. |
| `GITHUB_CLIENT_ID`      | for GitHub      | GitHub OAuth app client ID.                                                                              |
| `GITHUB_CLIENT_SECRET`  | for GitHub      | GitHub OAuth app client secret.                                                                          |
| `GITHUB_CALLBACK_URL`   | for GitHub      | Must equal what's registered in the GitHub OAuth app, e.g. `https://api.example.com/auth/github/callback`. |

## Scripts

| Script                    | What it does                                                  |
| ------------------------- | ------------------------------------------------------------- |
| `npm run dev`             | `tsx --watch --env-file=.env ./src/index.ts`                  |
| `npm run build`           | `tsc` to `dist/`                                              |
| `npm start`               | `node dist/index.js` (expects `npm run build` to have run)    |
| `npm run migrate:deploy`  | `prisma migrate deploy` — apply pending migrations to a DB    |
| `postinstall`             | `prisma generate` — runs automatically after `npm install`    |

There is no test runner configured.

## Middleware order (do not change without thought)

`src/index.ts` wires the app in this exact order:

1. `app.set("trust proxy", 1)` — **must be set before the session middleware**, otherwise sessions break in production behind a proxy (commit `13b2a2f`).
2. `cors({ origin: FRONTEND_URL, credentials: true })`
3. `express.json()`
4. `morgan("dev")`
5. `session(...)` with the Prisma session store
6. `passport.initialize()` + `passport.session()`
7. Routers — `/auth` is public; everything else is wrapped in a local `requireAuth` that 401s if `req.user` is missing.

## ESM + module resolution

`package.json` has `"type": "module"`, and `tsconfig.json` uses `module: NodeNext` / `moduleResolution: NodeNext`. **Every relative import must include the `.js` extension**, even though the source is `.ts`:

```ts
import { prisma } from "./lib/prisma.js";          // ✅
import authRoutes from "./routes/auth.js";         // ✅
import { prisma } from "./lib/prisma";             // ❌ runtime error
```

## Authentication

Three Passport strategies are registered in `src/config/auth.ts`:

- **Local** — `email` + `password`. Passwords are hashed with argon2 via `lib/auth.ts`. Emails are lowercased on registration and on lookup.
- **Google OAuth 2.0** — if a user with a matching email already exists, the `googleId` is linked onto that account rather than creating a duplicate.
- **GitHub OAuth 2.0** — same email-linking behavior with `githubId`.

Sessions are persisted to Postgres in the `Session` table by `@quixo3/prisma-session-store`. The session cookie is HTTP-only with `maxAge: 24h`. In production it is `secure: true, sameSite: "none"`; in development it is `secure: false, sameSite: "lax"`.

`serializeUser` stores only the user's `id`; `deserializeUser` re-fetches via Prisma on every request. That means a deleted user is logged out on the next request.

## API reference

Routes live in `src/routes`. One file per resource (auth, companies, contacts, etc.). All non-`/auth` routes require a session cookie and are scoped to the authenticated user.

## Data model

See `prisma/schema.prisma`. Everything is rooted at `User` with `onDelete: Cascade` on every relation, so deleting a user wipes all their data.

## Migrations

Prisma Migrate is the source of truth — never edit `prisma/migrations/` by hand or run raw DDL on a managed environment.

Local development:

```bash
# After editing schema.prisma:
npx prisma migrate dev --name <short_description>
# Creates a new migration, applies it, and regenerates the client.

# Reset the local DB to match migrations from scratch (DESTRUCTIVE):
npx prisma migrate reset

# Open a DB browser:
npx prisma studio
```

Production / staging:

```bash
npm run migrate:deploy   # = prisma migrate deploy
```

`migrate deploy` only applies pending migrations and never generates new ones — it's safe to run on every deploy.

`schema.prisma` declares both `url` (`DATABASE_URL`) and `directUrl` (`DIRECT_URL`). Migrations run against `DIRECT_URL` because connection poolers (PgBouncer / Neon's pooler) don't support the prepared-statement features Prisma Migrate needs. Runtime queries use `DATABASE_URL`.

## Build & deploy

```bash
npm run build      # tsc -> dist/
npm start          # node dist/index.js
```

Production checklist:

- Set `NODE_ENV=production` so session cookies become `secure: true, sameSite: "none"` (required for cross-site cookies between client and API).
- Serve the API over **HTTPS** — `secure` cookies are dropped on plain HTTP.
- If running behind a reverse proxy or a platform load balancer, the existing `app.set("trust proxy", 1)` lets Express read `X-Forwarded-*` headers; without it the session middleware refuses to set secure cookies. Don't move that line below the session middleware.
- `FRONTEND_URL` must exactly match the deployed client origin (scheme + host + port, no trailing slash). Mismatches break CORS and silently drop the cookie.
- Register the production OAuth callback URLs in the Google and GitHub consoles and put them in `GOOGLE_CALLBACK_URL` / `GITHUB_CALLBACK_URL`.
- Run `npm run migrate:deploy` as part of the release pipeline (before traffic is routed to the new version).
- The Prisma client is generated by the `postinstall` script. If your deploy environment caches `node_modules` without re-running `postinstall`, run `npx prisma generate` explicitly.

## Common gotchas

- **`Cannot find module './foo'` at runtime.** Add the `.js` extension to the relative import (see "ESM + module resolution" above).
- **Session never persists in production.** Either `trust proxy` is missing/below the session middleware, the request isn't HTTPS, or `FRONTEND_URL` doesn't match the actual client origin.
- **`P2002` on company create.** That's `@@unique([name, userId])` — a company with that name already exists for the user. The route translates this to a 400 with a friendly message.
- **`PrismaSessionStore` warnings about `checkPeriod`.** Expected; it sweeps expired sessions every 2 minutes.