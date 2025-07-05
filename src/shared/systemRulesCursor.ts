export const PROJECT_STRUCTURE_MDC = `---
description: 
globs: 
alwaysApply: true
---
<project-structure>
src/ — all source code
src/client/ — React 19 browser app (SSR)
src/server/ — API & edge runtime
src/shared/ — isomorphic utilities
public/ — static assets
tailwind.config.js — Tailwind v4 config
react-router.config.ts — React Router build/dev config
vite.config.ts — Vite SSR config & aliases
`;

export const TECH_STACK_MDC = `---
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
`;

export const CURSOR_RULE_FILES = [
  { name: "project-structure.mdc", body: PROJECT_STRUCTURE_MDC },
  { name: "tech-stack.mdc", body: TECH_STACK_MDC },
] as const; 