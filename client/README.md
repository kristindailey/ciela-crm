# Ciela CRM — Client

React 19 + Vite + TypeScript SPA. Talks to the [`server`](../server/README.md) over a cookie-based session API.

## Stack

- **React 19** with the [React Compiler](https://react.dev/learn/react-compiler) (`babel-plugin-react-compiler` enabled in `vite.config.ts`).
- **Vite 7** for dev server and build.
- **TypeScript 5.8**, strict mode.
- **Tailwind CSS v4** via the `@tailwindcss/vite` plugin.
- **react-router v7** (`createBrowserRouter`).
- **react-aria-components** for accessible primitives, **Recharts** for charts, **lucide-react** + **react-icons** for icons, **papaparse** for CSV import, **@cloudinary/url-gen** for image URL building.

## Setup

From the `client/` directory:

```bash
npm install
touch .env    # then fill in the variables listed below
npm run dev
```

The client runs at `http://localhost:5173` by default.

## Environment variables

Create `client/.env` with:

| Variable                          | Required | Description                                                                                |
| --------------------------------- | -------- | ------------------------------------------------------------------------------------------ |
| `VITE_API_BASE_URL`               | yes      | Origin of the API server, e.g. `http://localhost:3000`. **No trailing slash.** Must match `FRONTEND_URL` from the server's CORS allowlist (cookies require an exact origin match). |
| `VITE_CLOUDINARY_CLOUD_NAME`      | conditional\*    | Cloudinary cloud name. Required for logo/file uploads.                                     |
| `VITE_CLOUDINARY_UPLOAD_PRESET`   | conditional\*    | Unsigned upload preset configured in Cloudinary.                                           |

\* Only required if you want uploads to work. The rest of the app runs without them.

Vite only exposes variables prefixed with `VITE_` to the client. Treat anything in `.env` as public.

## Scripts

| Script            | What it does                                                              |
| ----------------- | ------------------------------------------------------------------------- |
| `npm run dev`     | Vite dev server with HMR.                                                 |
| `npm run build`   | `tsc -b` (project-references typecheck) **and** `vite build` to `dist/`. The build fails on type errors. |
| `npm run preview` | Serves the built `dist/` for local smoke-testing.                         |
| `npm run lint`    | ESLint over `**/*.{ts,tsx}`. Append -- --fix to autofix. |

There is no test runner configured.

## How auth works on the client

1. On mount, `AuthContext` calls `getCurrentUser()` (`GET /auth/me`) to hydrate `user`. While the request is in flight, `isLoading` is `true`.
2. `ProtectedRoute` waits for `isLoading` to settle, then redirects to `/login` if `user` is null.
3. Every API call uses `fetch(..., { credentials: "include" })` so the session cookie is sent. **Without this the server will see no user.**
4. Provider order in `App.tsx` is `AuthProvider → ThemeProvider → RemindersProvider`. `RemindersContext` depends on auth state, so don't reorder.

## Cloudinary uploads

Logo and document uploads go straight from the browser to Cloudinary using an **unsigned upload preset**. The server is not in the upload path; it only persists the resulting URL on the relevant record. See `components/CompanyHeader.tsx` for the canonical pattern.

This means the upload preset must allow unsigned uploads from your client origin. If uploads silently fail, check the Cloudinary preset's allowed origins and any folder/transformation restrictions.

## Build & deploy notes

- `npm run build` produces a static bundle in `dist/`. Deploy to any static host (Vercel, Netlify, Cloudflare Pages, S3+CloudFront, etc.).
- The build is fully static. There is no SSR and no Node runtime. All API state is fetched at runtime via `VITE_API_BASE_URL`.
- Set `VITE_API_BASE_URL` to your deployed API origin in the host's environment-variable settings before building. Vite **bakes** env values into the bundle at build time, so changing them later requires a rebuild.
- The API and client must be on origins that share enough context for the session cookie to round-trip. In production the server sets the cookie with `secure: true, sameSite: "none"`, which requires HTTPS on both sides.
- `react-router` uses the History API. If you deploy to a host that doesn't fall back to `index.html`, configure a SPA fallback (e.g. Netlify's `_redirects: /* /index.html 200`, Vercel rewrites, Cloudflare Pages' SPA mode).

## Linting & TypeScript

- ESLint config: `eslint.config.js` (flat config) extending `@eslint/js`, `typescript-eslint`, `eslint-plugin-react-hooks` (`recommended-latest`), and `eslint-plugin-react-refresh` (`vite`). `dist/` is ignored.
- TypeScript uses project references: `tsconfig.json` → `tsconfig.app.json` (app code) + `tsconfig.node.json` (build tooling). Run `npm run build` to typecheck both.

## Common gotchas

- **CORS / cookies break in dev.** The server's `FRONTEND_URL` must equal the URL you load in the browser, character-for-character (scheme, host, port, no trailing slash).
- **Stale `VITE_*` values.** After editing `.env`, restart the Vite dev server. It does not pick up env changes via HMR.