import React, { type FC } from "react";
import { availableIntegrations } from "@shared/availableIntegrations";
import { availablePlatforms } from "@shared/availablePlatforms";
import { useEnvironment } from "@client/context/EnvironmentContext";
import { processIdea } from "@client/utils/integrationLLM";
import { DEFAULT_MODEL } from "@client/utils/integrationLLM";
import IdeaTextBox from "@client/components/IdeaTextBox";

// Test components for individual integrations
import TestIntegrations from "@client/components/integrations/TestIntegrations";

import { buildHomeIdeaConverter, promptHomeIdeaConverter } from "@shared/promptHomeIdeaConverter";
import { supabase } from "@shared/supabase";
import { dispatchClearTests } from "@client/utils/testIntegrationEvents";
import {
  promptCursorSetup,
  promptClaudeSetup,
  promptGeminiSetup,
} from "@shared/promptCursorSetup";

interface BuildTabProps {
  idea?: string;
  platformLabel: string;
  /**
   * Selected integration keys supplied by parent. When provided the component keeps
   * its internal state in sync with this array and propagates any changes back
   * via onIntegrationKeysChange.
   */
  integrationKeys?: string[];
  /** Callback invoked whenever the selected integration keys change */
  onIntegrationKeysChange?: (keys: string[]) => void;
  /** Callback when AI suggests a new platform label */
  onPlatformChange?: (label: string) => void;
  className?: string;
}

interface IntegrationDetail {
  key: string;
  label: string;
  prerequisites: string[];
  envVars: string[];
}

