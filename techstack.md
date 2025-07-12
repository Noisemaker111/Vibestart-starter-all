This is my techstack, provide me with a document that fits my project and show everything from the documentation  Give me a detailed explanation of how to do it, And code that is releveant Over provide documentation and give a lengthly document.

# Tech Stack & Integrations Overview

This document provides a high-level summary of the technologies in use and explains how each server-side or client-side integration fits into the codebase. Keep this file up-to-date as new tools are added or existing ones are replaced.

## 🖥️  Front-End

| Area | Library / Tool | Key Files |
|------|----------------|-----------|
| Build Tooling | **Vite** | `vite.config.ts` |
| UI Library | **React 18** | All `*.tsx` files under `src/pages` |
| Routing | **React Router v6** (file-based via `@react-router/dev`) | `src/pages/routes.ts`, route modules in `src/pages/**` |
| Styling | **Tailwind CSS** | `tailwind.config.js`, global styles in `src/shared/app.css` |
| State/Auth | **Supabase Auth** | `src/shared/supabase.ts`, `src/pages/components/AuthContext.tsx` |
| Analytics | **PostHog** | `src/pages/components/PosthogWrapper.tsx` |
| Maps | **@vis.gl/react-google-maps** | `src/pages/components/BasicGoogleMap.tsx` |

### Front-End Environment Vars

```
VITE_SUPABASE_URL=<https://xyz.supabase.co>
VITE_SUPABASE_ANON_KEY=<public-anon-key>
VITE_POSTHOG_KEY=<your_posthog_key>          # consumed by PosthogWrapper
VITE_GOOGLE_MAPS_API_KEY=<maps_js_key>       # accessed via getGoogleMapsApiKey helper
```

---

## 🗄️  Back-End / API Routes

All API logic is implemented as Remix-compatible route handlers inside `src/pages/api/index.ts`, which delegates to individual integration modules under `src/server/integrations/`. Each handler returns a `Response` object so it can run in edge or serverless environments.

| Endpoint | Module | External Service |
|----------|--------|------------------|
| `/api/animals` | `database.ts` | PostgreSQL (Drizzle ORM) |
| `/api/email` | `email.ts` | Resend API |
| `/api/image-generate` | `image-generation.ts` | OpenAI Images API (DALL·E 3) |
| `/api/polar` | `polar.ts` | Polar API |
| `/api/polar/webhook` | `polar-webhook.ts` | Polar Webhooks |
| `/api/uploadthing` | `uploadthing.ts` | UploadThing (file storage & CDN) |
| `/api/token-usage` | `token-usage.ts` | Internal logging only |
| `/api/botid` | `security.ts` | botid/server verification |

### Key Integration Modules

1. **Database (`database.ts`)**
   • Uses `drizzle-orm` with `postgres.js` to connect to Postgres. Table schemas are colocated for type-safety.<br/>
   • Exports a singleton `db` for queries and several `pgTable` definitions.

2. **Email (`email.ts`)**
   • Wraps the Resend SDK to send transactional emails.<br/>
   • Validates payloads with **Zod** before dispatching.

3. **Image Generation (`image-generation.ts`)**
   • Thin proxy around the `POST /v1/images/generations` endpoint of OpenAI.<br/>
   • Supports prompt, size, quality, format & background parameters.

4. **Polar (`polar.ts`, `polar-webhook.ts`)**
   • Loader fetches Polar products or ping.
   • Webhook handles `application/json` events from Polar and can be extended.

5. **UploadThing (`uploadthing.ts`)**
   • Handles secure uploads (4 MB image limit).<br/>
   • Persists metadata to Postgres via `uploadsTable`.

6. **Token Usage (`token-usage.ts`)**
   • Lightweight endpoint to log LLM token counts for analytics / billing.

### Back-End Environment Vars

```
DATABASE_URL=<postgres_connection>
VITE_DATABASE_URL=<same_as_above_if_running_in_browser>
VITE_OPENAI_API_KEY=<openai_key>
OPENROUTER_API_KEY=<openrouter_key>      # server-side only
VITE_RESEND_API_KEY=<resend_key>
VITE_POLAR_ACCESS_TOKEN=<polar_key>
VITE_GOOGLE_MAPS_API_KEY=<maps_key>
VITE_DEV_EMAIL_HASH=<sha_of_allowed_email> # security helper
```

---

## ✨ Core Libraries

| Area | Library / Tool | Key Files |
|------|----------------|-----------|
| App Logic | **Effect-TS** | `@effect-docs.mdc` |

### Key Features

**Effect-TS** is a powerful library for building robust, type-safe, and scalable applications in TypeScript. It provides a comprehensive ecosystem for handling effects, managing dependencies, and ensuring correctness through functional programming principles.

- **Effect-TS (`@effect-docs.mdc`)**
  - Used for managing application side-effects, asynchrony, and resources in a declarative and composable way.
  - Provides modules for managing configuration, logging, caching, and more.
  - Encourages a functional and type-safe approach to application development.

---

## 🔐 Security & Rate Limiting

• `src/server/utils/security.ts` – guards integration routes via `canCallIntegrations`, verifies `anon_token`, and runs `botid/server` checks.<br/>
• `src/server/utils/rateLimit.ts` – implements a Postgres-backed sliding-window limiter (see `rate_limits` table).

---

## 🗺️  How to Add a New Integration

1. Create a new module under `src/server/integrations/<service>.ts`.
2. Validate request payloads with **Zod** and secure the route with `canCallIntegrations`.
3. Wire the loader/action into the switch statement inside `src/pages/api/index.ts`.
4. Add any required environment variables to `.env.example` and document them here.
5. (Optional) Expose a front-end helper component under `src/pages/components/` if UI support is required.

---

> 📄 **Tip:** Whenever you rename or move files, remember to run `npm run typecheck` and update this document. 