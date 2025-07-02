import React, { useState, useEffect, useRef } from "react";
import IntegrationChips from "@client/components/integrations/IntegrationChip";
import PlatformChip from "@client/components/PlatformChip";
import { availablePlatforms } from "@shared/availablePlatforms";
import { availableIntegrations } from "@shared/availableIntegrations";
import { ChevronDown, ChevronUp } from "lucide-react";

interface SideBarProps {
  targetIdx: number;
  setTargetIdx: (idx: number) => void;
  leafSections: { id: string; title: string; soon?: boolean }[];
  activeSection: string;
  setActiveSection: (id: string) => void;
  integrationKeys: string[];
  setIntegrationKeys: (keys: string[]) => void;
}

export default function SideBar({
  targetIdx,
  setTargetIdx,
  leafSections,
  activeSection,
  setActiveSection,
  integrationKeys,
  setIntegrationKeys,
}: SideBarProps) {
  // Platform dropdown
  const [platformOpen, setPlatformOpen] = useState(false);
  const platformMenuRef = useRef<HTMLDivElement | null>(null);
  const [platformAnchor, setPlatformAnchor] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (platformOpen && !platformMenuRef.current?.contains(e.target as Node)) {
        setPlatformOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [platformOpen]);

  // Integration popup state (lifted for simplicity)
  const [intgMenuOpen, setIntgMenuOpen] = useState(false);
  const [intgMenuAnchor, setIntgMenuAnchor] = useState<{ x: number; y: number } | null>(null);
  const intgMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (intgMenuOpen && intgMenuRef.current && !intgMenuRef.current.contains(e.target as Node)) {
        setIntgMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [intgMenuOpen]);

  const allIntegrations = availableIntegrations;

  function sortSoonLast(list: typeof allIntegrations): typeof allIntegrations {
    return [...list].sort((a, b) => {
      const aSoon = a.status === "soon" ? 1 : 0;
      const bSoon = b.status === "soon" ? 1 : 0;
      return aSoon - bSoon; // non-soon before soon
    });
  }

  const selectedList = sortSoonLast(allIntegrations.filter((i) => integrationKeys.includes(i.key)));
  const unselectedList = sortSoonLast(allIntegrations.filter((i) => !integrationKeys.includes(i.key)));

  function handleAddIntegration(key: string) {
    console.log("[Integration] Adding", key);
    const next = integrationKeys.includes(key) ? integrationKeys : [...integrationKeys, key];
    setIntegrationKeys(next);
    try {
      localStorage.setItem("buildIdeaSelectedIntegrations", JSON.stringify(next));
    } catch {}
    console.log("[Integration] Added", key, "=>", next);
  }
  function handleRemoveIntegration(key: string) {
    console.log("[Integration] Removing", key);
    const next = integrationKeys.filter((k) => k !== key);
    setIntegrationKeys(next);
    try {
      localStorage.setItem("buildIdeaSelectedIntegrations", JSON.stringify(next));
    } catch {}
    console.log("[Integration] Removed", key, "=>", next);
  }

  return (
    <aside className="hidden lg:block w-64 flex-shrink-0 overflow-x-hidden">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        {/* Platform header */}
        <div className="flex items-center justify-between mb-4 gap-3">
          <PlatformChip
            platform={availablePlatforms[targetIdx]}
            onClick={(e) => {
              const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
              setPlatformAnchor({ x: rect.left, y: rect.bottom });
              setPlatformOpen((o) => !o);
            }}
          />
          {/* Dropdown */}
          {platformOpen && platformAnchor && (
            <div
              ref={platformMenuRef}
              className="fixed w-56 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-72 overflow-y-auto"
              style={{ left: platformAnchor.x, top: platformAnchor.y + 8 }}
            >
              {availablePlatforms.map((p) => {
                const idx = availablePlatforms.findIndex((x) => x.key === p.key);
                const Icon = p.icon;
                return (
                  <button
                    key={p.key}
                    onClick={() => {
                      setTargetIdx(idx);
                      setPlatformOpen(false);
                    }}
                    className={`relative flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${idx === targetIdx ? "bg-gray-100 dark:bg-gray-800/50" : ""}`}
                  >
                    {Icon ? <Icon className="w-4 h-4" /> : null}
                    <span>{p.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Docs nav */}
        <nav className="space-y-2">
          {leafSections
            .filter((s) => ["build-idea", "cursor", "cli"].includes(s.id))
            .map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full text-left px-4 py-2 rounded-lg flex items-center gap-3 transition-all ${
                  activeSection === section.id
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                <span className="text-sm flex-1">{section.title}</span>
              </button>
            ))}
        </nav>

        {/* Integrations section */}
        <div className="mt-6">
          <IntegrationChips
            activeKeys={[]}
            showAllIfEmpty={false}
            stretch={true}
            chunkRows={false}
            onAdd={(e) => {
              const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
              setIntgMenuAnchor({ x: rect.left + rect.width / 2, y: rect.bottom });
              setIntgMenuOpen((o) => !o);
            }}
          />

          {/* Selected */}
          <div className="mt-3">
            <IntegrationChips
              activeKeys={integrationKeys}
              showAllIfEmpty={false}
              stretch={true}
              chunkRows={false}
              onRemove={handleRemoveIntegration}
            />
          </div>
        </div>

        {/* Integration selection menu */}
        {intgMenuOpen && intgMenuAnchor && (
          <div
            ref={intgMenuRef}
            className="fixed z-50 w-56 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-2 max-h-64 overflow-y-auto"
            style={{ left: intgMenuAnchor.x, top: intgMenuAnchor.y + 8 }}
          >
            {unselectedList.map((intg) => {
              const Icon = intg.icon;
              return (
                <div
                  key={intg.key}
                  className="group w-full flex items-center gap-2 px-3 py-1.5 rounded-md text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  <span className="flex-1 text-left text-gray-700 dark:text-gray-200">{intg.label}</span>
                  <button
                    type="button"
                    onClick={() => handleAddIntegration(intg.key)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full hover:bg-gray-300 dark:hover:bg-gray-700"
                  >
                    +
                  </button>
                </div>
              );
            })}

            {selectedList.length > 0 && <div className="my-1 border-t border-gray-200 dark:border-gray-700" />}

            {selectedList.map((intg) => {
              const Icon = intg.icon;
              return (
                <div
                  key={intg.key}
                  className="group w-full flex items-center gap-2 px-3 py-1.5 rounded-md text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  {Icon && <Icon className="w-4 h-4 text-purple-600 dark:text-purple-400" />}
                  <span className="flex-1 text-left text-purple-600 dark:text-purple-400 font-medium">{intg.label}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveIntegration(intg.key)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full hover:bg-gray-300 dark:hover:bg-gray-700"
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
} 