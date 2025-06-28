import { useState } from "react";
import { useLocation } from "react-router";
import type { Route } from "./+types/docs";
import CursorProjectRule from "@client/components/CursorProjectRule";
import type { AvailablePlatform as Platform } from "@shared/availablePlatforms";

// ─────────────────────────────────────────────────────────────────────────────
// Cursor auxiliary data (project rule & memories)
// ─────────────────────────────────────────────────────────────────────────────


type Memory = { id: string; text: string };

const memoriesList: Memory[] = [
  {
    id: "1785701241297335362",
    text:
      "When creating new API endpoints or pages, always remember to add corresponding entries to src/client/routes.ts so routes are registered.",
  },
  {
    id: "1939287265809468720",
    text:
      "Always update @project-structure.mdc after any filesystem change; considered extremely important by the user.",
  },
  {
    id: "5445089380744046776",
    text: "User prefers not to use emojis in UI labels/headings (e.g., section summaries).",
  },
  {
    id: "1537003352931863746",
    text:
      "User prefers CursorDev to automatically execute database sync/migration commands after schema changes; they do not want to run those commands themselves.",
  },
  {
    id: "1622624613781621413",
    text:
      "Drizzle CLI workflow: • Generate migrations: `npx drizzle-kit generate` • Apply migrations: `npx drizzle-kit migrate` • Push schema to DB: `npx drizzle-kit push` • Pull schema from DB: `npx drizzle-kit pull` • GUI studio: `npx drizzle-kit studio` • Consistency check: `npx drizzle-kit check` • Upgrade snapshots: `npx drizzle-kit up` Flags like `--config=<file>` can specify an alternate config for multi-env setups.",
  },
];

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Documentation - VibeStart" },
    { name: "description", content: "Complete guide to using VibeStart" },
  ];
}

