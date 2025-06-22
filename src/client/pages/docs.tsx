import { useState } from "react";
import type { Route } from "./+types/docs";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Documentation - JonStack" },
    { name: "description", content: "Complete guide to using JonStack" },
  ];
}

export default function Docs() {
  const [activeSection, setActiveSection] = useState("getting-started");

  const sections = [
    { id: "getting-started", title: "Getting Started", icon: "🚀" },
    { id: "architecture", title: "Architecture", icon: "🏗️" },
    { id: "authentication", title: "Authentication", icon: "🔐" },
    { id: "database", title: "Database", icon: "💾" },
    { id: "file-uploads", title: "File Uploads", icon: "📤" },
    { id: "styling", title: "Styling", icon: "🎨" },
    { id: "deployment", title: "Deployment", icon: "🌐" },
    { id: "api-reference", title: "API Reference", icon: "📚" },
  ];

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex gap-8">
          {/* Sidebar Navigation */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Documentation</h3>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left px-4 py-2 rounded-lg flex items-center gap-3 transition-all ${
                      activeSection === section.id
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span className="text-lg">{section.icon}</span>
                    <span className="text-sm">{section.title}</span>
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Mobile Section Selector */}
            <div className="lg:hidden mb-6">
              <select
                value={activeSection}
                onChange={(e) => setActiveSection(e.target.value)}
                className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg"
              >
                {sections.map((section) => (
                  <option key={section.id} value={section.id}>
                    {section.icon} {section.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Documentation Content */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
              {activeSection === "getting-started" && (
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  <h1 className="text-3xl font-bold mb-6">Getting Started</h1>
                  
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl mb-8">
                    <h3 className="text-lg font-semibold mb-3">Prerequisites</h3>
                    <ul className="space-y-2 text-sm">
                      <li>✓ Node.js 18+ and npm/yarn/pnpm</li>
                      <li>✓ PostgreSQL database (local or cloud)</li>
                      <li>✓ Supabase account (free tier works)</li>
                      <li>✓ UploadThing account (free tier works)</li>
                    </ul>
                  </div>

                  <h2 className="text-2xl font-semibold mt-8 mb-4">Quick Start</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-2">1. Clone the repository</h3>
                      <div className="bg-gray-900 text-gray-300 p-4 rounded-lg overflow-x-auto">
                        <code>git clone https://github.com/yourusername/jonstack.git my-app</code><br/>
                        <code>cd my-app</code>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">2. Install dependencies</h3>
                      <div className="bg-gray-900 text-gray-300 p-4 rounded-lg">
                        <code>npm install</code>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">3. Set up environment variables</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Create a `.env.local` file:</p>
                      <div className="bg-gray-900 text-gray-300 p-4 rounded-lg text-sm">
                        <code># Supabase</code><br/>
                        <code>VITE_SUPABASE_URL=your_supabase_url</code><br/>
                        <code>VITE_SUPABASE_ANON_KEY=your_supabase_anon_key</code><br/><br/>
                        <code># Database</code><br/>
                        <code>DATABASE_URL=postgresql://user:password@localhost:5432/dbname</code><br/><br/>
                        <code># UploadThing</code><br/>
                        <code>UPLOADTHING_TOKEN=your_uploadthing_token</code>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">4. Run database migrations</h3>
                      <div className="bg-gray-900 text-gray-300 p-4 rounded-lg">
                        <code>npm run db:migrate</code>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">5. Start the development server</h3>
                      <div className="bg-gray-900 text-gray-300 p-4 rounded-lg">
                        <code>npm run dev</code>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 p-6 bg-green-50 dark:bg-green-900/20 rounded-xl">
                    <p className="text-green-700 dark:text-green-300 font-medium">
                      🎉 Your app is now running at <code className="bg-green-100 dark:bg-green-800 px-2 py-1 rounded">http://localhost:5173</code>
                    </p>
                  </div>
                </div>
              )}

              {activeSection === "architecture" && (
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  <h1 className="text-3xl font-bold mb-6">Architecture Overview</h1>
                  
                  <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl mb-8">
                    <h3 className="text-lg font-semibold mb-4">Project Structure</h3>
                    <pre className="text-sm overflow-x-auto">
{`JonStack/
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
└── config files...`}
                    </pre>
                  </div>

                  <h2 className="text-2xl font-semibold mt-8 mb-4">Tech Stack</h2>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl">
                      <h3 className="font-semibold mb-3">Frontend</h3>
                      <ul className="space-y-2 text-sm">
                        <li>• React Router v7 (SSR support)</li>
                        <li>• TypeScript for type safety</li>
                        <li>• Tailwind CSS v4 for styling</li>
                        <li>• Supabase Auth UI components</li>
                      </ul>
                    </div>
                    
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-xl">
                      <h3 className="font-semibold mb-3">Backend</h3>
                      <ul className="space-y-2 text-sm">
                        <li>• PostgreSQL database</li>
                        <li>• Drizzle ORM for queries</li>
                        <li>• Supabase for auth & realtime</li>
                        <li>• UploadThing for file storage</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === "authentication" && (
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  <h1 className="text-3xl font-bold mb-6">Authentication</h1>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    JonStack uses Supabase Auth for a complete authentication solution with support for email/password, 
                    magic links, and social providers.
                  </p>

                  <h2 className="text-2xl font-semibold mt-8 mb-4">Using Auth Context</h2>
                  
                  <div className="bg-gray-900 text-gray-300 p-4 rounded-lg mb-6">
                    <code>{`import { useAuth } from "@client/context/AuthContext";

function MyComponent() {
  const { session, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!session) return <div>Please sign in</div>;
  
  return <div>Welcome {session.user.email}!</div>;
}`}</code>
                  </div>

                  <h2 className="text-2xl font-semibold mt-8 mb-4">Protected Routes</h2>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Routes automatically handle authentication state. Components can check auth status using the useAuth hook.
                  </p>

                  <h2 className="text-2xl font-semibold mt-8 mb-4">Social Providers</h2>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Enabled by Default</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Google OAuth</li>
                        <li>• GitHub OAuth</li>
                      </ul>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Easy to Add</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Discord</li>
                        <li>• Twitter</li>
                        <li>• Facebook</li>
                        <li>• And more...</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === "database" && (
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  <h1 className="text-3xl font-bold mb-6">Database Setup</h1>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    JonStack uses PostgreSQL with Drizzle ORM for type-safe database operations.
                  </p>

                  <h2 className="text-2xl font-semibold mt-8 mb-4">Schema Definition</h2>
                  
                  <div className="bg-gray-900 text-gray-300 p-4 rounded-lg mb-6 text-sm">
                    <code>{`// src/server/db/schema.ts
export const projectsTable = pgTable('projects', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  user_id: uuid('user_id').notNull(),
  created_at: timestamp('created_at').defaultNow()
});`}</code>
                  </div>

                  <h2 className="text-2xl font-semibold mt-8 mb-4">Database Commands</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Generate migrations</h4>
                      <div className="bg-gray-900 text-gray-300 p-3 rounded-lg">
                        <code>npm run db:generate</code>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Run migrations</h4>
                      <div className="bg-gray-900 text-gray-300 p-3 rounded-lg">
                        <code>npm run db:migrate</code>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Open Drizzle Studio</h4>
                      <div className="bg-gray-900 text-gray-300 p-3 rounded-lg">
                        <code>npm run db:studio</code>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === "file-uploads" && (
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  <h1 className="text-3xl font-bold mb-6">File Uploads</h1>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    UploadThing integration provides simple, secure file uploads with automatic optimization.
                  </p>

                  <h2 className="text-2xl font-semibold mt-8 mb-4">Using the Upload Component</h2>
                  
                  <div className="bg-gray-900 text-gray-300 p-4 rounded-lg mb-6 text-sm">
                    <code>{`import { UploadButton } from "@client/utils/uploadthing";

<UploadButton
  endpoint="imageUploader"
  onClientUploadComplete={(res) => {
    console.log("Files: ", res);
  }}
  onUploadError={(error) => {
    alert("Upload failed: " + error.message);
  }}
/>`}</code>
                  </div>

                  <h2 className="text-2xl font-semibold mt-8 mb-4">Features</h2>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">✓ Included</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Drag & drop support</li>
                        <li>• Progress indicators</li>
                        <li>• Image optimization</li>
                        <li>• Secure file storage</li>
                      </ul>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">File Types</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Images (JPG, PNG, GIF)</li>
                        <li>• Documents (PDF, DOCX)</li>
                        <li>• Videos (MP4, MOV)</li>
                        <li>• Custom types supported</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === "styling" && (
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  <h1 className="text-3xl font-bold mb-6">Styling with Tailwind CSS v4</h1>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    JonStack uses Tailwind CSS v4 with automatic dark mode support and custom components.
                  </p>

                  <h2 className="text-2xl font-semibold mt-8 mb-4">Dark Mode</h2>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Dark mode is automatically enabled based on system preferences. Use dark: prefix for dark mode styles.
                  </p>

                  <div className="bg-gray-900 text-gray-300 p-4 rounded-lg mb-6">
                    <code>{`<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
  Content adapts to theme
</div>`}</code>
                  </div>

                  <h2 className="text-2xl font-semibold mt-8 mb-4">Component Examples</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-3">Buttons</h4>
                      <div className="flex gap-3 flex-wrap">
                        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">Primary</button>
                        <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg">Secondary</button>
                        <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg">Outline</button>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-3">Form Elements</h4>
                      <input 
                        type="text" 
                        placeholder="Example input"
                        className="w-full max-w-md px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeSection === "deployment" && (
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  <h1 className="text-3xl font-bold mb-6">Deployment Guide</h1>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    JonStack is optimized for modern deployment platforms with zero configuration.
                  </p>

                  <h2 className="text-2xl font-semibold mt-8 mb-4">Vercel (Recommended)</h2>
                  
                  <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl mb-6">
                    <ol className="space-y-3 text-sm">
                      <li>1. Push your code to GitHub</li>
                      <li>2. Import project in Vercel dashboard</li>
                      <li>3. Add environment variables</li>
                      <li>4. Deploy! 🚀</li>
                    </ol>
                  </div>

                  <h2 className="text-2xl font-semibold mt-8 mb-4">Environment Variables</h2>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Add these to your deployment platform:
                  </p>

                  <div className="bg-gray-900 text-gray-300 p-4 rounded-lg text-sm">
                    <code>VITE_SUPABASE_URL</code><br/>
                    <code>VITE_SUPABASE_ANON_KEY</code><br/>
                    <code>DATABASE_URL</code><br/>
                    <code>UPLOADTHING_TOKEN</code>
                  </div>

                  <h2 className="text-2xl font-semibold mt-8 mb-4">Other Platforms</h2>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Netlify</h4>
                      <p className="text-sm">Full support with automatic builds</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Railway</h4>
                      <p className="text-sm">One-click deploy from GitHub</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Fly.io</h4>
                      <p className="text-sm">Global deployment with Docker</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Self-hosted</h4>
                      <p className="text-sm">Node.js 18+ required</p>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === "api-reference" && (
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  <h1 className="text-3xl font-bold mb-6">API Reference</h1>
                  
                  <h2 className="text-2xl font-semibold mt-8 mb-4">Database Queries</h2>
                  
                  <div className="bg-gray-900 text-gray-300 p-4 rounded-lg mb-6 text-sm">
                    <code>{`// Get all items for a user
const items = await db
  .select()
  .from(itemsTable)
  .where(eq(itemsTable.user_id, userId));

// Create new item
const [newItem] = await db
  .insert(itemsTable)
  .values({ name, user_id })
  .returning();

// Update item
await db
  .update(itemsTable)
  .set({ name: newName })
  .where(eq(itemsTable.id, id));

// Delete item
await db
  .delete(itemsTable)
  .where(eq(itemsTable.id, id));`}</code>
                  </div>

                  <h2 className="text-2xl font-semibold mt-8 mb-4">Route Handlers</h2>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    React Router v7 uses file-based routing with type-safe loaders and actions.
                  </p>

                  <div className="bg-gray-900 text-gray-300 p-4 rounded-lg text-sm">
                    <code>{`// Loader for data fetching
export async function loader({ request }: Route.LoaderArgs) {
  const user = await getUser(request);
  return { user };
}

// Action for mutations
export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  // Handle form submission
}`}</code>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 