# Start-Coding – Tech Stack & Project Overview

## 1. High-Level Summary
This repository implements a **full-stack TypeScript web application** for cataloguing musical instruments. It combines a modern React front-end (rendered with React Router's App Router & SSR) with a PostgreSQL database accessed through **Drizzle ORM**. Authentication and file storage are delegated to **Supabase**, while **UploadThing** handles direct browser → storage uploads.

> The project is designed so that **all code lives inside `/src`** – split into `client`, `server`, and `shared` workspaces – and can be built & served with a single `npm run build && npm run start` command or fully containerised through the provided `Dockerfile`.

---

## 2. Core Runtime & Build Tooling
| Purpose | Library / Tool | Notes |
|---------|----------------|-------|
| **Runtime & Language** | Node.js 20 (alpine in Docker), TypeScript 5.8 | `type: "module"` ESM project, TS strict mode.
| **Bundler / Dev Server** | Vite 6 | Fast HMR, plus `@tailwindcss/vite` + React Router plugin.
| **Framework / Router** | React 19 + React Router 7 | Server-Side Rendering (SSR = `true` in `react-router.config.ts`).
| **Styling** | Tailwind CSS 4 | Config in `tailwind.config.js`, dark-mode via `class`.
| **Containerisation** | Multi-stage `Dockerfile` | 1️⃣ install dev deps → 2️⃣ prune → 3️⃣ build → 4️⃣ runtime image.

---

## 3. Back-End & Persistence
| Concern | Library / Service | Implementation |
|---------|------------------|----------------|
| **SQL Dialect** | PostgreSQL | Local or cloud URL provided via `DATABASE_URL`.
| **ORM / Query builder** | Drizzle ORM 0.44 | Schema in `src/server/db/schema.ts`, queries in `src/server/db/queries`.
| **Connection** | `postgres` node driver | Wrapped by `drizzle()` in `src/server/db/index.ts`.
| **Migrations** | drizzle-kit | Config in `drizzle.config.ts`, generated SQL lives under `src/server/db/migrations/`.

Supabase row-level security is assumed: `instruments.user_id` is a UUID that references `auth.users(id)`.

---

## 4. Authentication & API Integration
| Concern | Library / Service | Files |
|---------|------------------|-------|
| **Auth** | Supabase Auth (OTP, OAuth) | `src/shared/supabase.ts` initialises client with `VITE_` env vars. Login UI via `@supabase/auth-ui-react` on the `home` page.
| **File Uploads** | UploadThing 7 | Browser components in `src/client/utils/uploadthing.ts`, route handler in `src/client/pages/api.uploadthing.tsx`.
| **Validation** | Zod 3 | Shared schemas in `src/shared/schema.ts` ensure type-safe forms & API payloads.

---

## 5. Front-End Structure
```
src/client/
  root.tsx            – global `<Layout>` & Error Boundary
  routes.ts           – route manifest (home + /api/uploadthing)
  pages/
    home.tsx          – main SPA/SSR page
    api.uploadthing.tsx – UploadThing action/loader
  styles/app.css      – Tailwind @layer directives
  utils/uploadthing.ts – typed UploadButton & Dropzone
```
Generated *type-safe* route helpers live under `.react-router/` after `npm run typecheck`.

---

## 6. Shared & Server Code
```
src/shared/           – code that runs on both client & server
  schema.ts           – zod + Drizzle type exports
  supabase.ts         – isomorphic Supabase client

src/server/
  db/                 – Postgres layer
    index.ts          – drizzle(db) instance
    schema.ts         – Drizzle table definitions
    queries/          – reusable CRUD helpers
    migrations/       – SQL migrations (generated)
```

---

## 7. Environment Variables
The project **assumes** a valid `.env.local` (or `.env`) – do not commit it. Required keys:
```
# Database
DATABASE_URL=postgresql://user:pass@host:5432/db
# Supabase Project
VITE_SUPABASE_URL=https://abc.supabase.co
VITE_SUPABASE_ANON_KEY=public-anon-key
```

---

## 8. NPM Scripts Cheat-Sheet
| Script | What it does |
|--------|--------------|
| `npm run dev` | Starts Vite + React Router in watch mode with HMR.
| `npm run build` | Generates a production‐optimised build (`/build`).
| `npm run start` | Serves the built SSR app via `@react-router/serve`.
| `npm run typecheck` | Runs React Router typegen + TypeScript compiler.
| `db:generate` / `db:migrate` / `db:push` / `db:studio` | drizzle-kit commands for schema drift, applying migrations, introspection and GUI studio.

---

## 9. How All the Pieces Fit Together
1. **User requests** route → React Router server entry renders SSR HTML.
2. **Layout** in `root.tsx` provides global UI and injects Tailwind styles.
3. At runtime the browser hydrates React 19; Vite's HMR aids development.
4. **Auth** state (Supabase) determines whether to show `<Auth />` or instrument list.
5. CRUD actions call Supabase REST RPC initially → Later can be migrated to Drizzle+Edge Functions.
6. File images are uploaded direct via UploadThing, returning a public URL stored alongside instrument row.
7. PostgreSQL persists entities; Drizzle queries simplify SQL and enforce types.

---

## 10. Next Steps / TODOs
- Replace direct Supabase `.from()` calls with server-side Drizzle endpoints for stronger typing.
- Add RLS policies & Supabase storage bucket for images (if UploadThing is replaced).
- Introduce end-to-end tests (e.g. Playwright) and CI.