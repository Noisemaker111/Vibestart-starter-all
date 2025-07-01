import React from "react";

interface TestCardProps {
  title: React.ReactNode;
  headerClassName?: string;
  className?: string;
  children: React.ReactNode;
}

/**
 * Generic wrapper used by the docs test integration widgets. Replaces the old
 * <details>/<summary> approach with a persistent card layout.
 */
export function TestCard({ title, headerClassName = "", className = "", children }: TestCardProps) {
  return (
    <div className={`mb-10 bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden ${className}`.trim()}>
      <div
        className={`px-6 py-4 font-semibold text-lg flex items-center gap-2 ${headerClassName}`.trim()}
      >
        {title}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
} 