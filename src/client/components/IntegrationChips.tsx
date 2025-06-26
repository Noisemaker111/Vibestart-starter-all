import React from "react";
import { INTEGRATIONS } from "@shared/integrations";

const integrations = INTEGRATIONS;

interface IntegrationChipsProps {
  /** Additional Tailwind classes */
  className?: string;
  /** Keys of integrations that should be considered active. When omitted, all are active. */
  activeKeys?: string[];
}

export default function IntegrationChips({ className, activeKeys }: IntegrationChipsProps) {
  // Treat no activeKeys prop as "all active"
  const activeSet = new Set(activeKeys ?? integrations.map((i) => i.key));

  return (
    <div className={`flex flex-wrap gap-2 ${className ?? ""}`.trim()}>
      {integrations
        .filter((i) => activeSet.has(i.key))
        .map((i) => {
          const Icon = i.icon;
          return (
            <span
              key={i.key}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg border border-purple-500 animate-in fade-in"
            >
              {Icon && <Icon className="w-4 h-4" />} {i.label}
            </span>
          );
        })}
    </div>
  );
} 