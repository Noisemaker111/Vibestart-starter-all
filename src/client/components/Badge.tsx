import React from "react";

interface BadgeProps {
  /** Text to display inside the badge */
  label: string;
  /** Optional extra Tailwind classes */
  className?: string;
}

/**
 * Generic small badge that pins to the top-right of a relative parent.
 */
export default function Badge({ label, className }: BadgeProps) {
  return (
    <span
      className={`pointer-events-none select-none absolute -top-1 -right-1 translate-x-1/2 -translate-y-1/2 bg-purple-900/50 text-purple-300 text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded-md ${className ?? ""}`.trim()}
    >
      {label}
    </span>
  );
} 