const BuildTab: FC<BuildTabProps> = ({ idea, platformLabel, integrationKeys, onIntegrationKeysChange, onPlatformChange, className }) => {
  const { env } = useEnvironment();
  const modKey = env === "cursor" ? "Cmd" : "Ctrl";
  const toolName = env === "cursor" ? "Cursor IDE" : env === "claude" ? "Claude Code" : "Gemini CLI";
  const chatName = env === "cursor" ? "Cursor's chat" : env === "claude" ? "Claude Code" : "Gemini";
  const runAppInstruction = env === "cursor" ? "Tell Cursor to run the app" : env === "claude" ? "Tell Claude Code to run the app" : "Tell Gemini CLI to run the app";
  const [keys, setKeys] = React.useState<string[]>(() => {
    if (integrationKeys && integrationKeys.length > 0) return integrationKeys;
    try {
      const saved = localStorage.getItem("buildIdeaSelectedIntegrations");
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  // Keep internal keys in sync with controlled prop
  React.useEffect(() => {
    if (integrationKeys && JSON.stringify(integrationKeys) !== JSON.stringify(keys)) {
      setKeys(integrationKeys);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [integrationKeys]);

  // Helper to update keys & inform parent when needed
  const updateKeys = React.useCallback(
    (next: string[]) => {
      setKeys(next);
      onIntegrationKeysChange?.(next);
    },
    [onIntegrationKeysChange]
  );

  // --------------------------
  // Idea textarea local state
  // --------------------------
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
  // Only setter needed to trigger loading indicator in parent components
  const [, setAiLoading] = React.useState(false);

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
        const result = await processIdea(ideaString, [], DEFAULT_MODEL, "structured");

        updateKeys(result.integrations.map((i: any) => i.key));
        if (result.platform && typeof result.platform === 'string') {
          onPlatformChange?.(availablePlatforms.find(p=>p.key===result.platform)?.label || result.platform);
        }
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
    [updateKeys, onPlatformChange, integrationKeys]
  );

  // Debounced trigger – 800 ms after typing stops
  React.useEffect(() => {
    const trimmed = selectedIdea.trim();
    if (trimmed.length < 3) return;

    // If we already have integration keys, assume AI has run before – skip auto request
    if (keys.length > 0) return;

    const handle = setTimeout(() => {
      runAiGeneration(trimmed);
    }, 800);

    return () => clearTimeout(handle);
  }, [runAiGeneration, selectedIdea, keys.length]);

  // KeyDown handler – run AI immediately on Enter (no Shift)
  function handleIdeaKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const trimmed = selectedIdea.trim();
      if (trimmed && trimmed.length > 0) {
        runAiGeneration(trimmed);
      }
    }
  }

  // Change handler updates state and sets loading placeholder when >=3 chars
  function handleIdeaChange(val: string) {
    setSelectedIdea(val);
    if (val.trim().length >= 3) setAiLoading(true);
    else setAiLoading(false);
  }

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

  // Integration test widget (single consolidated component)
  const hasSelectedIntegrations = keys.length > 0;

  // Base prerequisites are always the same. Integration-specific accounts are handled later.
  const prerequisiteSet = React.useMemo(() => {
    const toolLink =
      env === "cursor"
        ? "https://www.cursor.com/"
        : env === "claude"
        ? "https://www.anthropic.com/" // Placeholder link
        : "https://ai.google.dev/gemini-api/docs/gemini-cli"; // Placeholder link

    return [
      "Node.js 18+ – https://nodejs.org/en/download",
      "Git 2.5+ – https://git-scm.com/downloads",
      `${toolName} – ${toolLink}`,
    ];
  }, [env, toolName]);

  // Details per selected integration – used for new Step 3
  const integrationDetails = React.useMemo<IntegrationDetail[]>(() => {
    return keys
      .map<IntegrationDetail | null>((k) => {
        const intg = availableIntegrations.find((i) => i.key === k);
        if (!intg) return null;
        return {
          key: intg.key,
          label: intg.label,
          prerequisites: intg.prerequisites ?? [],
          envVars: intg.envVars ?? [],
        };
      })
      .filter((d): d is IntegrationDetail => d !== null);
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
  const setupCommands = `npm install\nnpm run dev`;

  // Generate full prompt per environment
  const promptFull = (() => {
    const options = { projectStructureMdc, techStackMdc, setupCommands } as const;
    if (env === "cursor") return promptCursorSetup(options);
    if (env === "claude") return promptClaudeSetup(options);
    return promptGeminiSetup(options);
  })();

  // Abbreviated prompt shown in the UI (keeps screen clean)
  const cursorPromptDisplay = (() => {
    if (env === "cursor") {
      return (
        <>
          Prompt to generate the{' '}
          <a
            href="/docs?section=cursor"
            className="underline text-purple-600 dark:text-purple-400"
          >
            project rules
          </a>{' '}
          , Initialize the project and Inject Code for the integrations and directory structure.
        </>
      );
    }
    if (env === "claude") {
      return (
        <>
          Prompt to generate the{' '}
          <a
            href="/docs?section=cursor"
            className="underline text-purple-600 dark:text-purple-400"
          >
            CLAUDE.md
          </a>{' '}, Initialize the project and Inject Code for the integrations and directory structure.
        </>
      );
    }
    return (
      <>
        Prompt to generate the{' '}
        <a
          href="/docs?section=cursor"
          className="underline text-purple-600 dark:text-purple-400"
        >
          GEMINI.md
        </a>{' '}, Initialize the project and Inject Code for the integrations and directory structure.
      </>
    );
  })();

  return (
    <div className={`prose prose-gray dark:prose-invert max-w-none ${className ?? ""}`.trim()}>

      {/* Pre-Requisites section (moved above idea area) */}
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
              "Cursor IDE": "$20/month AI-powered code editor with a GUI and background agents.",
              "Claude Code": "$200 AI very powerful code assistant through CLI.",
              "Gemini CLI": "Free CLI to interact with Google's Gemini models, through CLI.",
              "Create a Supabase account": "Hosted Postgres database & user authentication.",
              "Create an UploadThing account": "Simple file upload service for images, documents and more.",
              "Create a Vercel account": "Host your website and API endpoints.",
              "Create an OpenAI account": "AI-powered image generation (requires at least $5 credit).",
              "Create an OpenRouter account": "Gateway to multiple LLMs (requires at least $5 credit).",
              "Create a PostHog account": "Product analytics with event tracking & feature flags.",
            };

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
                  <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">- {description}</span>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {/* Idea input block + dropdown anchor */}
      <div className="relative mb-8">
        <div className="relative w-full max-w-4xl mx-auto p-4 not-prose">
            {/* Idea textarea */}
            <div className="relative z-10 flex flex-col items-center justify-center gap-2 w-full">
              <IdeaTextBox
                value={selectedIdea}
                onChange={handleIdeaChange}
                onKeyDown={handleIdeaKeyDown}
                placeholder="Enter your idea here…"
                className="w-full max-w-2xl"
              />
            </div>
        </div>
      </div>

      {/* Build steps */}
      {(() => {
        // Split prerequisites into tools vs. accounts
        const toolPrefixes = ["Node.js", "Git", toolName];
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
          <ol className="list-decimal space-y-8 text-lg not-prose">
            {/* Step 2 – prompt for rules */}
            <li>
              <h3 className="text-xl font-semibold mb-2">Prompt for VibeStart</h3>
              <p className="mb-4">Click <strong>Copy</strong> then paste into {chatName}, and hit Enter to generate the rules.</p>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => navigator.clipboard.writeText(promptFull).catch(() => {})}
                  className="absolute right-2 top-2 px-2 py-0.5 text-xs bg-gray-700 text-white rounded hover:bg-gray-600"
                >
                  Copy
                </button>
                <div className="bg-gray-100 dark:bg-gray-800/40 p-4 rounded-lg overflow-x-auto text-sm select-text rounded-md">
                  {cursorPromptDisplay}
                </div>
              </div>
            </li>

            {/* Step 3 – concise per-integration setup */}
            {integrationDetails.length > 0 && (
              <li>
                <h3 className="text-xl font-semibold mb-2">Add Credentials &amp; Env Vars</h3>
                <p className="text-sm mb-3">Create the necessary accounts for each selected integration, copy the keys they provide, then add them to your <code>.env.local</code> file.</p>

                {/* Compact per-environment-variable rows */}
                <ul className="space-y-2">
                  {(() => {
                    const map = new Map<string, { label: string; link?: string; vars: Set<string> }>();
                    integrationDetails.forEach((detail) => {
                      const firstPre = detail.prerequisites[0] ?? detail.label;
                      const [rawLbl, rawLink] = firstPre.split(" – ");
                      const lbl = rawLbl.trim();
                      const lnk = rawLink?.trim();
                      const key = lnk || lbl;
                      if (!map.has(key)) {
                        map.set(key, { label: lbl, link: lnk, vars: new Set<string>() });
                      }
                      const entry = map.get(key)!;
                      detail.envVars.forEach((v) => entry.vars.add(v));
                    });
                    return Array.from(map.values()).map(({ label, link, vars }) => (
                      <li key={label} className="flex items-start justify-between gap-4 text-sm">
                        {link ? (
                          <a
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline text-purple-600 dark:text-purple-400 flex-1"
                          >
                            {label}
                          </a>
                        ) : (
                          <span className="flex-1">{label}</span>
                        )}
                        <code className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">{Array.from(vars).join(", ")}</code>
                      </li>
                    ));
                  })()}
                </ul>
              </li>
            )}

            {/* Step 4 – run the app */}
            <li>
              <h3 className="text-xl font-semibold mb-2">Run the App</h3>
              <p className="mb-2">{runAppInstruction}, or execute:</p>
              <pre className="bg-gray-900 text-gray-100 p-3 rounded-md overflow-x-auto text-xs"><code>{devCmd}</code></pre>
            </li>

            {/* Step 5 – integration tests */}
            {hasSelectedIntegrations && (
              <li>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-semibold">Check Your Integrations</h3>
                  <button
                    type="button"
                    onClick={async () => {
                      // Global clear logic – sign out, wipe tables, then dispatch event
                      try {
                        await supabase.auth.signOut().catch(() => {});
                      } catch {}

                      try {
                        await fetch("/api/animals", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: "{}" });
                      } catch {}

                      try {
                        await fetch("/api/images", { method: "DELETE" });
                      } catch {}

                      // Dispatch event to notify all widgets to reset UI state
                      dispatchClearTests();
                    }}
                    className="px-3 py-1 text-sm bg-gray-700 text-white rounded-md hover:bg-gray-600"
                  >
                    Clear All Tests
                  </button>
                </div>
                <TestIntegrations />
              </li>
            )}

            {/* Step 6 – version control */}
            <li>
              <h3 className="text-xl font-semibold mb-2">Set Up Git &amp; GitHub</h3>
              <p className="mb-2">Version-control keeps your history safe and enables automatic deployments.</p>
              <ol className="list-decimal list-inside space-y-1 ml-4">
                <li>{env === "cursor" ? "Open Cursor's" : `Open ${toolName}'s`} <strong>Source Control</strong> panel (icon next to Explorer).</li>
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