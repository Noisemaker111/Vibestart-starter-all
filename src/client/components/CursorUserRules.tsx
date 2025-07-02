import React from "react";
import { USER_RULES } from "@shared/user-rules";

const CursorUserRulesSection: React.FC = () => {
  const copyAll = () => navigator.clipboard.writeText(USER_RULES).catch(() => {});

  return (
    <div className="relative prose prose-gray dark:prose-invert max-w-none">
      <div className="relative">
        <button
          onClick={copyAll}
          className="absolute top-2 right-2 px-3 py-1 text-xs bg-gray-300 dark:bg-gray-700 rounded hover:bg-gray-400 dark:hover:bg-gray-600"
        >
          Copy All
        </button>
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
          <pre className="text-sm overflow-x-auto whitespace-pre-wrap">
            {USER_RULES}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default CursorUserRulesSection; 