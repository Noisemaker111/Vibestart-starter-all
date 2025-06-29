import React from "react";
import type { AvailablePlatform } from "@shared/availablePlatforms";
import Badge from "./Badge";

interface PlatformChipProps {
  /** Platform object (from availablePlatforms) to render */
  platform?: AvailablePlatform;
  /** Optional extra Tailwind classes */
  className?: string;
}

/**
 * Visual chip for displaying a single platform with optional icon.
 * Uses a green→teal gradient to distinguish from integration chips.
 */
export default function PlatformChip({ platform, className }: PlatformChipProps) {
  if (!platform) return null;
  const Icon = platform.icon;
  return (
    <span
      className={`relative inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-green-600 to-teal-600 text-white shadow-lg border border-green-500 animate-in fade-in ${
        platform.status === "soon" ? "opacity-70 blur-[1px]" : ""
      } ${className ?? ""}`.trim()}
    >
      {Icon && <Icon className="w-4 h-4" />} {platform.label}
      {platform.status === "soon" && (
        <Badge label="soon" className="top-0 right-0 translate-x-0 -translate-y-1/2" />
      )}
    </span>
  );
} 