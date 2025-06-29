import React from "react";

interface SoonBadgeProps {
  /** Optional extra Tailwind classes */
  className?: string;
}

/**
 * SoonBadge pins a small "soon" label to the top-right of a relative parent.
 * Place it as a child of a container with `relative` positioning.
 */
export default function SoonBadge({ className }: SoonBadgeProps) {
  return (
    <span
      className={`pointer-events-none select-none absolute -top-1 -right-1 translate-x-1/2 -translate-y-1/2 bg-purple-900/50 text-purple-300 text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded-md ${className ?? ""}`.trim()}
    >
      soon
    </span>
  );
} 