import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router";
import type { Route } from "./+types/docs";
import CursorProjectRule from "@client/components/docs/CursorDocs/CursorProjectRule";
import CursorUserRulesSection from "@client/components/docs/CursorDocs/CursorUserRulesSection";
import MemoriesSection from "@client/components/docs/CursorDocs/MemoriesSection";
// import type { AvailablePlatform as Platform } from "@shared/availablePlatforms";
import { availablePlatforms } from "@shared/availablePlatforms";
import { availableIntegrations } from "@shared/availableIntegrations";
import { useOs } from "@client/context/OSContext";
import BuildTab from "@client/components/docs/build/BuildTab";
import IntegrationsDocsContent from "@client/components/docs/integration/IntegrationsDocsContent";

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
  const { os } = useOs();

  // Platform dropdown state
  const [platformOpen, setPlatformOpen] = useState(false);
  const platformBtnRef = useRef<HTMLButtonElement | null>(null);
  const platformMenuRef = useRef<HTMLDivElement | null>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        platformOpen &&
        !platformBtnRef.current?.contains(e.target as Node) &&
        !platformMenuRef.current?.contains(e.target as Node)
      ) {
        setPlatformOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [platformOpen]);

  const megaPrompt = ideaParam
    ? `alter the current template to help create this idea, understand the current codebase and make changes and alter the connections, tables, functions, namings all to my project's idea. target platform=${target}. dev os=${os}. create a github repo called "${projectParam}". then <user_idea_start>${ideaParam}<user_idea_end>`
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

  // Track Tech Stack dropdown visibility
  const [techOpen, setTechOpen] = useState(false);

  // Dropdown for Cursor integration (User Rules, Project Rules, Memories)
  const [cursorOpen, setCursorOpen] = useState(false);

  // Leaf-level documentation sections (i.e. selectable pages)
  const leafSections = [
    { id: "cursor-rules", title: "User Rules" },
    { id: "project-rules", title: "Project Rules" },
    { id: "memories", title: "Memories" },
    { id: "build-idea", title: "Build Idea" },
    { id: "database", title: "Database" },
    { id: "authentication", title: "Authentication" },
    { id: "file-uploads", title: "File Uploads" },
    { id: "analytics", title: "Analytics" },
  ] as const;

  // Preserve original order defined in availablePlatforms.ts
  const platformsToShow = availablePlatforms;

  // Integrations: keep original declaration order, but move "soon" items to the end
  const displayIntegrations = React.useMemo(() => {
    const avail = availableIntegrations.filter((i) => i.status !== 'soon');
    const soon = availableIntegrations.filter((i) => i.status === 'soon');
    return [...avail, ...soon];
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex gap-8">
          {/* Sidebar Navigation */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-4 gap-3">
                <h3 className="font-semibold text-gray-900 dark:text-white">Documentation</h3>
                <div className="relative">
                  <button
                    ref={platformBtnRef}
                    onClick={() => setPlatformOpen((o) => !o)}
                    className="w-8 h-8 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    title={`Platform: ${availablePlatforms[targetIdx].label}`}
                  >
                    {(() => {
                      const IconComp = availablePlatforms[targetIdx].icon;
                      if (IconComp) {
                        return <IconComp className="w-4 h-4 text-gray-700 dark:text-gray-300" />;
                      }
                      return (
                        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                          {availablePlatforms[targetIdx].label.substring(0, 2).toUpperCase()}
                        </span>
                      );
                    })()}
                  </button>

                  {platformOpen && (
                    <div
                      ref={platformMenuRef}
                      className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 max-h-72 overflow-y-auto scrollbar-none"
                    >
                      {platformsToShow.map((p) => {
                        const idx = availablePlatforms.findIndex((x) => x.key === p.key);
                        const Icon = p.icon;
                        return (
                          <button
                            key={p.key}
                            onClick={() => {
                              setTargetIdx(idx);
                              setPlatformOpen(false);
                            }}
                            className={`relative flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                              idx === targetIdx ? "bg-gray-100 dark:bg-gray-700" : ""
                            }`}
                          >
                            {Icon ? <Icon className="w-4 h-4" /> : null}
                            <span>{p.label}</span>
                            {p.status === "soon" && (
                              <span className="ml-auto text-[10px] uppercase font-semibold bg-yellow-900/40 text-yellow-300 px-1.5 py-0.5 rounded-md">soon</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
              <nav className="space-y-2">
                {/* Top-level quick start */}
                {leafSections
                  .filter((s) => ["build-idea"].includes(s.id))
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
                  <span className="text-sm flex-1">Cursor</span>
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
                      .filter((s: any) => (['cursor-rules','project-rules','memories'] as string[]).includes(s.id))
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
                  onClick={() => setTechOpen((o) => !o)}
                  className={`w-full text-left px-4 py-2 rounded-lg flex items-center gap-3 transition-all ${
                    techOpen || ([...displayIntegrations.map((i:any)=>i.key), 'file-uploads', 'database', 'analytics'].includes(activeSection as string))
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className="text-sm flex-1">Integrations</span>
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
                    {displayIntegrations.map((intg: any) => {
                      const authProviders = ['solana', 'google', 'github', 'discord'];
                      const mappedSection = authProviders.includes(intg.key)
                        ? 'authentication'
                        : intg.key === 'uploads'
                          ? 'file-uploads'
                          : intg.key;

                      return (
                        <button
                          key={intg.key}
                          onClick={() => {
                            if (intg.status !== 'soon') setActiveSection(mappedSection);
                          }}
                          className={`w-full text-left px-4 py-2 rounded-lg flex items-center gap-3 transition-all ${
                            activeSection === mappedSection
                              ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium'
                              : intg.status === 'soon'
                                ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed opacity-50'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                          }`}
                          disabled={intg.status === 'soon'}
                        >
                          {intg.icon ? <intg.icon className="w-4 h-4" /> : null}
                          <span className="text-sm flex-1">{intg.label}</span>
                          {intg.status === 'soon' && (
                            <span className="ml-auto text-[10px] uppercase font-semibold bg-yellow-900/40 text-yellow-300 px-1.5 py-0.5 rounded-md">soon</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Troubleshooting nav removed as per new requirements */}
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

              {/* Integration-specific documentation */}
              {(['database', 'file-uploads', 'uploads', 'analytics'] as string[]).includes(activeSection) && (
                <IntegrationsDocsContent integrationKey={activeSection} />
              )}

              {activeSection === "cursor-rules" && <CursorUserRulesSection />}

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

              {activeSection === "memories" && <MemoriesSection />}

              {activeSection === "build-idea" && (
                <BuildTab
                  idea={ideaParam}
                  platformLabel={availablePlatforms[targetIdx].label}
                  integrationKeys={integrationKeysFromParam}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 