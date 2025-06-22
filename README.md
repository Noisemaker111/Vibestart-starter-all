# 🚀 JonStack

A production-ready, full-stack web application starter kit with **everything** pre-configured. Stop wasting time on boilerplate. Start building features that matter.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![React Router](https://img.shields.io/badge/React_Router-v7-red)](https://reactrouter.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

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
JonStack/
├── src/
│   ├── client/          # React frontend
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Route pages
│   │   ├── context/     # React contexts
│   │   └── utils/       # Client utilities
│   ├── server/          # Backend logic
│   │   ├── db/          # Database setup & queries
│   │   └── uploadthing.ts
│   └── shared/          # Shared types & utilities
├── public/              # Static assets
├── drizzle/             # Database migrations
└── config files...      # Pre-configured tooling
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- PostgreSQL database (local or cloud)
- Supabase account ([free tier](https://supabase.com))
- UploadThing account ([free tier](https://uploadthing.com))

### Get Started in 60 Seconds

```bash
# Clone the repository
git clone https://github.com/yourusername/jonstack.git my-app
cd my-app

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Run database migrations
npm run db:migrate

# Start development server
npm run dev
```

Your app is now running at [http://localhost:5173](http://localhost:5173) 🎉

## 🔧 Environment Variables

Create a `.env.local` file:

```env
# Supabase
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# UploadThing
UPLOADTHING_TOKEN=your_uploadthing_token
```

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

## 🛠️ Available Scripts

```bash
# Development
npm run dev          # Start dev server with HMR
npm run typecheck    # Run TypeScript compiler

# Database
npm run db:generate  # Generate migrations
npm run db:migrate   # Run migrations
npm run db:push      # Push schema changes
npm run db:studio    # Open Drizzle Studio

# Production
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run format       # Format with Prettier
```

## 🌐 Deployment

### Vercel (Recommended)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/jonstack)

1. Click the button above
2. Add environment variables
3. Deploy!

### Other Platforms
- **Netlify**: Full support with automatic builds
- **Railway**: One-click deploy from GitHub
- **Fly.io**: Docker support included
- **Self-hosted**: Node.js 18+ required

## 🏗️ Tech Stack

- **Framework**: [React Router v7](https://reactrouter.com/) - Full-stack React framework
- **Database**: [PostgreSQL](https://www.postgresql.org/) + [Drizzle ORM](https://orm.drizzle.team/)
- **Auth**: [Supabase Auth](https://supabase.com/auth)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **File Uploads**: [UploadThing](https://uploadthing.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Deployment**: Optimized for [Vercel](https://vercel.com/)

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
- All contributors who help improve this template

---

<p align="center">
  Built with ❤️ by developers, for developers
</p>

<p align="center">
  <a href="https://github.com/yourusername/jonstack">⭐ Star this repo</a> •
  <a href="/docs">📖 Read the docs</a> •
  <a href="https://github.com/yourusername/jonstack/issues">🐛 Report an issue</a>
</p>
