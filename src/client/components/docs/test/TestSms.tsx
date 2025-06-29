import React from "react";

export default function DocsTestSms() {
  return (
    <details className="mb-10 bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
      <summary className="cursor-pointer select-none px-6 py-4 font-semibold text-lg bg-amber-50 dark:bg-amber-900/20 flex items-center gap-2">
        <span>SMS</span>
        <span className="ml-2 bg-yellow-900/30 text-yellow-300 text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded-md">soon</span>
      </summary>
      <div className="p-6">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          SMS integration tests will be added here.
        </p>
      </div>
    </details>
  );
} 