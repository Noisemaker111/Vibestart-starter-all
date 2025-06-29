import React, { type FC } from "react";
import IntegrationChips from "@client/components/IntegrationChips";
import { availableIntegrations } from "@shared/availableIntegrations";
import { Plus } from "lucide-react";

// Test components for individual integrations
import DocsTestAuth from "@client/components/docs/test/TestAuth";
import DocsTestDatabase from "@client/components/docs/test/TestDatabase";
import DocsTestUploads from "@client/components/docs/test/TestUploads";
import DocsTestLLM from "@client/components/docs/test/TestLLM";
import DocsTestBilling from "@client/components/docs/test/TestBilling";
import DocsTestMaps from "@client/components/docs/test/TestMaps";
import DocsTestRealtimeMessages from "@client/components/docs/test/TestRealtimeMessages";

interface BuildTabProps {
  idea?: string;
  platformLabel: string;
  integrationKeys?: string[];
  className?: string;
}

const BuildTab: FC<BuildTabProps> = ({ idea, platformLabel: _unused, integrationKeys, className }) => {
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
    if (_unused) {
      try { localStorage.setItem("buildIdeaPlatform", _unused); } catch {}
    }
  }, [_unused]);

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
    set.add("Vercel account – https://vercel.com/docs/vite"); // always recommend Vercel
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

  return (
    <div className={`prose prose-gray dark:prose-invert max-w-none ${className ?? ""}`.trim()}>
      <h1 className="text-3xl font-bold mb-6">Build Your Idea</h1>

      {/* Idea input */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Your Idea</label>
        <textarea
          value={selectedIdea}
          onChange={(e) => setSelectedIdea(e.target.value)}
          placeholder="Describe your app idea…"
          rows={4}
          className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-all"
        />
      </div>

      {/* Integration overview */}
      <div className="relative mb-8" ref={menuRef}>
        <div className="flex flex-wrap gap-2">
          <IntegrationChips activeKeys={keys} showAllIfEmpty={false} onRemove={handleRemove} />
          {/* Plus chip */}
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-600 to-blue-600 text-white border border-purple-500 hover:opacity-80 transition"
          >
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>

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
              "Vercel account": "Zero-config global hosting platform for your app.",
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
                    className="text-blue-600 dark:text-blue-400 underline"
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

        const envSample = envVarSet.map((v) => `${v}=your_value_here`).join("\n");

        const flagMap: Record<string, string> = {
          google: "google",
          github: "github",
          discord: "discord",
          solana: "solanasignin",
          database: "database",
          uploads: "uploads",
          llm: "llm",
          billing: "billing",
          maps: "maps",
          realtime: "realtime",
        };
        const flags = ["-web", ...keys.map((k) => `-${flagMap[k] ?? k}`)];
        const createCmd = `npx create vibestart ${flags.join(" ")}`;

        return (
          <ol className="list-decimal list-inside space-y-8 text-sm">
            {/* Step 1 removed – developer tooling already covered in Pre-Requisites */}

            {/* Step 2 */}
            <li>
              <h3 className="text-xl font-semibold mb-2">Create Your Project Folder</h3>
              <p className="mb-2">Open Terminal / PowerShell, pick a folder like <code>Desktop</code>, and run:</p>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-2">
                <code>{createCmd}</code>
              </pre>
              <p className="text-xs text-gray-500">
                The wizard will ask questions; press <kbd>Enter</kbd> to accept defaults unless you know what you're doing.
              </p>
            </li>

            {/* Step 3 */}
            <li>
              <h3 className="text-xl font-semibold mb-2">Add Environment Variables</h3>
              <p className="mb-2">Duplicate <code>.env.example</code> → rename to <code>.env.local</code>, then paste:</p>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-2 text-xs">
                <code>{envSample}</code>
              </pre>
              <p className="text-xs text-gray-500 mb-3">Replace each <code>your_value_here</code> with the real key from the service dashboard.</p>

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
                          – <a href={meta.link} target="_blank" rel="noopener noreferrer" className="underline text-blue-600 dark:text-blue-400">Get key</a>
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

            {/* Step 4 */}
            <li>
              <h3 className="text-xl font-semibold mb-2">Run the App Locally</h3>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-2">
                <code>{`npm run db:migrate\nnpm run dev`}</code>
              </pre>
              <p className="text-xs text-gray-500">After a few seconds a browser tab will open at <code>http://localhost:5173</code>.</p>
            </li>

            {/* Step 5 – integration tests if any */}
            {testComponents.length > 0 && (
              <li>
                <h3 className="text-xl font-semibold mb-2">Check Your Integrations</h3>
                <p className="mb-2">Use the widgets below to make sure each service is wired up correctly.</p>
                {testComponents.map((Comp, idx) => (
                  <Comp key={idx} />
                ))}
              </li>
            )}

            {/* Step 6 */}
            <li>
              <h3 className="text-xl font-semibold mb-2">Deploy to the Internet</h3>
              <p className="mb-2">Push your code to GitHub, then click <strong>New&nbsp;Project</strong> in Vercel and import it. Or use the CLI:</p>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-2">
                <code>{`npm i -g vercel\nvercel --prod`}</code>
              </pre>
              <p className="text-xs text-gray-500">During setup Vercel will ask for environment variables—paste the same ones from <code>.env.local</code>.</p>
            </li>

            {/* Step 7 */}
            <li>
              <h3 className="text-xl font-semibold mb-2">Keep Building!</h3>
              <p className="mb-2">Run tests, add new pages, and invite friends. Your app redeploys automatically on every Git push.</p>
            </li>
          </ol>
        );
      })()}
    </div>
  );
};

export default BuildTab; 