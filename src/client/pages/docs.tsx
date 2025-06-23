import { useState } from "react";
import type { Route } from "./+types/docs";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Documentation - JonStack" },
    { name: "description", content: "Complete guide to using JonStack" },
  ];
}

export default function Docs() {
  const [activeSection, setActiveSection] = useState("zero-to-production");

  const sections = [
    { id: "zero-to-production", title: "Zero to Production", icon: "💯" },
    { id: "architecture", title: "Architecture", icon: "🏗️" },
    { id: "authentication", title: "Authentication", icon: "🔐" },
    { id: "database", title: "Database", icon: "💾" },
    { id: "file-uploads", title: "File Uploads", icon: "📤" },
    { id: "styling", title: "Styling", icon: "🎨" },
    { id: "deployment", title: "Deployment", icon: "🌐" },
    { id: "api-reference", title: "API Reference", icon: "📚" },
    { id: "why-jonstack", title: "Why JonStack?", icon: "🌟" },
  ];

  // Toggle states for instructions
  const [os, setOs] = useState<"windows" | "mac">("windows");
  const [target, setTarget] = useState<"web" | "mobile">("web");

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
              {activeSection === "zero-to-production" && (
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  <h1 className="text-3xl font-bold mb-6">Zero to Production</h1>
                  
                  {/* Toggles */}
                  <div className="flex flex-wrap items-center gap-6 mb-10">
                    {/* OS Switch */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">OS:</span>
                      {([
                        { id: "windows", label: "Windows" },
                        { id: "mac", label: "macOS" },
                      ] as const).map(({ id, label }) => (
                        <button
                          key={id}
                          onClick={() => setOs(id)}
                          className={`px-4 py-1 rounded-full text-sm font-medium transition-colors ${
                            os === id ? "bg-blue-600 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>

                    {/* Target Switch */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Target:</span>
                      {([
                        { id: "web", label: "Web", disabled: false },
                        { id: "mobile", label: "Mobile (coming soon)", disabled: true },
                      ] as const).map(({ id, label, disabled }) => (
                        <button
                          key={id}
                          onClick={() => !disabled && setTarget(id as any)}
                          disabled={disabled}
                          className={`px-4 py-1 rounded-full text-sm font-medium transition-colors ${
                            target === id ? "bg-blue-600 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"}
                            ${disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-300 dark:hover:bg-gray-600"}`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* ZERO-TO-HERO GUIDE */}
                  <div className="space-y-12">
                    {/* Step 0 */}
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 flex items-center justify-center bg-blue-600 text-white rounded-full font-bold shrink-0">0</div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">Install Tools</h3>
                        <ul className="list-disc pl-6 space-y-1 text-sm">
                          {os === "windows" ? (
                            <>
                              <li>Node.js 18+ – <a className="text-blue-600 dark:text-blue-400 underline" href="https://nodejs.org/dist/v22.16.0/node-v22.16.0-x64.msi" target="_blank">Download</a> & run installer</li>
                              <li>Git 2.50+ – <a className="text-blue-600 dark:text-blue-400 underline" href="https://git-scm.com/downloads/win" target="_blank">Download</a> & run installer</li>
                            </>
                          ) : (
                            <>
                              <li>Node.js 18+ – install via <code>brew install node</code></li>
                              <li>Git – pre-installed on most macOS versions (or <code>brew install git</code>)</li>
                            </>
                          )}
                          <li><a className="text-blue-600 dark:text-blue-400 underline" href="#" target="_blank">Cursor IDE</a> – sign up & install</li>
                        </ul>
                      </div>
                    </div>

                    {/* Step 1 */}
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 flex items-center justify-center bg-blue-600 text-white rounded-full font-bold shrink-0">1</div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">Create Accounts</h3>
                        <ul className="list-disc pl-6 space-y-1 text-sm">
                          <li><a className="text-blue-600 dark:text-blue-400 underline" href="https://github.com/signup" target="_blank">GitHub</a> – repository & OAuth</li>
                          <li><a className="text-blue-600 dark:text-blue-400 underline" href="https://vercel.com/signup" target="_blank">Vercel</a> – hosting platform</li>
                          <li><a className="text-blue-600 dark:text-blue-400 underline" href="https://supabase.com/dashboard/sign-up " target="_blank">Supabase</a> – database & auth</li>
                          <li><a className="text-blue-600 dark:text-blue-400 underline" href="https://uploadthing.com/ " target="_blank">UploadThing</a> – file uploads</li>
                        </ul>
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 flex items-center justify-center bg-blue-600 text-white rounded-full font-bold shrink-0">2</div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2">Clone &amp; Install</h3>
                        <div className="bg-gray-900 text-gray-300 p-4 rounded-lg overflow-x-auto text-sm">
                          <code>git clone https://github.com/yourusername/jonstack.git my-app</code><br/>
                          <code>cd my-app</code><br/>
                          <code>npm install</code>
                        </div>
                      </div>
                    </div>

                    {/* Step 3 */}
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 flex items-center justify-center bg-blue-600 text-white rounded-full font-bold shrink-0">3</div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2">Configure Environment&nbsp;Variables</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Duplicate <code>.env.example</code> → <code>.env.local</code> and fill the values by following the steps below:</p>

                        <ol className="list-decimal list-inside space-y-2 text-sm mb-4">
                          <li>
                            <strong>Supabase</strong>: In your project, go to <em>Project&nbsp;Settings → API</em>, copy <code>Project URL</code> & <code>anon key</code>. Then open <em>Authentication → Providers</em> and enable <code>Google</code> and <code>GitHub</code>.
                          </li>
                          <li>
                            <strong>UploadThing</strong>: From the dashboard, generate a token and copy it.
                          </li>
                          <li>
                            Paste the values into the env file as shown below.
                          </li>
                        </ol>

                        <div className="bg-gray-900 text-gray-300 p-4 rounded-lg text-sm overflow-x-auto">
                          {`# Supabase
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Database (local dev)
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# UploadThing
UPLOADTHING_TOKEN=your_uploadthing_token`}
                        </div>
                      </div>
                    </div>

                    {/* Step 4 */}
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 flex items-center justify-center bg-blue-600 text-white rounded-full font-bold shrink-0">4</div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2">Run Locally</h3>
                        <div className="bg-gray-900 text-gray-300 p-4 rounded-lg text-sm">
                          <code>npm run db:migrate</code><br/>
                          <code>npm run dev</code>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Open <a className="underline" href="http://localhost:5173" target="_blank">http://localhost:5173</a></p>
                      </div>
                    </div>

                    {/* Step 5 */}
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 flex items-center justify-center bg-blue-600 text-white rounded-full font-bold shrink-0">5</div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2">Deploy to Vercel</h3>
                        <ol className="list-decimal list-inside space-y-1 text-sm">
                          <li>Push code to GitHub</li>
                          <li>Import project in Vercel dashboard</li>
                          <li>Add env vars from <code>.env.local</code></li>
                          <li>Click <strong>Deploy</strong> 🚀</li>
                        </ol>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-12 p-6 bg-green-50 dark:bg-green-900/20 rounded-xl text-center">
                    <p className="text-lg font-semibold text-green-700 dark:text-green-300">
                      🎉 Zero-to-Hero complete! Your app is live locally and one click away from production.
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

              {activeSection === "why-jonstack" && (
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  <h1 className="text-3xl font-bold mb-6">Why choose JonStack?</h1>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Stacks like <strong>T3</strong> and <strong>T4</strong> are engineered for developers who already know what they're doing. JonStack puts <strong>AI-first workflows</strong> front-and-centre so that <em>ideas</em>, not config files, move your project forward.
                  </p>

                  <h2 className="text-2xl font-semibold mt-8 mb-4">At a glance</h2>
                  <table>
                    <thead>
                      <tr>
                        <th>Feature</th>
                        <th>JonStack</th>
                        <th>T3 / T4</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Target audience</td>
                        <td>New-age makers &amp; nocode-to-code learners</td>
                        <td>Seasoned engineers</td>
                      </tr>
                      <tr>
                        <td>Setup time</td>
                        <td>&lt; 1&nbsp;minute</td>
                        <td>5-30&nbsp;minutes</td>
                      </tr>
                      <tr>
                        <td>Prototype ready</td>
                        <td>&lt; 1&nbsp;hour (no prior HTML/CSS/JS expertise)</td>
                        <td>Days–Weeks of boilerplate & learning curve</td>
                      </tr>
                      <tr>
                        <td>AI IDE rules</td>
                        <td>Built-in, opinionated</td>
                        <td>External / DIY</td>
                      </tr>
                      <tr>
                        <td>Boilerplate</td>
                        <td>Zero-config, deploy-ready</td>
                        <td>CLI scaffolding + manual wiring</td>
                      </tr>
                    </tbody>
                  </table>

                  <h2 className="text-2xl font-semibold mt-8 mb-4">Status</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    JonStack is currently in <strong>public preview</strong>. We're actively building the AI IDE rule engine, deployment flows, and more. Expect breaking changes until v1.0.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 