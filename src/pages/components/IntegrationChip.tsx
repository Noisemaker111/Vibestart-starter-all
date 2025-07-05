import React from "react";
import { availableIntegrations } from "@shared/availableIntegrations";
import { X, Plus } from "lucide-react";

const integrations = availableIntegrations;

interface IntegrationChipsProps {
  /** Additional Tailwind classes */
  className?: string;
  /** Keys of integrations that should be considered active. */
  activeKeys?: string[];
  /** When true (default), an empty/undefined activeKeys renders all integrations. */
  showAllIfEmpty?: boolean;
  /** When true, show a pulsating placeholder chip */
  loading?: boolean;
  /** When provided, shows a small ✕ button on each chip that calls this handler */
  onRemove?: (key: string) => void;
  /** When provided, renders an extra trailing "+" chip that invokes this handler when clicked. The click event is forwarded so callers can position popovers. */
  onAdd?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  /** When true, each chip stretches to fill available row space */
  stretch?: boolean;
  /** When false, chips will render in a single flex-wrap row (no fixed row pattern). Defaults to true for existing behaviour. */
  chunkRows?: boolean;
  /** Optional custom row pattern when chunkRows is true */
  rowPattern?: number[];
  /** Override width class for non-stretched chips (e.g., 'w-[200px]') */
  chipWidthClass?: string;
}

export default function IntegrationChips({ className, activeKeys, showAllIfEmpty = true, loading = false, onRemove, onAdd, stretch = false, chunkRows = true, rowPattern, chipWidthClass }: IntegrationChipsProps) {
  /*
   * Determine which keys to render. Behaviour:
   * • undefined  → show ALL integrations (default landing state)
   * • []         → also show ALL integrations (avoids empty UI)
   * • ["foo"]   → attempt to render matching chip, else fallback chip with raw key
   */
  const keysToDisplay: string[] = React.useMemo(() => {
    if (!activeKeys || activeKeys.length === 0) {
      return showAllIfEmpty ? integrations.map((i) => i.key) : [];
    }
    return Array.from(new Set(activeKeys)); // de-duplicate while preserving order
  }, [activeKeys, showAllIfEmpty]);

  // Show keys as-is (no special ordering)
  const orderedKeys = keysToDisplay;

  // Debug helper – only warn when showAllIfEmpty is true and nothing is rendered
  const warnedRef = React.useRef(false);
  if (
    import.meta.env.DEV &&
    showAllIfEmpty &&
    keysToDisplay.length === 0 &&
    !warnedRef.current
  ) {
    console.warn("IntegrationChips: no integrations to display", { activeKeys });
    warnedRef.current = true;
  }

  // If in loading state, render single placeholder chip
  if (loading) {
    return (
      <div className={`flex flex-col gap-3 ${className ?? ""}`.trim()}>
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl text-sm font-medium bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg border border-purple-500 animate-pulse">
          Analyzing…
        </span>
      </div>
    );
  }

  // Helper to render a single chip – avoids duplication between layouts
  const renderChip = (key: string) => {
    const integration = integrations.find((i) => i.key === key);
    const Icon = integration?.icon;
    const label = integration?.label ?? key;

    const widthClass = stretch ? 'flex-1 basis-0 min-w-0' : `flex-none ${chipWidthClass ?? 'w-[168px]'}`;

    return (
      <div
        key={key}
        className={`group relative flex items-center justify-between px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md hover:shadow-lg transition-all duration-300 ease-out hover:scale-[1.02] animate-in fade-in ${widthClass}`}
      >
        {/* Interior glassy overlay */}
        <div className="absolute inset-0 rounded-full bg-white/10 pointer-events-none" />

        <div className="relative flex items-center gap-3 flex-1">
          {Icon && <Icon className="w-4 h-4 text-white/90 flex-shrink-0" />} <span className="text-white font-medium text-base tracking-wide truncate">{label}</span>
        </div>

        {onRemove && (
          <button
            type="button"
            aria-label={`Remove ${label}`}
            onClick={() => onRemove(key)}
            className="relative w-6 h-6 p-0 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-opacity duration-200 opacity-0 group-hover:opacity-100"
          >
            <X className="w-3 h-3 text-white" />
          </button>
        )}

        {/* subtle hover sheen */}
        <div className="absolute inset-0 rounded-full bg-white/5 opacity-0 group-hover:opacity-15 transition-opacity duration-300 pointer-events-none" />
      </div>
    );
  };

  // ───────────────────────────────────────────────────────────
  // Layouts
  // ───────────────────────────────────────────────────────────

  if (!chunkRows) {
    // Simple layout without fixed pattern. If stretch=true, stack vertically; else wrap.
    const containerClasses = stretch ? 'flex flex-col gap-3' : 'flex flex-row flex-wrap gap-3 justify-center';

    return (
      <div className={`${containerClasses} ${className ?? ''}`.trim()}>
        {orderedKeys.map(renderChip)}

        {onAdd && (
          <button
            type="button"
            onClick={(e) => onAdd(e)}
            className={`group relative flex items-center justify-center px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md hover:shadow-lg transition-all duration-300 ease-out hover:scale-[1.02] ${stretch ? 'w-full' : 'w-[168px]'}`}
          >
            <div className="absolute inset-0 rounded-full bg-white/10 pointer-events-none" />

            <Plus className="w-6 h-6 text-white" />
            <span className="ml-2 text-base font-medium">Add Integrations</span>
          </button>
        )}
      </div>
    );
  }

  // Default: 4-3-4 pattern
  const pattern = rowPattern && rowPattern.length > 0 ? rowPattern : [4, 3, 4];
  const rows: string[][] = [];
  let idx = 0;
  for (const count of pattern) {
    if (idx >= orderedKeys.length) break;
    rows.push(orderedKeys.slice(idx, idx + count));
    idx += count;
  }
  if (idx < orderedKeys.length) {
    rows.push(orderedKeys.slice(idx));
  }

  return (
    <div className={`flex flex-col gap-3 ${className ?? ''}`.trim()}>
      {rows.map((row, rowIdx) => (
        <div key={rowIdx} className="flex flex-row flex-wrap gap-3 w-full justify-center">
          {row.map(renderChip)}
        </div>
      ))}

      {onAdd && (
        <button
          type="button"
          onClick={(e) => onAdd(e)}
          className={`group relative flex items-center justify-center px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md hover:shadow-lg transition-all duration-300 ease-out hover:scale-[1.02] ${stretch ? 'w-full' : 'w-[168px]'}`}
        >
          <div className="absolute inset-0 rounded-full bg-white/10 pointer-events-none" />

          <Plus className="w-6 h-6 text-white" />
          <span className="ml-2 text-base font-medium">Add Integrations</span>
        </button>
      )}
    </div>
  );
} 