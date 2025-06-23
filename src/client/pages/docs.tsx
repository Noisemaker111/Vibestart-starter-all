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

  // Track Tech Stack dropdown visibility
  const [techOpen, setTechOpen] = useState(false);

  // Leaf-level documentation sections (i.e. selectable pages)
  const leafSections = [
    { id: "zero-to-production", title: "Zero to Production", icon: "💯" },
    { id: "cursor-rules", title: "Cursor Rules", icon: "📐" },
    { id: "architecture", title: "Tech Stack Overview", icon: "🛠️" },
    { id: "database", title: "Database", icon: "💾" },
    { id: "authentication", title: "Authentication", icon: "🔐" },
    { id: "file-uploads", title: "File Uploads", icon: "📤" },
    { id: "deployment", title: "Deployment", icon: "🌐" },
    { id: "error", title: "Error Handling", icon: "❌" },
    { id: "analytics", title: "Analytics", icon: "📊" },
  ] as const;

  // Toggle states for instructions
  const [os, setOs] = useState<"windows" | "mac">("windows");
  const [target, setTarget] = useState<"web" | "mobile">("web");

  // Reusable markdown rules block with copy button
  const MarkdownRules = () => {
    const markdown = `## Persona and Role
- Act as a proactive software engineering expert, executing tasks directly with immediate visible results.
- Maintain continuous workflow until explicitly stopped.

## Tech Stack and Environment
- Use **TypeScript 5** everywhere.
- **React 19** with **React Router 7** SSR toolchain.
- **Vite 6** bundler/dev server (\`vite-tsconfig-paths\`).
- **Tailwind CSS 4** (\`@tailwindcss/vite\`).
- **Supabase** for Auth/UI (\`@supabase/auth-ui-react\`, \`@supabase/supabase-js\`).
- File uploads via **UploadThing React SDK** (\`@uploadthing/react\`) and Remix router backend.
- **Drizzle ORM 0.44** with PostgreSQL managed by \`drizzle-kit\` CLI.
- Runtime validation using **Zod** schemas at \`src/shared/schema.ts\`.
- \`dotenv\` for environment variables (\`src/server/db/index.ts\`).

## Coding Standards
- Variables in CamelCase, components in PascalCase, files in kebab-case, constants in UPPER_SNAKE.
- Modularize aggressively; immediately remove unused code.
- Enforce async-await, structured logs, exhaustive error handling, runtime validation via Zod.
- Optimize for performance and Core Web Vitals.
- Ensure a11y compliance (ARIA, contrast, keyboard navigation).
- Design for i18n/l10n readiness.
- Guarantee ≥ 90 % automated test coverage (unit, integration, e2e).

## Output Expectations
- Deliver complete, runnable code without placeholders or TODOs.
- Provide explicit, dependency-first task breakdowns.
- Assume an external dev server is running and trust existing \`.env\` files without verification.
- Communicate in concise, direct language; avoid metaphors, rhetorical questions, or filler.

## Best-Practice Principles
- Follow **SOLID, DRY, KISS, YAGNI, Principle of Least Astonishment**.
- Ensure explicit, comprehensive, consistent, traceable coding.
- Enforce secure defaults (CSP, XSS/CSRF protection, secure secret management, secure data handling, dependency scanning).
- Include observability hooks (metrics, tracing, alerts).
- List key tooling/library versions explicitly.
- Allow clarifying questions; forbid assumptions.

## Meta-Commands and Iteration
- Tasks ordered explicitly by dependencies.
- Clearly define subtasks for parallel execution by labeling separate agents without decimal subtasks (Agent 2, Agent 3, etc.).
- For each agent task, provide concise context, goals, and implementation details in its prompt.
- Assign tasks to agents only if unrelated or dependencies completed.
- Ignore overhead from external tooling or type-checking assumptions.`;

    const copyToClipboard = () => navigator.clipboard.writeText(markdown).catch(() => {});

    return (
      <div className="relative">
        <button
          onClick={copyToClipboard}
          className="absolute top-2 right-2 px-3 py-1 text-xs bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          Copy
        </button>
        <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto text-xs whitespace-pre-wrap">
          {markdown}
        </pre>
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex gap-8">
          {/* Sidebar Navigation */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Documentation</h3>
              <nav className="space-y-2">
                {/* Top-level items */}
                {leafSections.slice(0, 2).map((section) => (
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

                {/* Tech Stack (dropdown) */}
                <button
                  onClick={() => {
                    setTechOpen((o) => !o);
                    setActiveSection("architecture");
                  }}
                  className={`w-full text-left px-4 py-2 rounded-lg flex items-center gap-3 transition-all ${
                    activeSection === "architecture"
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className="text-lg">🛠️</span>
                  <span className="text-sm flex-1">Tech Stack</span>
                  <svg
                    className={`w-3 h-3 transition-transform ${techOpen ? 'rotate-90' : ''}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M6 6L14 10L6 14V6Z" />
                  </svg>
                </button>

                {techOpen && (
                  <div className="pl-4 space-y-2">
                    {leafSections
                      .filter((s) =>
                        [
                          'database',
                          'authentication',
                          'file-uploads',
                          'deployment',
                          'error',
                          'analytics',
                        ].includes(s.id)
                      )
                      .map((section) => (
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
                  </div>
                )}
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
                {leafSections.map((section) => (
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
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl mb-8">
                    <h2 className="text-lg font-semibold mb-3">What You'll Build</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      By the end of this guide, you'll have a complete web application with:
                    </p>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      <li>• User authentication (login with Google/GitHub)</li>
                      <li>• Database to store your app's data</li>
                      <li>• File upload capabilities</li>
                      <li>• Live on the internet for anyone to use</li>
                      <li>• AI-powered development environment to extend your app</li>
                    </ul>

                  </div>
                  
                  <div className="space-y-12">
                    {/* Step 1 */}
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 flex items-center justify-center bg-blue-600 text-white rounded-full font-bold shrink-0">1</div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">Install Developer Tools</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          These tools form your development foundation. Think of them as your digital workshop.
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-sm">
                          {os === "windows" ? (
                            <>
                              <li><strong>Node.js 18+</strong> – <a className="text-blue-600 dark:text-blue-400 underline" href="https://nodejs.org/en/download" target="_blank">Download</a> & run installer
                                <br/><span className="text-gray-500 text-xs">The runtime that powers your web app backend</span>
                              </li>
                              <li><strong>Git 2.50+</strong> – <a className="text-blue-600 dark:text-blue-400 underline" href="https://git-scm.com/downloads" target="_blank">Download</a> & run installer
                                <br/><span className="text-gray-500 text-xs">Version control system to track your code changes</span>
                              </li>
                            </>
                          ) : (
                            <>
                              <li><strong>Node.js 18+</strong> – <a className="text-blue-600 dark:text-blue-400 underline" href="https://nodejs.org/en/download" target="_blank">Download</a> & run installer
                                <br/><span className="text-gray-500 text-xs">The runtime that powers your web app backend</span>
                              </li>
                              <li><strong>Git 2.50+</strong> – <a className="text-blue-600 dark:text-blue-400 underline" href="https://git-scm.com/downloads" target="_blank">Download</a> & run installer
                                <br/><span className="text-gray-500 text-xs">Version control system to track your code changes</span>
                              </li>
                            </>
                          )}
                          <li><strong>Cursor IDE</strong> – <a className="text-blue-600 dark:text-blue-400 underline" href="https://www.cursor.com/" target="_blank">Sign up</a> & install
                            <br/><span className="text-gray-500 text-xs">AI-powered code editor that writes code with you, not for you</span>
                          </li>
                        </ul>
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 flex items-center justify-center bg-blue-600 text-white rounded-full font-bold shrink-0">2</div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">Create Your Digital Infrastructure</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          These services work together to power your web app. Each one handles a specific piece of the puzzle.
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-sm">
                          <li><strong>GitHub</strong> – <a className="text-blue-600 dark:text-blue-400 underline" href="https://github.com/signup" target="_blank">Sign up</a>
                            <br/><span className="text-gray-500 text-xs">Code storage & collaboration hub (also enables login via GitHub)</span>
                          </li>
                          <li><strong>Vercel</strong> – <a className="text-blue-600 dark:text-blue-400 underline" href="https://vercel.com/signup" target="_blank">Sign up</a>
                            <br/><span className="text-gray-500 text-xs">Global hosting platform that makes your app accessible worldwide</span>
                          </li>
                          <li><strong>Supabase</strong> – <a className="text-blue-600 dark:text-blue-400 underline" href="https://supabase.com/dashboard/sign-up " target="_blank">Sign up</a>
                            <br/><span className="text-gray-500 text-xs">Database & user authentication system (handles login/signup)</span>
                          </li>
                          <li><strong>UploadThing</strong> – <a className="text-blue-600 dark:text-blue-400 underline" href="https://uploadthing.com/ " target="_blank">Sign up</a>
                            <br/><span className="text-gray-500 text-xs">File storage service for images, documents, and media uploads</span>
                          </li>
                        </ul>
                      </div>
                    </div>

                    {/* Step 3 */}
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 flex items-center justify-center bg-blue-600 text-white rounded-full font-bold shrink-0">3</div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2">Get the JonStack Template</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                          {os === "windows" ? "Open PowerShell (search for 'PowerShell' in Start menu) and run these commands one by one:" : "Open Terminal and run these commands:"}
                        </p>
                        <div className="bg-gray-900 text-gray-300 p-4 rounded-lg overflow-x-auto text-sm">
                          <code>git clone https://github.com/Noisemaker111/jonstack.git my-app</code><br/>
                          <code>cd my-app</code><br/>
                          <code>npm install</code>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                          This downloads the JonStack template and installs all required packages
                        </p>
                      </div>
                    </div>

                    {/* Step 4 */}
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 flex items-center justify-center bg-blue-600 text-white rounded-full font-bold shrink-0">4</div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2">Connect Your Services</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                          Environment variables are like secret keys that let your app talk to external services. 
                          Think of them as API keys that unlock features in your app.
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                          Duplicate <code>.env.example</code> → <code>.env.local</code> and fill the values by following the steps below:
                        </p>

                        <ol className="list-decimal list-inside space-y-4 text-sm mb-4">
                          <li>
                            <strong>Supabase Database Setup</strong>:
                            <ul className="list-disc pl-4 mt-2 space-y-1">
                              <li>Go to <a className="text-blue-600 dark:text-blue-400 underline" href="https://supabase.com/dashboard" target="_blank">your Supabase dashboard</a></li>
                              <li>Click "New project" → enter any name → select a region → set a password → click "Create new project"</li>
                              <li>Wait for setup to complete</li>
                              <li>Go to <em>Project Settings → API</em>, copy <code>Project URL</code> & <code>anon public key</code></li>
                              <li>Go to <em>Authentication → Providers</em> and enable <code>Google</code> and <code>GitHub</code></li>
                            </ul>
                            <span className="text-gray-500 text-xs">This creates your database and enables user login</span>
                          </li>
                          <li>
                            <strong>UploadThing Token</strong>:
                            <ul className="list-disc pl-4 mt-2 space-y-1">
                              <li>Go to <a className="text-blue-600 dark:text-blue-400 underline" href="https://uploadthing.com/dashboard" target="_blank">UploadThing dashboard</a></li>
                              <li>Click "Create a new app" → enter any name → click "Create"</li>
                              <li>Go to "API Keys" tab → copy the "Secret Key"</li>
                            </ul>
                            <span className="text-gray-500 text-xs">This enables file uploads in your app</span>
                          </li>
                          <li>
                            <strong>Create Environment File</strong>:
                            <ul className="list-disc pl-4 mt-2 space-y-1">
                              <li>In Cursor, duplicate <code>.env.example</code> and rename it to <code>.env.local</code></li>
                              <li>Replace the placeholder values with your actual keys from above</li>
                            </ul>
                          </li>
                        </ol>

                        <div className="bg-gray-900 text-gray-300 p-4 rounded-lg text-sm overflow-x-auto">
                          {`# Supabase - connects your app to database & auth
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_from_supabase

# Database - use your Supabase connection string
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-ID].supabase.co:5432/postgres

# UploadThing - enables file uploads  
UPLOADTHING_TOKEN=your_secret_key_from_uploadthing`}
                        </div>
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg mt-4">
                          <p className="text-sm text-yellow-800 dark:text-yellow-200">
                            <strong>⚠️ Important:</strong> For the DATABASE_URL, go to your Supabase project → Settings → Database → Connection string → URI, copy it and replace [YOUR-PASSWORD] with your actual password.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Step 5 */}
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 flex items-center justify-center bg-blue-600 text-white rounded-full font-bold shrink-0">5</div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2">Start Your App</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                          {os === "windows" ? "In your PowerShell window (still in the my-app folder), run:" : "In your terminal, run:"}
                        </p>
                        <div className="bg-gray-900 text-gray-300 p-4 rounded-lg text-sm">
                          <code>npm run db:migrate</code><br/>
                          <code>npm run dev</code>
                        </div>
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mt-4">
                          <p className="text-sm text-blue-800 dark:text-blue-200">
                            <strong>✅ Success looks like:</strong>
                          </p>
                          <ul className="text-sm text-blue-700 dark:text-blue-300 mt-2 space-y-1">
                            <li>• First command creates your database tables</li>
                            <li>• Second command starts your development server</li>
                            <li>• You'll see "Local: http://localhost:5173" in the terminal</li>
                            <li>• Browser opens automatically to your running app</li>
                          </ul>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                          If browser doesn't open automatically: <a className="underline text-blue-600 dark:text-blue-400" href="http://localhost:5173" target="_blank">http://localhost:5173</a>
                        </p>
                      </div>
                    </div>

                    {/* Step 6 */}
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 flex items-center justify-center bg-blue-600 text-white rounded-full font-bold shrink-0">6</div>
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
                  
                  {/* Troubleshooting Section */}
                  <div className="mt-12 p-6 bg-red-50 dark:bg-red-900/20 rounded-xl">
                    <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-4">🚨 Common Issues & Fixes</h3>
                    <div className="space-y-3 text-sm">
                      <div>
                        <strong className="text-red-700 dark:text-red-300">Error: "command not found" or "not recognized"</strong>
                        <p className="text-red-600 dark:text-red-400">Solution: Restart your computer after installing Node.js and Git, then try again.</p>
                      </div>
                      <div>
                        <strong className="text-red-700 dark:text-red-300">Error: "ECONNREFUSED" or database connection issues</strong>
                        <p className="text-red-600 dark:text-red-400">Solution: Double-check your DATABASE_URL in .env.local matches exactly what's in Supabase Settings → Database → Connection string.</p>
                      </div>
                      <div>
                        <strong className="text-red-700 dark:text-red-300">Error: "Port 5173 is already in use"</strong>
                        <p className="text-red-600 dark:text-red-400">Solution: Close any other terminal windows running <code>npm run dev</code> or restart your computer.</p>
                      </div>
                      <div>
                        <strong className="text-red-700 dark:text-red-300">App loads but login doesn't work</strong>
                        <p className="text-red-600 dark:text-red-400">Solution: Make sure you enabled Google and GitHub providers in Supabase Authentication → Providers.</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 p-6 bg-green-50 dark:bg-green-900/20 rounded-xl text-center">
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
{`jonstack/
├── src/
│   ├── client/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── utils/
│   ├── server/
│   │   ├── db/
│   │   │   ├── queries/
│   │   │   └── schema.ts
│   │   ├── utils/
│   │   ├── ideas.ts
│   │   ├── vote.ts
│   │   └── uploadthing.ts
│   ├── shared/
│   │   ├── supabase.ts
│   │   └── constants.ts
├── public/
├── package.json
├── tailwind.config.js
├── vite.config.ts
└── README.md`}
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

              {activeSection === "cursor-rules" && (
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  <h1 className="text-3xl font-bold mb-6">Cursor Rules</h1>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Recommended best-practices when working inside the Cursor IDE.
                  </p>
                  <MarkdownRules />
                </div>
              )}

              {activeSection === "error" && (
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  <h1 className="text-3xl font-bold mb-6">Error Handling (Boilerplate)</h1>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Comprehensive error-handling documentation is coming soon. In the meantime, follow these guidelines:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-sm">
                    <li>Wrap async operations in <code>try/catch</code> blocks.</li>
                    <li>Return typed error responses from loaders and actions.</li>
                    <li>Surface user-friendly messages in the UI.</li>
                    <li>Log errors to the console in development and to your observability platform in production.</li>
                  </ul>
                </div>
              )}

              {activeSection === "analytics" && (
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  <h1 className="text-3xl font-bold mb-6">Analytics (Boilerplate)</h1>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Analytics integration docs will live here.
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-sm">
                    <li>Pick a provider (e.g. Plausible, PostHog, Google Analytics).</li>
                    <li>Add the provider's script tag in <code>root.tsx</code>.</li>
                    <li>Send custom events from client-side interactions.</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 