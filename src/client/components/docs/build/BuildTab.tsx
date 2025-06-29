import IntegrationChips from "@client/components/IntegrationChips";
import { availableIntegrations } from "@shared/availableIntegrations";
import { FaPlus } from "react-icons/fa";
import type { FC } from "react";
import React from "react";

interface BuildTabProps {
  idea?: string;
  platformLabel: string;
  integrationKeys?: string[];
  className?: string;
}

const BuildTab: FC<BuildTabProps> = ({ idea, platformLabel: _unused, integrationKeys, className }) => {
  const [selectedKeys, setSelectedKeys] = React.useState<string[]>(() => {
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
      localStorage.setItem("buildIdeaSelectedIntegrations", JSON.stringify(selectedKeys));
    } catch {}
  }, [selectedKeys]);

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

  const unselected = availableIntegrations.filter((i) => !selectedKeys.includes(i.key));

  function handleAdd(key: string) {
    setSelectedKeys((prev) => (prev.includes(key) ? prev : [...prev, key]));
  }

  return (
    <div className={`prose prose-gray dark:prose-invert max-w-none ${className ?? ""}`.trim()}>
      <h1 className="text-3xl font-bold mb-6">Build Idea</h1>
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
      <div className="relative mb-6" ref={menuRef}>
        <div className="flex flex-wrap gap-2">
          <IntegrationChips activeKeys={selectedKeys} showAllIfEmpty={false} />
          {/* Plus chip */}
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            className="inline-flex items-center justify-center gap-1 px-3 py-1 rounded-full text-xs font-medium border-2 border-dashed border-purple-500 text-purple-500 hover:bg-purple-50 dark:hover:bg-gray-800 transition-colors"
            title="Add integration"
          >
            <FaPlus className="w-3 h-3" />
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
          <li>Node.js 18+ and npm installed</li>
          <li>Git 2.5+ or later</li>
          <li>Cursor IDE (or preferred code editor)</li>
          <li>Supabase account with a project created</li>
          <li>Vercel account for deployment</li>
        </ul>
      </div>

      <p className="text-gray-600 dark:text-gray-400">More content coming soon...</p>
    </div>
  );
};

export default BuildTab; 