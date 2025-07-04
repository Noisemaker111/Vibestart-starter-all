import React from "react";
import type { AvailablePlatform } from "@shared/availablePlatforms";

interface PlatformChipProps {
  /** Platform object (from availablePlatforms) to render */
  platform?: AvailablePlatform;
  /** Optional extra Tailwind classes */
  className?: string;
  /** Click handler to make the chip interactive */
  onClick?: (e: React.MouseEvent<HTMLButtonElement | HTMLSpanElement>) => void;
}

/**
 * Visual chip for displaying a single platform with optional icon.
 * Uses a green→teal gradient to distinguish from integration chips.
 */
export default function PlatformChip({ platform, className, onClick }: PlatformChipProps) {
  if (!platform) return null;
  const Icon = platform.icon;
  const commonClasses = `group relative flex items-center gap-3 px-5 py-2 rounded-full bg-gradient-to-r from-green-500 to-teal-600 text-white shadow-md hover:shadow-lg transition-all duration-300 ease-out hover:scale-[1.03] animate-in fade-in ${className ?? ""}`.trim();

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={commonClasses}>
        {/* Interior glassy overlay */}
        <div className="absolute inset-0 rounded-full bg-white/10 backdrop-blur-sm pointer-events-none" />

        <div className="relative flex items-center gap-3 flex-1">
          {Icon && <Icon className="w-4 h-4 text-white/90 flex-shrink-0" />} {platform.label}
        </div>

        {/* Hover sheen */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      </button>
    );
  }

  return (
    <span className={commonClasses}>
      {/* Interior glassy overlay */}
      <div className="absolute inset-0 rounded-full bg-white/10 backdrop-blur-sm pointer-events-none" />

      <div className="relative inline-flex items-center gap-3">
        {Icon && <Icon className="w-4 h-4 text-white/90 flex-shrink-0" />} {platform.label}
      </div>

      {/* Hover sheen (still apply on non-interactive for consistency) */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </span>
  );
} 