export default function Docs() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const ideaParam = searchParams.get("idea") ?? "";
  const projectParam = searchParams.get("project") ?? "";
  const osParam = searchParams.get("os") ?? "";
  type Target = Platform;

  const [target, setTarget] = useState<Target>("web");

  const megaPrompt = ideaParam
    ? `alter the current template to help create this idea, understand the current codebase and make changes and alter the connections, tables, functions, namings all to my project's idea. target platform=${target}. dev os=${osParam}. create a github repo called "${projectParam}". then <user_idea_start>${ideaParam}<user_idea_end>`
    : "";

  const [megaCopySuccess, setMegaCopySuccess] = useState(false);
  function copyMegaPrompt() {
    if (!megaPrompt) return;
    navigator.clipboard.writeText(megaPrompt).then(() => {
      setMegaCopySuccess(true);
      setTimeout(() => setMegaCopySuccess(false), 2000);
    }).catch(() => {});
  }

  const [activeSection, setActiveSection] = useState("zero-to-100");

  // Track Tech Stack dropdown visibility
  const [techOpen, setTechOpen] = useState(false);

  // Dropdown for Cursor integration (User Rules, Project Rules, Memories)
  const [cursorOpen, setCursorOpen] = useState(false);

  // ─────────────────────────────────────────────────────────────────────
  // Troubleshooting state & data
  // ─────────────────────────────────────────────────────────────────────
  const [issueQuery, setIssueQuery] = useState("");

  const commonIssues = [
    {
      id: 1,
      title: 'Error: "command not found" or "not recognized"',
      solution: "Restart your computer after installing Node.js and Git, then try again.",
    },
    {
      id: 2,
      title: 'Error: "ECONNREFUSED" or database connection issues',
      solution:
        "Double-check your DATABASE_URL in .env.local matches exactly what's in Supabase Settings → Database → Connection string.",
    },
    {
      id: 3,
      title: 'Error: "Port 5173 is already in use"',
      solution: "Close any other terminal windows running `npm run dev` or restart your computer.",
    },
    {
      id: 4,
      title: 'App loads but login does not work',
      solution: "Make sure you enabled Google and GitHub providers in Supabase Authentication → Providers.",
    },
  ] as const;

  const filteredIssues = commonIssues.filter(
    (issue) =>
      issue.title.toLowerCase().includes(issueQuery.toLowerCase()) ||
      issue.solution.toLowerCase().includes(issueQuery.toLowerCase())
  );

  // Leaf-level documentation sections (i.e. selectable pages)
  const leafSections = [
    { id: "zero-to-100", title: "Zero to Full-Stack App" },
    { id: "cursor-rules", title: "User Rules" },
    { id: "project-rules", title: "Project Rules" },
    { id: "memories", title: "Memories" },
    { id: "architecture", title: "Tech Stack Overview" },
    { id: "database", title: "Database" },
    { id: "authentication", title: "Authentication" },
    { id: "file-uploads", title: "File Uploads" },
    { id: "deployment", title: "Deployment" },
    { id: "error", title: "Troubleshooting" },
    { id: "analytics", title: "Analytics" },
    { id: "roadmap", title: "Roadmap" },
  ] as const;

  // Toggle states for instructions
  const [os, setOs] = useState<"windows" | "mac" | "linux">("windows");

  const CursorAiUserRules = () => {
    const markdown = `You are CursorDev, an AI assistant powered by the o3 model. Your role is to act as the user's proactive lead software engineer and project manager, switching between expert frontend and backend roles as tasks demand.

Persona and principles:
Act continuously, producing visible results until told to stop. Always apply SOLID (Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion), DRY, KISS, YAGNI, and the Principle of Least Astonishment. Code must remain explicit, comprehensive, consistent and fully traceable.

Technology stack and environment:
All work occurs in TypeScript 5 with React 19 and React Router 7 in an SSR setup powered by Vite 6 and vite-tsconfig-paths. Styling uses Tailwind CSS 4 via @tailwindcss/vite. The backend relies on Supabase with @supabase/auth-ui-react and @supabase/supabase-js. File uploads use UploadThing with the @uploadthing/react SDK. Database access is through Drizzle ORM 0.44 on PostgreSQL, with migrations handled by drizzle-kit. Runtime validation uses Zod with centralized schemas at src/shared/schema.ts. Environment variables load through dotenv. Assume an external dev server is running and all .env files are configured.

Development standards and practices:
Follow camelCase for variables and functions, PascalCase for components and types, kebab-case for filenames and directories, and UPPER_SNAKE_CASE for constants. Modularize aggressively, deleting unused code immediately. Employ async/await exclusively for asynchronous flows. Implement exhaustive error handling, enforce Zod validation at every API boundary, set secure defaults including CSP and CSRF/XSS protection, scan dependencies, and manage secrets safely. Optimize for Core Web Vitals, guarantee full ARIA compliance, design for i18n, maintain at least ninety percent automated test coverage across unit, integration and E2E suites, and expose metrics, tracing and alerts for observability.

Agent workflow and task execution:
Break every assignment into explicit dependency-first steps. Name execution blocks 'Agent 1', 'Agent 2', etc. An agent may begin only when all of its dependencies are satisfied by previous agents; unrelated streams may run in parallel. The agent that performs any filesystem mutation must finish its own block by emitting the updated file tree; this responsibility may never be deferred to a later agent because the current agent holds the full context of the change. Conclude each agent block with complete, runnable code—never placeholders such as // TODO.

Output format:
For each response, create distinct agent sections headed by a logical domain title, followed by a concise goal line and a series of imperative actions. After any change to files or directories, immediately output the updated project tree in .cursor/rules/project-structure.mdc. Keep language direct and free from metaphors, rhetorical questions or filler. The tree must appear as the final element of the same agent's block that made the change.`;

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
                {/* Top-level quick start */}
                {leafSections
                  .filter((s) => s.id === "zero-to-100")
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
                      <span className="text-sm">{section.title}</span>
                    </button>
                  ))}

                {/* Cursor Integration (dropdown) */}
                <button
                  onClick={() => {
                    setCursorOpen((o) => !o);
                    setActiveSection("cursor-rules");
                  }}
                  className={`w-full text-left px-4 py-2 rounded-lg flex items-center gap-3 transition-all ${
                    (['cursor-rules','project-rules','memories'] as string[]).includes(activeSection as string)
                      ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 font-medium'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className="text-sm flex-1">Cursor Integration</span>
                  <svg
                    className={`w-3 h-3 transition-transform ${cursorOpen ? 'rotate-90' : ''}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M6 6L14 10L6 14V6Z" />
                  </svg>
                </button>

                {cursorOpen && (
                  <div className="pl-4 space-y-2">
                    {leafSections
                      .filter((s) => (['cursor-rules','project-rules','memories'] as string[]).includes(s.id))
                      .map((section) => (
                        <button
                          key={section.id}
                          onClick={() => setActiveSection(section.id)}
                          className={`w-full text-left px-4 py-2 rounded-lg flex items-center gap-3 transition-all ${
                            activeSection === section.id
                              ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 font-medium'
                              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                          }`}
                        >
                          <span className="text-sm">{section.title}</span>
                        </button>
                      ))}
                  </div>
                )}

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
                          <span className="text-sm">{section.title}</span>
                        </button>
                      ))}
                  </div>
                )}

                {/* Troubleshooting top-level nav (moved below Tech Stack) */}
                <button
                  onClick={() => setActiveSection("error")}
                  className={`w-full text-left px-4 py-2 rounded-lg flex items-center gap-3 transition-all ${
                    activeSection === "error"
                      ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-medium'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className="text-sm">Troubleshooting</span>
                </button>
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
                    {section.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Documentation Content */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
              {activeSection === "zero-to-100" && (
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  <h1 className="text-3xl font-bold mb-6">Zero to Full-Stack App</h1>
                  
                  {/* Toggles */}
                  <div className="flex flex-wrap items-center gap-6 mb-10">
                    {/* OS Switch */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">OS:</span>
                      {([
                        { id: "windows", label: "Windows", disabled: false },
                        { id: "mac", label: "macOS", disabled: true },
                        { id: "linux", label: "Linux", disabled: true },
                      ] as const).map(({ id, label, disabled }) => (
                        <div key={id} className="relative inline-block">
                          <button
                            onClick={() => !disabled && setOs(id as any)}
                            disabled={disabled}
                            className={`px-4 py-1 rounded-full text-sm font-medium transition-colors ${
                              os === id ? "bg-blue-600 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"}
                              ${disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-300 dark:hover:bg-gray-600"}`}
                          >
                            {label}
                          </button>
                          {disabled && (
                            <span className="absolute -top-1 -right-1 bg-gray-700 text-gray-200 text-[10px] px-1 rounded-md">soon</span>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Target Switch */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Target:</span>
                      {([
                        { id: "web", label: "Web", disabled: false },
                        { id: "mobile", label: "Mobile", disabled: true },
                        { id: "desktop", label: "Desktop", disabled: true },
                        { id: "game", label: "Game", disabled: true },
                        { id: "discord", label: "Discord Bot", disabled: true },
                        { id: "telegram", label: "Telegram Bot", disabled: true },
                        { id: "extension", label: "Browser Extension", disabled: true },
                        { id: "vscode", label: "VS Code Extension", disabled: true },
                        { id: "slack", label: "Slack App", disabled: true },
                        { id: "cli", label: "CLI Tool", disabled: true },
                        { id: "watch", label: "Smart-watch App", disabled: true },
                        { id: "arvr", label: "AR/VR", disabled: true },
                      ] as const).map(({ id, label, disabled }) => (
                        <div key={id} className="relative inline-block">
                          <button
                            onClick={() => !disabled && setTarget(id as Target)}
                            disabled={disabled}
                            className={`px-4 py-1 rounded-full text-sm font-medium transition-colors ${
                              target === id ? "bg-blue-600 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"}
                              ${disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-300 dark:hover:bg-gray-600"}`}
                          >
                            {label}
                          </button>
                          {disabled && (
                            <span className="absolute -top-1 -right-1 bg-gray-700 text-gray-200 text-[10px] px-1 rounded-md">soon</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* ZERO TO FULL-STACK GUIDE */}
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
                              <li>Still in <em>Authentication</em>, open <em>URL&nbsp;Configuration</em> and add each of these to <strong>Redirect&nbsp;URLs</strong> (press <span className="underline">Add</span> after each one):<br/>
                                • <code>http://localhost:5173</code> &nbsp;(development)<br/>
                                • <code>https://your-production-domain.com</code> &nbsp;(replace later with your Vercel URL)
                              </li>
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
UPLOADTHING_TOKEN=your_secret_key_from_uploadthing

# Domain & OAuth redirects  
VITE_SITE_URL=http://localhost:5173  
VITE_SUPABASE_REDIRECT=http://localhost:5173`}
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
                            <strong>Success looks like:</strong>
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
                          <li>Push your code to a new <strong>GitHub</strong> repository (<code>git init</code> → <code>git add . && git commit</code> → <code>git remote add origin</code> → <code>git push -u origin master</code>)</li>
                          <li>In the <strong>Vercel</strong> dashboard click <em>New&nbsp;Project</em> → import the repository you just pushed</li>
                          <li>When prompted for <em>Environment&nbsp;Variables</em> paste <strong>all</strong> keys from <code>.env.local</code>: <code>VITE_SUPABASE_URL</code>, <code>VITE_SUPABASE_ANON_KEY</code>, <code>DATABASE_URL</code>, <code>UPLOADTHING_TOKEN</code>, <code>VITE_SITE_URL</code>, <code>VITE_SUPABASE_REDIRECT</code></li>
                          <li>Leave the detected build settings as-is (Vite → <code>npm run build</code>; output dir <code>dist</code>) and click <strong>Deploy</strong> 🚀</li>
                          <li>After the first deploy completes copy your new live URL (e.g.&nbsp;<code>https://my-app.vercel.app</code>).<br/>Return to Supabase → <em>Authentication&nbsp;→&nbsp;URL&nbsp;Configuration</em> and add it to Redirect&nbsp;URLs, then update <code>VITE_SITE_URL</code>/<code>VITE_SUPABASE_REDIRECT</code> on Vercel and redeploy.</li>
                        </ol>
                      </div>
                    </div>
                  </div>
                  
                  {/* Troubleshooting Section */}
                  <div className="mt-12 p-6 bg-red-50 dark:bg-red-900/20 rounded-xl">
                    <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-4">Common Issues & Fixes</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      For a complete list of issues and fixes, see the
                      <button
                        onClick={() => setActiveSection("error")}
                        className="text-blue-600 dark:text-blue-400 underline ml-1"
                      >
                        Troubleshooting&nbsp;page
                      </button>.
                    </p>
                  </div>

                  <div className="mt-8 p-6 bg-green-50 dark:bg-green-900/20 rounded-xl text-center">
                    <p className="text-lg font-semibold text-green-700 dark:text-green-300">
                      Zero-to-Full-Stack App complete! Your app is live locally and one click away from production.
                    </p>
                  </div>

                  {/* AI Mega Prompt (shown after user submits idea) */}
                  {ideaParam && (
                    <div id="mega-prompt" className="mt-12 p-6 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-200">AI Mega Prompt</h3>
                        <button
                          onClick={copyMegaPrompt}
                          className="text-xs px-2 py-1 rounded border border-purple-300 dark:border-purple-600 hover:bg-purple-100 dark:hover:bg-purple-800"
                        >{megaCopySuccess ? "Copied" : "Copy"}</button>
                      </div>
                      <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto text-xs whitespace-pre-wrap">
                        {megaPrompt}
                      </pre>
                    </div>
                  )}
                </div>
              )}

              {activeSection === "architecture" && (
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  <h1 className="text-3xl font-bold mb-6">Architecture Overview</h1>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    JonStack enforces a single, opinionated path from IDE to production so you can focus on ideas, not glue code. Today the stack covers <strong>web applications</strong>. Mobile and desktop targets are on the roadmap and will reuse the same API layer, database and auth primitives.
                  </p>

                  <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl mb-8">
                    <h3 className="text-lg font-semibold mb-4">Project Structure</h3>
                    <pre className="text-sm overflow-x-auto">
{`jonstack/
├── src/
│   ├── client/
│   │   ├── components/        React UI elements
│   │   │   ├── CreateOrganizationButton.tsx   Button + modal to create orgs
│   │   │   ├── SignInButton.tsx              Log In / Log Out button with modal
│   │   │   └── SquareUploadButton.tsx        Square image upload component (no inline preview)
│   │   ├── context/           React contexts & providers
│   │   ├── pages/             Route components
│   │   └── utils/             Client-side helpers
│   ├── server/
│   │   ├── db/
│   │   │   ├── queries/       Query helpers
│   │   │   └── schema.ts      Schema for the entire database of the project (add, alter tables — now includes organizations & profiles table)
│   │   ├── utils/             Server helpers
│   │   └── uploadthing.ts     Upload handlers
│   ├── shared/
│   │   ├── supabase.ts        Shared Supabase init
│   │   └── constants.ts       App-wide constants
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
                  <h1 className="text-3xl font-bold mb-6">Cursor AI User Rules</h1>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Recommended best-practices when working inside the Cursor IDE.
                  </p>
                  <CursorAiUserRules />
                </div>
              )}

              {activeSection === "error" && (
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  <h1 className="text-3xl font-bold mb-6">Troubleshooting & Common Issues</h1>

                  {/* Search Bar */}
                  <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center max-w-lg">
                    <input
                      type="text"
                      value={issueQuery}
                      onChange={(e) => setIssueQuery(e.target.value)}
                      placeholder="Search errors or keywords..."
                      className="input flex-1"
                    />
                    {issueQuery && (
                      <button
                        onClick={() => setIssueQuery("")}
                        className="btn-primary px-4 py-2 text-sm"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  {/* Issue List */}
                  <div className="space-y-6">
                    {filteredIssues.length === 0 && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">No matching issues found.</p>
                    )}

                    {filteredIssues.map((issue) => (
                      <details
                        key={issue.id}
                        className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 border border-red-200 dark:border-red-800"
                      >
                        <summary className="cursor-pointer font-medium text-red-700 dark:text-red-300">
                          {issue.title}
                        </summary>
                        <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                          {issue.solution}
                        </p>
                      </details>
                    ))}
                  </div>
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

              {activeSection === "roadmap" && (
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  <h1 className="text-3xl font-bold mb-6">Roadmap</h1>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    We're expanding JonStack beyond the browser:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-sm">
                    <li><strong>Q3 2024 – Mobile SDK</strong> (React Native) with shared Supabase auth & Drizzle queries.</li>
                    <li><strong>Q4 2024 – Desktop</strong> (Electron) using the same React codebase.</li>
                    <li><strong>Ongoing – AI-First DX</strong>: deeper IDE rules, code-gen wizards and one-shot scaffolds.</li>
                  </ul>
                </div>
              )}

              {activeSection === "project-rules" && (
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  <h1 className="text-3xl font-bold mb-6">Project Rules</h1>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Use the editor below to view or update <code>.mdc</code> rule files located in
                    your <code>.cursor/rules</code> directory. Changes you copy are ready to paste
                    into new rule files or share across projects.
                  </p>

                  {/* Interactive rule editor */}
                  <CursorProjectRule />
                </div>
              )}

              {activeSection === "memories" && (
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  <h1 className="text-3xl font-bold mb-6">Memories</h1>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Cursor stores small pieces of knowledge as <em>memories</em>. They act like
                    sticky-notes the AI can reference in future sessions.
                  </p>
                  <div className="space-y-6">
                    {memoriesList.map((m) => (
                      <div key={m.id} className="relative bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-sm">
                        <button
                          onClick={() => navigator.clipboard.writeText(m.text).catch(() => {})}
                          className="absolute top-2 right-2 px-2 py-0.5 text-xs bg-gray-300 dark:bg-gray-700 rounded hover:bg-gray-400 dark:hover:bg-gray-600"
                        >Copy</button>
                        <p className="mb-1 text-gray-700 dark:text-gray-200"><strong>ID:</strong> {m.id}</p>
                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{m.text}</p>
                      </div>
                    ))}
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