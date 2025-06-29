import React from "react";
import { availableIntegrations } from "@shared/availableIntegrations";
import Badge from "./Badge";
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
  /** When provided, renders an extra trailing "+" chip that invokes this handler when clicked */
  onAdd?: () => void;
}

export default function IntegrationChips({ className, activeKeys, showAllIfEmpty = true, loading = false, onRemove, onAdd }: IntegrationChipsProps) {
  /*
   * Determine which keys to render. Behaviour:
   * • undefined  → show ALL integrations (default landing state)
   * • []         → also show ALL integrations (avoids empty UI)
   * • ["foo"]   → attempt to render matching chip, else fallback chip with raw key
   */
  const keysToDisplay: string[] = (() => {
    if ((!activeKeys || activeKeys.length === 0)) {
      return showAllIfEmpty ? integrations.map((i) => i.key) : [];
    }
    return Array.from(new Set(activeKeys)); // de-duplicate while preserving order
  })();

  // Debug helper when nothing is rendered unexpectedly
  const warnedRef = React.useRef(false);
  if (import.meta.env.DEV && keysToDisplay.length === 0 && !warnedRef.current) {
    console.warn("IntegrationChips: no integrations to display", { activeKeys });
    warnedRef.current = true;
  }

  // If in loading state, render single placeholder chip
  if (loading) {
    return (
      <div className={`flex flex-wrap gap-3 ${className ?? ""}`.trim()}>
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg border border-purple-500 animate-pulse">
          Analyzing…
        </span>
      </div>
    );
  }

  return (
    <div className={`flex flex-wrap gap-3 ${className ?? ""}`.trim()}>
      {keysToDisplay.map((key) => {
        const integration = integrations.find((i) => i.key === key);
        const Icon = integration?.icon;
        const label = integration?.label ?? key;
        return (
          <span
            key={key}
            className={`relative inline-flex items-center gap-1 pl-3 ${onRemove ? "pr-6" : "pr-3"} py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg border border-purple-500 animate-in fade-in ${integration?.status === "soon" ? "opacity-70 blur-[1px]" : ""}`}
          >
            {Icon && <Icon className="w-4 h-4" />} {label}
            {integration?.status === "soon" && (
              <Badge label="soon" className="top-0 right-0 translate-x-0 -translate-y-1/2" />
            )}
            {onRemove && (
              <button
                type="button"
                aria-label={`Remove ${label}`}
                onClick={() => onRemove(key)}
                className="absolute right-0 top-1/2 -translate-y-1/2 mr-1 rounded-full hover:bg-black/20 focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </span>
        );
      })}
      {onAdd && (
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-600 to-blue-600 text-white border border-purple-500 hover:opacity-80 transition animate-in fade-in"
        >
          <Plus className="w-4 h-4" /> Add
        </button>
      )}
    </div>
  );
} 