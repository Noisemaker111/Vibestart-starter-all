# Full-Stack React + Vite Starter  

## Overview
This project is a batteries-included starter that wires together the most common SaaS integrations you need to ship a modern web product.  
It ships with a demo **Integration Tests** modal so you can verify every service locally before you deploy.

### What's already hooked up
1. **Database & Auth** – [Supabase](https://supabase.com) with row-level security, real-time channels and email / OAuth sign-in UI.  
2. **ORM & Migrations** – [Drizzle ORM](https://orm.drizzle.team) + `drizzle-kit` for type-safe PostgreSQL migrations.  
3. **File Uploads** – [UploadThing](https://uploadthing.com) (images / pdf / video).  
4. **Analytics** – [PostHog Cloud](https://posthog.com) (auto-capturing + custom events).  
5. **Emails** – [Resend](https://resend.com).  
6. **Payments** – [Polar](https://polar.sh) (Stripe-compatible billing).  
7. **LLMs** – OpenRouter (chat / JSON) and OpenAI (image generation).  
8. **Maps** – Google Maps Places Autocomplete via `@vis.gl/react-google-maps`.  
9. **Bot Detection** – `botid` client / edge verification.  
10. **Real-time chat demo** – Supabase channels.  
11. **CI-ready build** – React Router v7 + Vite + TypeScript + TailwindCSS.

---

## Getting Started
### 1. Clone & Install
```bash
# clone
git clone https://github.com/your-org/your-starter.git my-app && cd my-app

# install deps (Node ≥ 20)
npm install   # or pnpm / yarn
```

### 2. Configure environment variables
Copy the example file and fill in **every** value:
```bash
cp .env.example .env
```
The table below explains what each variable does. If a service isn't relevant for you, leave the value blank and the UI will gracefully degrade.

| Variable | Required | Description |
|----------|----------|-------------|
| `UPLOADTHING_TOKEN` | ✅ | Server token from UploadThing dashboard. |
| `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` | ✅ | Supabase project URL + anon key. |
| `DATABASE_URL` | ✅ | Postgres connection string for **Drizzle ORM migrations**. |
| `VITE_OPENROUTER_API_KEY` / `OPENROUTER_API_KEY` | ⬜ | Same key in both client & server for chat/JSON models. |
| `OPENAI_API_KEY` | ⬜ | Only needed for image generation (DALL-E 3). |
| `VITE_PUBLIC_POSTHOG_KEY` / `VITE_PUBLIC_POSTHOG_HOST` | ⬜ | Public key + host from PostHog Cloud. |
| `VITE_SITE_URL` | ✅ | Origin that the browser will run on (used for referer checks). |
| `VITE_SUPABASE_REDIRECT` | ✅ | Supabase OAuth redirect URL (must be whitelisted). |
| `POLAR_ACCESS_TOKEN` / `POLAR_WEBHOOK_SECRET` | ⬜ | Polar billing API + webhook secret. |
| `RESEND_API_KEY` | ⬜ | Resend API key for emails. |
| `GOOGLE_MAPS_API_KEY` | ⬜ | Places API enabled key. |
| `VITE_DEV_EMAIL_HASH` | ✅ in prod | FNV-1a hash of the developer e-mail allowed to call 3rd-party paid APIs from prod. Generate with:  
`node -e "const f=s=>{let h=0x811c9dc5;for(const c of s){h^=c.charCodeAt(0);h=(h*0x1000193)>>>0;}console.log(h.toString(16))};f('your@email')"`

### 3. Set up Supabase & Database
1. Create a new Supabase project.  
2. Copy the project URL & anon key into `.env`.  
3. Provision the Postgres connection string (Supabase **Database → Connection pooling**).  
4. **Generate** the SQL from Drizzle and apply:
```bash
npm run db:generate   # creates migrations in /src/server/db/migrations
npm run db:push       # pushes to the remote Supabase database
```

### 4. Run the dev server
```bash
npm run dev          # Vite + React Router live-reload
```
Open `http://localhost:5173` and click **"Run Integration Tests"** on the home page to verify each service.

---

## Useful Scripts
| Command | Purpose |
|---------|---------|
| `npm run dev` | Start Vite dev server + API routes. |
| `npm run build` | Production build (SSR bundle + client). |
| `npm run start` | Serve built output (uses `@react-router/serve`). |
| `npm run typecheck` | `tsc` + React Router type-gen. |
| `npm run db:generate` | Sync Drizzle schema → SQL migrations. |
| `npm run db:migrate` | Apply pending migrations in `./drizzle`. |
| `npm run db:studio` | Launch Drizzle Studio GUI. |

---

## Project Structure (important bits)
```
src/
  pages/                # Client pages & API routes (React Router v7 islands)
    home/               # Demo UI + Integration modal
    api/                # tRPC-style lightweight API endpoints
  server/               # Server-only helpers (image generation, webhook handlers, db)
    db/                 # Drizzle ORM schema & migrations
    utils/              # Auth, logging, rate-limit, etc.
shared/                 # Code shared between client & server (supabase instance, global styles)
```

---

## Deployment
1. **Build:** `npm run build` → outputs to `/build`.  
2. **Serve:** `npm start` (uses `@react-router/serve` – works on any Node host).  
3. Configure your hosting provider with the **same environment variables** from your `.env` file.

---

### FAQ
*Q: I only want some integrations.*  
Edit `src/pages/home/components/TestIntegrationsModal.tsx` and remove the tests you don't need; the underlying code is already split by feature.

*Q: Why both client & server OpenRouter keys?*  
For streaming chat completion in the browser **and** secure server-side calls. If you don't want client LLM calls, omit `VITE_OPENROUTER_API_KEY` and the UI will no-op.

*Q: Can I deploy to Vercel?*  
Yes – add your env vars in **Project → Settings → Environment Variables**, then `vercel --prod`.

Happy shipping! ✨