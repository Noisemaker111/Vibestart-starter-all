import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import type { Route } from "./+types/page";
import CursorProjectRule from "@client/components/CursorProjectRules";
import { availablePlatforms } from "@shared/availablePlatforms";
import { availableIntegrations } from "@shared/availableIntegrations";
import { useEnvironment } from "@client/components/EnvironmentContext";
import BuildTab from "@client/components/docs/BuildTab";
import PlatformChip from "@client/components/PlatformChip";
import SideBar from "@client/components/docs/SideBar";
import { CLAUDE_SYSTEM_RULES } from "@shared/promptClaudeSystem";
import { GEMINI_SYSTEM_RULES } from "@shared/promptGeminiSystem";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Documentation - VibeStart" },
    { name: "description", content: "Complete guide to using VibeStart" },
  ];
}

export default function Docs() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const ideaParam = searchParams.get("idea") ?? "";
  const projectParam = searchParams.get("project") ?? "";
  const sectionParam = searchParams.get("section") ?? "";
  const platformParam = searchParams.get("platform") ?? "";
  const integrationsParam = searchParams.get("integrations") ?? "";

  // OS param in URL (legacy) – no longer used
  type Target = typeof availablePlatforms[number]["key"];

  // Determine initial platform index from param or default 0
  const initialTargetIdx = (() => {
    const idx = availablePlatforms.findIndex((p) => p.key === platformParam);
    return idx === -1 ? 0 : idx;
  })();

  const [targetIdx, setTargetIdx] = useState(initialTargetIdx);

  // Parse integration keys from param – split by comma/space, dedupe
  const integrationKeysFromParam = React.useMemo(() => {
    return Array.from(
      new Set(
        integrationsParam
          .split(/[ ,]+/)
          .map((k) => k.trim())
          .filter(Boolean)
      )
    );
  }, [integrationsParam]);

  const target = availablePlatforms[targetIdx].key as Target;

  // Global OS
  const { env } = useEnvironment();

  // Platform dropdown state
  const [platformOpen, setPlatformOpen] = useState(false);
  const platformMenuRef = useRef<HTMLDivElement | null>(null);
  const [platformAnchor, setPlatformAnchor] = useState<{ x: number; y: number } | null>(null);

  // Close platform menu when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        platformOpen &&
        !platformMenuRef.current?.contains(e.target as Node)
      ) {
        setPlatformOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [platformOpen]);

  const megaPrompt = ideaParam
    ? `alter the current template to help create this idea, understand the current codebase and make changes and alter the connections, tables, functions, namings all to my project's idea. target platform=${target}. environment=${env}. create a github repo called "${projectParam}". then <user_idea_start>${ideaParam}<user_idea_end>`
    : "";

  const [megaCopySuccess, setMegaCopySuccess] = useState(false);
  function copyMegaPrompt() {
    if (!megaPrompt) return;
    navigator.clipboard.writeText(megaPrompt).then(() => {
      setMegaCopySuccess(true);
      setTimeout(() => setMegaCopySuccess(false), 2000);
    }).catch(() => {});
  }

  // Default to Build Idea when no explicit section is requested
  const [activeSection, setActiveSection] = useState(
    sectionParam || "build-idea"
  );

  // Leaf-level documentation sections (i.e. selectable pages)
  type DocsSection = { id: string; title: string };

  const leafSections: readonly DocsSection[] = React.useMemo(() => {
    const ideTitle = env === "cursor" ? "Cursor" : env === "claude" ? "Claude Code" : "Gemini CLI";
    return [
      { id: "build-idea", title: "Build Idea" },
      { id: "cursor", title: ideTitle },
      { id: "platforms", title: "Platforms" },
      { id: "database", title: "Database" },
      { id: "authentication", title: "Authentication" },
      { id: "file-uploads", title: "File Uploads" },
      { id: "analytics", title: "Analytics" },
    ] as const;
  }, [env]);

  // Preserve original order defined in availablePlatforms.ts
  const platformsToShow = availablePlatforms;

  // ---------------------------------------------------------------------------
  // Keep URL in sync when the user switches sections or platforms so that
  // each view can be linked to directly (deep-linking).
  // ---------------------------------------------------------------------------

  // Update "section" query param when activeSection changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("section") !== activeSection) {
      params.set("section", activeSection);
      navigate({ pathname: location.pathname, search: params.toString() }, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSection]);

  // Update "platform" query param when targetIdx (selected platform) changes
  useEffect(() => {
    const platformKey = availablePlatforms[targetIdx].key;
    const params = new URLSearchParams(location.search);
    if (params.get("platform") !== platformKey) {
      params.set("platform", platformKey);
      navigate({ pathname: location.pathname, search: params.toString() }, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetIdx]);

  // -----------------------------
  // Integration selection state
  // -----------------------------
  const initialIntegrationKeys: string[] = React.useMemo(() => {
    if (integrationKeysFromParam.length > 0) return integrationKeysFromParam;
    try {
      const saved = localStorage.getItem("buildIdeaSelectedIntegrations");
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  }, [integrationKeysFromParam]);

  const [integrationKeys, setIntegrationKeys] = useState<string[]>(initialIntegrationKeys);

  // Keep URL param "integrations" in sync with state
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const current = params.get("integrations") ?? "";
    const newVal = integrationKeys.join(",");
    if (current !== newVal) {
      if (newVal) params.set("integrations", newVal);
      else params.delete("integrations");
      navigate({ pathname: location.pathname, search: params.toString() }, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [integrationKeys]);

  // Precompute Claude & Gemini markdown previews
  const mdPreview = React.useMemo(() => {
    if (env === "claude") return CLAUDE_SYSTEM_RULES;
    if (env === "gemini") return GEMINI_SYSTEM_RULES;
    return "";
  }, [env]);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex gap-8">
          {/* Sidebar Navigation */}
          <SideBar
            targetIdx={targetIdx}
            setTargetIdx={setTargetIdx}
            leafSections={leafSections as any}
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            integrationKeys={integrationKeys}
            setIntegrationKeys={setIntegrationKeys}
          />

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
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 pt-0 border border-gray-100 dark:border-gray-700">
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

              {activeSection === "platforms" && (
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  <h1 className="text-3xl font-bold mb-6">Target Platforms</h1>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    VibeStart scaffolds apps for multiple runtimes. Pick one now or extend later—code sharing is first-class.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {availablePlatforms.map((p) => (
                      <PlatformChip key={p.key} platform={p} />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-6">
                    Need help choosing a platform? Reach out to <a href="https://twitter.com/vibecodejon" target="_blank" rel="noopener" className="underline">@vibecodejon</a> on Twitter.
                  </p>
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

              {activeSection === "cursor" && (
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  <h1 className="text-3xl font-bold mb-6">{env === "cursor" ? "Cursor Integration" : env === "claude" ? "Claude Code Integration" : "Gemini Integration"}</h1>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Manage AI settings and rule files that guide {env === "cursor" ? "Cursor" : env === "claude" ? "Claude Code" : "Gemini"} for this project.
                  </p>
                  <h2 className="text-2xl font-semibold mt-8 mb-4">{env === "cursor" ? "Project Rules" : env === "claude" ? "CLAUDE.md" : "GEMINI.md"}</h2>
                  {/* Reuse existing editor for Cursor, else simple display for Claude/Gemini */}
                  {env === "cursor" ? (
                    <CursorProjectRule />
                  ) : (
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => navigator.clipboard.writeText(mdPreview).catch(() => {})}
                        className="absolute right-2 top-2 px-2 py-0.5 text-xs bg-gray-700 text-white rounded hover:bg-gray-600"
                      >
                        Copy
                      </button>
                      <pre className="bg-gray-100 dark:bg-gray-800/40 p-4 rounded-lg overflow-x-auto text-xs whitespace-pre-wrap">
                        {mdPreview}
                      </pre>
                    </div>
                  )}
                </div>
              )}

              {activeSection === "build-idea" && (
                <BuildTab
                  idea={ideaParam}
                  platformLabel={availablePlatforms[targetIdx].label}
                  integrationKeys={integrationKeys}
                  onIntegrationKeysChange={setIntegrationKeys}
                  onPlatformChange={(label: string) => {
                    const idx = availablePlatforms.findIndex((p) => p.label === label);
                    if (idx !== -1) setTargetIdx(idx);
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 