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
