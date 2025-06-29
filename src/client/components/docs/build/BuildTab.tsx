import React, { type FC } from "react";
import IdeaDisplay from "../../IdeaDisplay";
import { availableIntegrations } from "@shared/availableIntegrations";
import { availablePlatforms } from "@shared/availablePlatforms";
import { useOs } from "@client/context/OsContext";
import { processIdea } from "@client/utils/integrationLLM";

// Test components for individual integrations
import DocsTestAuth from "@client/components/docs/test/TestAuth";
import DocsTestDatabase from "@client/components/docs/test/TestDatabase";
import DocsTestUploads from "@client/components/docs/test/TestUploads";
import DocsTestLLM from "@client/components/docs/test/TestLLM";
import DocsTestBilling from "@client/components/docs/test/TestBilling";
import DocsTestMaps from "@client/components/docs/test/TestMaps";
import DocsTestRealtimeMessages from "@client/components/docs/test/TestRealtimeMessages";
import DocsTestNotifications from "@client/components/docs/test/TestNotifications";
import DocsTestEmail from "@client/components/docs/test/TestEmail";
import DocsTestSms from "@client/components/docs/test/TestSms";
import DocsTestFiles from "@client/components/docs/test/TestFiles";
import DocsTestWhiteboard from "@client/components/docs/test/TestWhiteboard";
import CursorUserRulesSection from "@client/components/docs/CursorDocs/CursorUserRules";
import { cursorMemories } from "@shared/cursorMemories";

interface BuildTabProps {
  idea?: string;
  platformLabel: string;
  integrationKeys?: string[];
  className?: string;
}

