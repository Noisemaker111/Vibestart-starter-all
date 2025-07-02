import React, { useState } from "react";
import IntegrationChips from "@client/components/integrations/IntegrationChip";
import PlatformChip from "@client/components/PlatformChip";
import { availablePlatforms } from "@shared/availablePlatforms";
import { availableIntegrations } from "@shared/availableIntegrations";
import ChipDropdownMenu from "@client/components/ChipDropdownMenu";

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
  // Platform dropdown state using reusable menu
  const [platformAnchor, setPlatformAnchor] = useState<{ x: number; y: number } | null>(null);
  const [platformMenuVisible, setPlatformMenuVisible] = useState(false);

  // Integration dropdown state using reusable menu
  const [intgAnchor, setIntgAnchor] = useState<{ x: number; y: number } | null>(null);
  const [intgMenuVisible, setIntgMenuVisible] = useState(false);

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
              setPlatformMenuVisible((v) => !v);
            }}
          />

          {/* Platform selection menu */}
          {platformMenuVisible && platformAnchor && (
            <ChipDropdownMenu
              anchor={platformAnchor}
              items={availablePlatforms.map((p) => ({
                key: p.key,
                label: p.label,
                Icon: p.icon,
                selected: p.key === availablePlatforms[targetIdx].key,
              }))}
              singleSelect
              onToggle={(key) => {
                const idx = availablePlatforms.findIndex((p) => p.key === key);
                if (idx !== -1) setTargetIdx(idx);
              }}
              onClose={() => setPlatformMenuVisible(false)}
            />
          )}
        </div>

        {/* Docs nav */}
        <nav className="space-y-2">
          {leafSections
            .filter((s) => ["build-idea", "cursor"].includes(s.id))
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
              setIntgAnchor({ x: rect.left + rect.width / 2, y: rect.bottom });
              setIntgMenuVisible((v) => !v);
            }}
          />

          {/* Selected integrations list */}
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

        {/* Integrations selection menu */}
        {intgMenuVisible && intgAnchor && (
          <ChipDropdownMenu
            anchor={intgAnchor}
            onClose={() => setIntgMenuVisible(false)}
            onToggle={(key, wasSelected) => {
              if (wasSelected) handleRemoveIntegration(key);
              else handleAddIntegration(key);
            }}
            items={[
              ...unselectedList.map((intg) => ({
                key: intg.key,
                label: intg.label,
                Icon: intg.icon,
                selected: false,
              })),
              ...selectedList.map((intg) => ({
                key: intg.key,
                label: intg.label,
                Icon: intg.icon,
                selected: true,
              })),
            ]}
          />
        )}
      </div>
    </aside>
  );
} 