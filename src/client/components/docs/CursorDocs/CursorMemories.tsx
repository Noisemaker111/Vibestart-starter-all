import React from "react";
import { cursorMemories as memories } from "@shared/cursorMemories";

const MemoriesSection: React.FC = () => {
  // Memo not strictly necessary but keeps render deterministic if we later derive state.
  const memoriesList = React.useMemo(() => memories, []);

  return (
    <div className="prose prose-gray dark:prose-invert max-w-none">
      <h1 className="text-3xl font-bold mb-6">Memories</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Cursor stores small pieces of knowledge as <em>memories</em>. They act like sticky-notes the AI can reference in future sessions.
      </p>
      <div className="space-y-6">
        {memoriesList.map((text, idx) => (
          <div
            key={idx}
            className="relative bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-sm"
          >
            <button
              onClick={() => navigator.clipboard.writeText(text).catch(() => {})}
              className="absolute top-2 right-2 px-2 py-0.5 text-xs bg-gray-300 dark:bg-gray-700 rounded hover:bg-gray-400 dark:hover:bg-gray-600"
            >
              Copy
            </button>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MemoriesSection; 