const BuildTab: FC<BuildTabProps> = ({ idea, platformLabel, integrationKeys, className }) => {
  const { os } = useOs();
  const shellName = os === "windows" ? "PowerShell" : "Terminal";
  const modKey = os === "mac" ? "Cmd" : "Ctrl";
  const [keys, setKeys] = React.useState<string[]>(() => {
    if (integrationKeys && integrationKeys.length > 0) return integrationKeys;
    try {
      const saved = localStorage.getItem("buildIdeaSelectedIntegrations");
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });
  const [menuOpen, setMenuOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const [selectedIdea, setSelectedIdea] = React.useState<string>(() => {
    if (idea && idea.length > 0) return idea;
    try {
      const saved = localStorage.getItem("buildIdeaIdea");
      if (saved) return saved;
    } catch {}
    return "";
  });

  // --------------------------
  // AI helper state & effects
  // --------------------------
  const [aiLoading, setAiLoading] = React.useState(false);

  // Throttled generation mechanism (same as home.tsx)
  const lastAiCallRef = React.useRef(0); // timestamp ms
  const queuedIdeaRef = React.useRef<string | null>(null);

  const runAiGeneration = React.useCallback(
    async (ideaString: string) => {
      // Guard: ensure at least 2 s since last invocation
      const since = Date.now() - lastAiCallRef.current;
      if (since < 2000) {
        queuedIdeaRef.current = ideaString; // queue latest request (size 1)
        return;
      }

      lastAiCallRef.current = Date.now();
      setAiLoading(true);
      try {
        const result = await processIdea(ideaString);
        setKeys(result.integrations.map((i: any) => i.key));
        // Ignore error handling for now; could expose toast later
      } catch (err) {
        console.error("AI integration selection failed", err);
      } finally {
        setAiLoading(false);
      }

      // After finishing, process queued idea if exists
      const remaining = 2000 - (Date.now() - lastAiCallRef.current);
      const delay = Math.max(0, remaining);
      if (queuedIdeaRef.current) {
        const nextIdea = queuedIdeaRef.current;
        queuedIdeaRef.current = null;
        setTimeout(() => runAiGeneration(nextIdea), delay);
      }
    },
    []
  );

  // Debounced trigger – 800 ms after typing stops
  React.useEffect(() => {
    const trimmed = selectedIdea.trim();
    if (trimmed.length < 3) return;

    const handle = setTimeout(() => {
      runAiGeneration(trimmed);
    }, 800);

    return () => clearTimeout(handle);
  }, [selectedIdea, runAiGeneration]);

  // KeyDown handler – run AI immediately on Enter (no Shift)
  function handleIdeaKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const trimmed = selectedIdea.trim();
      if (trimmed.length > 0) {
        runAiGeneration(trimmed);
      }
    }
  }

  // Change handler updates state and sets loading placeholder when >=3 chars
  function handleIdeaChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const val = e.target.value;
    setSelectedIdea(val);
    if (val.trim().length >= 3) setAiLoading(true);
    else setAiLoading(false);
  }

  // Close dropdown when clicking outside
  React.useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuOpen && menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  // Persist selected integrations to localStorage
  React.useEffect(() => {
    try {
      localStorage.setItem("buildIdeaSelectedIntegrations", JSON.stringify(keys));
    } catch {}
  }, [keys]);

  // Persist idea & platform
  React.useEffect(() => {
    try {
      localStorage.setItem("buildIdeaIdea", selectedIdea);
    } catch {}
  }, [selectedIdea]);

  React.useEffect(() => {
    if (platformLabel) {
      try { localStorage.setItem("buildIdeaPlatform", platformLabel); } catch {}
    }
  }, [platformLabel]);

  // Resolve selected platform object for PlatformChip display
  const platformObj = React.useMemo(() => {
    return availablePlatforms.find((p) => p.label === platformLabel);
  }, [platformLabel]);

  const unselected = availableIntegrations.filter((i) => !keys.includes(i.key));

  function handleAdd(key: string) {
    setKeys((prev) => (prev.includes(key) ? prev : [...prev, key]));
  }

  function handleRemove(key: string) {
    setKeys((prev) => prev.filter((k) => k !== key));
  }

  // Map integration keys to test components for verification section
  const integrationComponentMap: Record<string, React.FC | undefined> = {
    google: DocsTestAuth,
    github: DocsTestAuth,
    discord: DocsTestAuth,
    solana: DocsTestAuth,
    database: DocsTestDatabase,
    uploads: DocsTestUploads,
    llm: DocsTestLLM,
    billing: DocsTestBilling,
    maps: DocsTestMaps,
    realtime: DocsTestRealtimeMessages,
    notifications: DocsTestNotifications,
    email: DocsTestEmail,
    sms: DocsTestSms,
    files: DocsTestFiles,
    whiteboard: DocsTestWhiteboard,
  };

  const testComponents = Array.from(new Set(keys))
    .map((k) => integrationComponentMap[k])
    .filter(Boolean) as React.FC[];

  // Dynamic prerequisites & env vars based on selected integrations
  const prerequisiteSet = React.useMemo(() => {
    const base = [
      "Node.js 18+ – https://nodejs.org/en/download",
      "Git 2.5+ – https://git-scm.com/downloads",
      "Cursor IDE – https://www.cursor.com/",
    ];
    const set = new Set<string>(base);
    keys.forEach((k) => {
      const intg = availableIntegrations.find((i) => i.key === k);
      intg?.prerequisites?.forEach((p) => set.add(p));
    });
    return Array.from(set);
  }, [keys]);

  const envVarSet = React.useMemo(() => {
    const set = new Set<string>();
    keys.forEach((k) => {
      const intg = availableIntegrations.find((i) => i.key === k);
      intg?.envVars?.forEach((v) => set.add(v));
    });
    return Array.from(set);
  }, [keys]);

  const envSample = envVarSet.map((v) => `${v}=your_value_here`).join("\n");

  // Dev command depending on database usage
  const devCmd = keys.includes("database")
    ? "npm run db:migrate && npm run dev"
    : "npm run dev";

  // ---------------------------------------------------------------------------
  // Cursor rule generation helper – displayed as a code block users can copy.
  // ---------------------------------------------------------------------------
  const projectStructureMdc = `---\ndescription: \nglobs: \nalwaysApply: true\n---\n<project-structure>\n... (project structure here – customise as needed)\n</project-structure>`;

  const techStackMdc = `---\ndescription: \nglobs: \nalwaysApply: true\n---\n- lang: TypeScript 5\n- frontend: React 19 + ReactRouter 7 (SSR) via Vite 6 & vite-tsconfig-paths\n- style: TailwindCSS 4 (@tailwindcss/vite)\n- runtime: Node 18\n- db: PostgreSQL (Supabase) · DrizzleORM 0.44\n- migrations: drizzle-kit CLI\n- auth: SupabaseAuth (Google)\n- files: UploadThing\n- validation: Zod\n- rate-limit: Unified DB-backed token bucket\n- analytics: PostHog JS\n- date: Day.js\n- icons: Lucide React\n- deploy: Vercel primary`;

  // ---------------------------------------------------------------------------
  // 1) Memory creation commands – one per memory entry (shared source)
  // ---------------------------------------------------------------------------

  const memoryCommands = cursorMemories.map((m) => `/Create Memory\n${m}`).join("\n\n");

  const flagsForPrompt = [
    "-web",
    ...keys.map((k) => {
      const found = availableIntegrations.find((i) => i.key === k);
      const flag = found?.cliFlag ?? k;
      return `-${flag}`;
    }),
  ];
  const createCmdForPrompt = `npx create vibestart ${flagsForPrompt.join(" ")}`;
  const setupCommands = `${createCmdForPrompt}\ncd my-app\nnpm install\nnpm run dev`;

  const cursorPromptFull = `${memoryCommands}\n\n/Generate Cursor Rules\n\n<project-structure.mdc>\n${projectStructureMdc}\n\n<tech-stack.mdc>\n${techStackMdc}\n\n/Setup Project\n${setupCommands}`;

  // Abbreviated prompt shown in the UI (keeps screen clean)
  const cursorPromptDisplay = (
    <>
      Prompt to generate the {' '}
      <a
        href="/docs?platform=web&section=project-rules"
        className="underline text-purple-600 dark:text-purple-400"
      >
        project rules
      </a>
      ,{' '}
      <a
        href="/docs?platform=web&section=memories"
        className="underline text-purple-600 dark:text-purple-400"
      >
          memories
      </a>{' '}
      and to get the project setup
    </>
  );

  function handleNewIdea() {
    // Reset to blank state
    setSelectedIdea("");
    setKeys([]);

    try {
      localStorage.removeItem("buildIdeaIdea");
      localStorage.removeItem("buildIdeaSelectedIntegrations");
    } catch {}
  }

  return (
    <div className={`prose prose-gray dark:prose-invert max-w-none ${className ?? ""}`.trim()}>
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Build Your Idea</h1>
        <button
          type="button"
          onClick={handleNewIdea}
          className="inline-flex items-center gap-2 rounded-md text-sm font-medium bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-1.5 shadow hover:opacity-90 transition"
        >
          New Idea
        </button>
      </div>

      {/* Idea block + dropdown anchor */}
      <div className="relative mb-8" ref={menuRef}>
        <IdeaDisplay
          idea={selectedIdea}
          activeIntegrations={keys}
          platform={platformObj}
          onIdeaChange={handleIdeaChange}
          onIdeaKeyDown={handleIdeaKeyDown}
          placeholder="Enter your idea here…"
          loading={aiLoading}
          onRemove={handleRemove}
          onAdd={() => setMenuOpen((o) => !o)}
        />
        {menuOpen && (
          <div className="absolute z-10 mt-2 w-56 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-2 max-h-64 overflow-y-auto">
            {unselected.length === 0 && (
              <p className="text-center text-xs text-gray-500 py-4">All integrations added</p>
            )}
            {unselected.map((intg) => {
              const Icon = intg.icon;
              return (
                <button
                  key={intg.key}
                  onClick={() => handleAdd(intg.key)}
                  className="w-full flex items-center gap-2 px-3 py-1.5 rounded-md text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  <span>{intg.label}</span>
                  {intg.status === "soon" && (
                    <span className="ml-auto text-[10px] font-semibold uppercase text-purple-400">soon</span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Pre-Requisites section */}
      <div className="my-8">
        <h2 className="text-xl font-semibold mb-3">Pre-Requisites</h2>
        <ul className="list-disc pl-6 space-y-1 text-sm text-gray-600 dark:text-gray-400">
          {prerequisiteSet.map((p, index) => {
            const [rawLabel, rawLink] = p.split(" – ");
            const label = rawLabel.trim();
            const link = rawLink?.trim();

            const detailsMap: Record<string, string> = {
              "Node.js 18+": "JavaScript runtime that powers your backend.",
              "Git 2.5+": "Version-control system to track and share your code.",
              "Cursor IDE": "AI-powered code editor that writes code with you, not for you.",
              "Create a Supabase account": "Hosted Postgres database & user authentication.",
              "Create an UploadThing account": "Simple file upload service for images, documents and more.",
              "Create an OpenRouter account": "Gateway to multiple LLMs (requires at least $5 credit).",
              "Create a PostHog account": "Product analytics with event tracking & feature flags.",
              "Install VibeStart CLI": "Scaffold a new VibeStart project in seconds.",
            };

            // Fallback: try shorter matches
            const description =
              detailsMap[label] ||
              Object.entries(detailsMap).find(([k]) => label.startsWith(k))?.[1];

            return (
              <li key={index} className="mb-3">
                {link ? (
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 dark:text-purple-400 underline"
                  >
                    {label}
                  </a>
                ) : (
                  <span>{label}</span>
                )}
                {description && (
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{description}</p>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {/* Build steps */}
      {(() => {
        // Split prerequisites into tools vs. accounts
        const toolPrefixes = ["Node.js", "Git", "Cursor IDE"];
        const tools = prerequisiteSet.filter((p) => toolPrefixes.some((pre) => p.startsWith(pre)));
        const accounts = prerequisiteSet.filter((p) => !tools.includes(p));

        const flags = [
          "-web",
          ...keys.map((k) => {
            const found = availableIntegrations.find((i) => i.key === k);
            const flag = found?.cliFlag ?? k;
            return `-${flag}`;
          }),
        ];
        const createCmd = `npx create vibestart ${flags.join(" ")}`;

        return (
          <ol className="list-decimal list-inside space-y-8 text-sm">
            {/* Step 1 removed – developer tooling already covered in Pre-Requisites */}

            {/* New Step 1 – generate Cursor rules */}
            <li>
              <h3 className="text-xl font-semibold mb-2">Prompt for VibeStart creation</h3>
              <p className="mb-4">Click <strong>Copy</strong> then paste into Cursor's chat, and hit Enter to generate the rules.</p>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => navigator.clipboard.writeText(cursorPromptFull).catch(() => {})}
                  className="absolute right-2 top-2 px-2 py-0.5 text-xs bg-gray-700 text-white rounded hover:bg-gray-600"
                >
                  Copy
                </button>
                <div className="bg-gray-100 dark:bg-gray-800/40 p-4 rounded-lg overflow-x-auto text-sm select-text rounded-md">
                  {cursorPromptDisplay}
                </div>
              </div>
            </li>

            {/* New Step 2 – set user rules */}
            <li>
              <h3 className="text-xl font-semibold mb-2">Set User Rules</h3>
              <p className="mb-4">
                Open <strong>Cursor → Settings → "User Rules"</strong>, then copy&nbsp;&amp;&nbsp;paste the rules below in full and
                save. These configure Cursor's behaviour for your project.
              </p>
              <CursorUserRulesSection />
            </li>

            {/* Removed explicit CLI step – setup runs automatically via the prompt */}

            {/* Step 3 – only when env vars required */}
            {envVarSet.length > 0 && (
            <li>
              <h3 className="text-xl font-semibold mb-2">Add Environment Variables</h3>
              <p className="mb-2">Duplicate <code>.env.example</code> → rename to <code>.env.local</code>, then paste:</p>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-2 text-xs">
                <code>{envSample}</code>
              </pre>
              <p className="text-xs text-gray-500 mb-3">Replace each <code>your_value_here</code> with the real key from the service dashboard.</p>
              <p className="text-xs text-gray-500 mb-3">Tip: Reload the dev server after editing <code>.env.local</code> so Vite picks up the changes.</p>

              <ul className="list-disc pl-6 space-y-1">
                {envVarSet.map((v) => {
                  // Map env vars to link & description
                  const info: Record<string, { link: string; desc: string }> = {
                    DATABASE_URL: {
                      link: "https://supabase.com/docs/guides/database/connecting-to-postgres",
                      desc: "Supabase → Settings → Database → Connection string",
                    },
                    VITE_SUPABASE_URL: {
                      link: "https://supabase.com/docs/guides/api",
                      desc: "Supabase → Settings → API → Project URL",
                    },
                    VITE_SUPABASE_ANON_KEY: {
                      link: "https://supabase.com/docs/guides/api",
                      desc: "Supabase → Settings → API → anon public key",
                    },
                    UPLOADTHING_TOKEN: {
                      link: "https://uploadthing.com/dashboard",
                      desc: "UploadThing Dashboard → API Keys → Secret Key",
                    },
                    VITE_OPENROUTER_API_KEY: {
                      link: "https://openrouter.ai/keys",
                      desc: "OpenRouter → Account → API Keys",
                    },
                    VITE_PUBLIC_POSTHOG_KEY: {
                      link: "https://posthog.com",
                      desc: "PostHog → Project Settings → Project API key",
                    },
                    VITE_PUBLIC_POSTHOG_HOST: {
                      link: "https://posthog.com",
                      desc: "Usually https://app.posthog.com unless self-hosted",
                    },
                  };

                  const meta = info[v as keyof typeof info];
                  return (
                    <li key={v} className="text-sm">
                      <code className="font-mono bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded-sm mr-1">{v}</code>
                      {meta ? (
                        <>
                          – <a href={meta.link} target="_blank" rel="noopener noreferrer" className="underline text-purple-600 dark:text-purple-400">Get key</a>
                          <span className="block text-xs text-gray-500 dark:text-gray-400 ml-4">{meta.desc}</span>
                        </>
                      ) : (
                        " – set this value in your hosting provider"
                      )}
                    </li>
                  );
                })}
              </ul>
            </li>
            )}

            {/* Step 4 – start the dev server via Cursor */}
            <li>
              <h3 className="text-xl font-semibold mb-2">Tell Cursor to Run the App</h3>
              <p className="mb-2">
                In the chat, type <code>run</code> or <code>start project</code>. The agent will
                execute <code>{devCmd}</code> automatically. Say <code>stop</code> or
                <code> close</code> to shut it down.
              </p>
            </li>

            {/* Step 5 – integration tests if any */}
            {testComponents.length > 0 && (
              <li>
                <h3 className="text-xl font-semibold mb-2">Check Your Integrations</h3>
                <p className="mb-2">Expand each widget to run a real API call (insert a row, upload a file, etc.). If everything succeeds you're ready for Git!</p>
                {testComponents.map((Comp, idx) => (
                  <Comp key={idx} />
                ))}
              </li>
            )}

            {/* Step 6 – version control */}
            <li>
              <h3 className="text-xl font-semibold mb-2">Set Up Git &amp; GitHub</h3>
              <p className="mb-2">Version-control keeps your history safe and enables automatic deployments.</p>
              <ol className="list-decimal list-inside space-y-1 ml-4">
                <li>Open Cursor's <strong>Source Control</strong> panel (icon next to Explorer).</li>
                <li>Click <strong>Initialize Repository</strong> to run <code>git init</code>.</li>
                <li>Select all files and click <strong>+</strong> to stage them.</li>
                <li>Add a commit message like <code>init</code> and press <kbd>{modKey}+Enter</kbd> to commit.</li>
                <li>Click <strong>Publish to GitHub</strong> (or <code>git remote add origin ...</code>) and follow the sign-in prompts.</li>
              </ol>
            </li>

            {/* Step 7 – optional deploy */}
            <li>
              <h3 className="text-xl font-semibold mb-2">Optional: Deploy with Vercel</h3>  
              <p className="mb-2">Create a free account at&nbsp;
                <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="underline text-purple-600 dark:text-purple-400">vercel.com</a>.
              </p>
              <ol className="list-decimal list-inside space-y-1 ml-4">
                <li>In the dashboard click <strong>New Project</strong> and import your GitHub repository.</li>
                <li>When prompted, grant Vercel access to your GitHub account.</li>
                <li>Open the <strong>Environment Variables</strong> step and paste everything from your <code>.env.local</code> file—Vercel will auto-create each key.</li>
                <li>Choose your framework preset (Vite) and click <strong>Deploy</strong>. Your app will build and go live on a *.vercel.app URL.</li> 
              </ol>
            </li>

            {/* Step 8 – optional custom domain */}
            <li>
              <h3 className="text-xl font-semibold mb-2">Optional: Add a Custom Domain</h3>
              <p className="mb-2">Go to <a href="https://vercel.com/domains" target="_blank" rel="noopener noreferrer" className="underline text-purple-600 dark:text-purple-400">vercel.com/domains</a> and search for a domain name.</p>
              <ol className="list-decimal list-inside space-y-1 ml-4">
                <li>Complete purchase—no DNS setup required, Vercel configures everything automatically.</li>
                <li>Hit <strong>Assign</strong> and re-deploy if prompted. Your app is now live on your custom URL.</li>
              </ol>
            </li>

            {/* Step 9 */}
            <li>
              <h3 className="text-xl font-semibold mb-2">Keep Building!</h3>
              <p className="mb-2">Ship new features, commit, and push—Vercel redeploys automatically on every Git push.</p>
            </li>
          </ol>
        );
      })()}
    </div>
  );
};

export default BuildTab; 