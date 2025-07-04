/Generate Cursor Rules

<project-structure.mdc>
---
description: 
globs: 
alwaysApply: true
---
<project-structure>
... (project structure here – customise as needed)
</project-structure>

<tech-stack.mdc>
---
description: 
globs: 
alwaysApply: true
---
- lang: TypeScript 5
- frontend: React 19 + ReactRouter 7 (SSR) via Vite 6 & vite-tsconfig-paths
- style: TailwindCSS 4 (@tailwindcss/vite)
- runtime: Node 18
- db: PostgreSQL (Supabase) · DrizzleORM 0.44
- migrations: drizzle-kit CLI
- auth: SupabaseAuth (Google)
- files: UploadThing
- validation: Zod
- rate-limit: Unified DB-backed token bucket
- analytics: PostHog JS
- date: Day.js
- icons: Lucide React
- deploy: Vercel primary

/Setup Project
npm install
npm run dev