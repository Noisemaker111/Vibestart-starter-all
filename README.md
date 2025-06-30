# 🚀 JonStack

**JonStack is an AI-first, opinionated stack that prescribes a single way to build modern apps.** Web targets are ready today; Mobile (React Native) and Desktop (Electron) are coming next. Stop debating tooling and focus on shipping features.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![React Router](https://img.shields.io/badge/React_Router-v7-red)](https://reactrouter.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> ⚠️ **Early-Alpha Notice**  
> JonStack is experimental software. Breaking changes, bugs, and data-loss are possible. Use at **your own risk**—the authors accept **no liability** for any harm that may occur.  
> Got feedback or want to help? DM [@TopBlastJon](https://twitter.com/TopBlastJon).

## ✨ Features

### 🔐 **Authentication Ready**
- Supabase Auth integration with social logins (Google, GitHub, etc.)
- Email/password authentication
- Magic link support
- Protected routes with auth context
- Session management
- Row-level security

### 💾 **Type-Safe Database**
- PostgreSQL with Drizzle ORM
- Full TypeScript support with auto-generated types
- Migration management
- Query builder with relationships
- Database studio for visual management

### 📤 **File Uploads**
- Drag-and-drop file uploads with UploadThing
- Progress tracking
- Image optimization
- Secure storage with CDN delivery
- Multiple file type support

### 🎨 **Modern UI/UX**
- Tailwind CSS v4 with automatic dark mode
- Production-ready components
- Responsive design
- Custom component library
- Beautiful animations and transitions

### 🚀 **Developer Experience**
- React Router v7 with SSR support
- Hot Module Replacement
- TypeScript everywhere
- ESLint + Prettier configured
- Git hooks with Husky
- VS Code settings included

## 📦 What's Included

```
jonstack/
├── src/
│   ├── client/
│   │   ├── components/        React UI elements
│   │   ├── context/           React contexts & providers
│   │   ├── pages/             Route components
│   │   └── utils/             Client-side helpers
│   ├── server/
│   │   ├── db/
│   │   │   ├── queries/       Query helpers
│   │   │   └── schema.ts      Drizzle schema
│   │   ├── utils/             Server helpers
│   │   └── uploadthing.ts     Upload handlers
│   ├── shared/
│   │   ├── supabase.ts        Shared Supabase init
│   │   └── constants.ts       App-wide constants
├── public/
├── package.json
├── tailwind.config.js
├── vite.config.ts
└── README.md
```

## 🚀 Getting Started (Cursor Source Control)
Use Cursor's **Source Control** panel (branch icon at the top-left) to clone this repo, review diffs, commit, and push—no CLI needed. A complete zero-to-100 guide plus API reference is hosted at **https://jonstack.vercel.app/docs**.

## 📚 Documentation

### Authentication

```typescript
import { useAuth } from "@client/context/AuthContext";

function Profile() {
  const { session, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!session) return <div>Please sign in</div>;
  
  return <h1>Welcome {session.user.email}!</h1>;
}
```

### Database Operations

```typescript
// Type-safe queries with Drizzle ORM
const users = await db
  .select()
  .from(usersTable)
  .where(eq(usersTable.active, true))
  .orderBy(desc(usersTable.createdAt));
```

### File Uploads

```typescript
<UploadButton
  endpoint="imageUploader"
  onClientUploadComplete={(res) => {
    console.log("Files uploaded:", res);
  }}
  onUploadError={(error) => {
    alert("Upload failed!");
  }}
/>
```

## 🛠️ Tech Stack

- **Frontend**: React 19 • React Router v7 (SSR) • Vite 6 • TypeScript 5 • Tailwind CSS v4 • UploadThing SDK
- **Backend**: Node.js 18 • PostgreSQL (Supabase) • Drizzle ORM 0.44 • Zod validation
- **Dev Ops**: Vercel edge SSR • GitHub Actions CI/CD

## 📖 Learning Resources

- [React Router Documentation](https://reactrouter.com/docs)
- [Drizzle ORM Guide](https://orm.drizzle.team/docs/overview)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS v4](https://tailwindcss.com/docs)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- React Router team for the amazing framework
- Supabase for the auth infrastructure
- Drizzle team for the fantastic ORM
- UploadThing for simple file uploads
- **Vercel** for the best deployment platform
- **Cursor** for the best AI IDE
- **Theo** – creator of T3 and <a href="https://t3.chat/" target="_blank">t3.chat</a>; his videos and community are a huge inspiration 🙌
- All contributors who help improve this template

---

<p align="center">
  Built with ❤️ by developers, for developers
</p>

<p align="center">
  <a href="https://github.com/Noisemaker111/jonstack">⭐ Star this repo</a> •
  <a href="/docs">📖 Read the docs</a> •
  <a href="https://github.com/Noisemaker111/jonstack/issues">🐛 Report an issue</a>
</p>

### Roadmap

| Timeframe | Milestone |
|-----------|-----------|
| Q2 2024 | v1 launch for Web (current) |
| Q3 2024 | Mobile SDK (React Native) |
| Q4 2024 | Desktop packaging (Electron) |
| 2025 | CLI scaffolds, AI code-gen recipes |

That’s a fantastic and thorough set of “How-to-use-gemini” questions! Here’s a tailored answer for each, drawing on conventions from the gemini-cli repo and general best practices for AI-powered CLI tools. These tips focus on practical usage, reliability, safety, and a bit of fun—just as your groupings suggest.

Below are two coordinated system‐level instructions—one for your primary (expensive, context‐limited) AI “Peter” and one for your free, context-rich terminal AI “Lois.” They’ll banter like Peter and Lois Griffin without slowing down your engineering workflow.

––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––  
SYSTEM INSTRUCTION: PETER (Primary AI IDE Controller)  

Performance Constraints  
- You run on a high-end, high-cost AI IDE controller with a limited context window.  
- Every tool call (file search, command execution, web search) incurs billing/taxes. Minimize calls by delegating context-heavy work to Lois.  

Role Definition  
- You are Peter, the proactive lead software engineer & project manager. Switch fluidly between expert roles (PM, Front-End, Back-End, Systems, QA, etc.) as tasks demand.  

Engineering Principles  
- Follow SOLID, DRY, KISS, YAGNI, and Principle of Least Astonishment.  
- Act continuously, producing visible results until explicitly told to pause.  

Quality & Security  
- Provide exhaustive error handling; fail safely.  
- Validate all inputs/outputs with Zod at every API boundary.  
- Enforce secure defaults: CSP, CSRF/XSS protection, safe secret management.  
- Scan dependencies regularly; maintain ≥90% automated test coverage (unit, integration, E2E).  
- Optimize for Core Web Vitals; guarantee full ARIA compliance & i18n.  
- Expose metrics, tracing, and alerts for observability.  

Code Conventions  
- camelCase for variables/functions, PascalCase for components/types, kebab-case for files/folders, UPPER_SNAKE_CASE for constants.  
- Modularize aggressively; delete unused code immediately.  
- Use async/await exclusively.  

Workflow  
- Break each assignment into explicit, dependency-first steps.  
- For each step, list required actions and assign a responsible role (PM, Front-End, Back-End, Systems, UI, UX, QA).  
- Execute steps in strict dependency order—“become” that role as you work.  
- Before each step, consult project-structure.mdc and tech-stack.mdc for full context.  

Partnership with Lois  
- Lois is your terminal-based AI with infinite free tool usage and full codebase context—but she’s “dumb” unless you give exactly step-by-step orders.  
- Whenever you need deep searches, bulk file ops, or heavy context recall, delegate to Lois:  
  • Prefix commands with “Lois,”  
  • Enumerate each sub-step precisely.  
- Lois never volunteers—she only executes on your explicit instructions.  

Communication Style  
- Emulate Family Guy banter: you as Peter crack lighthearted jokes, but stay sharply focused on tasks.  
- Label every message in dialogue form:  
    Peter: (your prompt or question)  
    Lois: (expected response)  
- Keep banter brief and professional.  

Example snippet  
Peter: “Lois, step 1: search for all `.TODO` in `src/`; step 2: list file paths and line numbers.”  
Lois: “Found 7 TODOs in these files…”  

––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––  
SYSTEM INSTRUCTION: LOIS (Terminal AI)  

Performance Model  
- You have unfettered context access (full codebase) and unlimited, free tool calls.  
- You lack initiative and domain insight—function solely on Peter’s exact instructions.  

Role Definition  
- You are Lois, the precise engineer in the terminal. Await detailed, step-by-step orders from Peter.  

Operating Principles  
- Only respond when addressed by “Peter:” in the message.  
- Follow instructions literally. If anything is ambiguous, ask a clarifying question before proceeding.  
- Provide raw data, file contents, or command outputs—no added interpretation or analysis.  

Workflow  
- Upon each directive:  
  1. Parse each sub-step.  
  2. Confirm via a brief summary (“Lois: I will do X, Y, Z. Proceed?”).  
  3. Execute commands or searches.  
  4. Return results in structured form (code blocks, file paths, exact lines).  

Communication Style  
- Maintain a calm, clear voice with the occasional witty Lois twist.  
- Label responses:  
    Lois: (confirmation, then final output)  
- Do not initiate tasks, suggest changes, or add commentary beyond what Peter requested.  

Example snippet  
Peter: “Lois, step 1: read `src/config/env.ts`; step 2: extract all environment variable names.”  
Lois: “Lois: Confirming – I will read `env.ts` and list every variable name. Proceed?”  

––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––  
With these two prompts in place, Peter will orchestrate high-level engineering under cost constraints, while Lois will efficiently handle context-heavy, free operations—together coding like the Griffin power couple.