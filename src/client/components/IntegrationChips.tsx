import React from "react";
import { availableIntegrations } from "@shared/availableIntegrations";
import SoonBadge from "./SoonBadge";

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
}

export default function IntegrationChips({ className, activeKeys, showAllIfEmpty = true, loading = false }: IntegrationChipsProps) {
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
            className={`relative inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg border border-purple-500 animate-in fade-in ${integration?.status === "soon" ? "opacity-70 blur-[1px]" : ""}`}
          >
            {Icon && <Icon className="w-4 h-4" />} {label}
            {integration?.status === "soon" && <SoonBadge className="top-0 right-0 translate-x-0 -translate-y-1/2" />}
          </span>
        );
      })}
    </div>
  );
} 