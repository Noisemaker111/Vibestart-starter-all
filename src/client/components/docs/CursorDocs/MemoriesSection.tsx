import React from "react";

// Static memories copied from original memories.md (IDs removed)
const memoriesRaw = `The user prefers components/files be renamed to context-appropriate, accurate names and is always willing to change names to improve clarity.

The user prefers code that is self-explanatory and avoids unnecessary comments.

Always reply in concise, plain English. Avoid verbose Markdown or unnecessary context that inflates character count; include only information essential to the user's request.

Whenever the tech stack, integration names, versions, or other relevant tech details change, ensure the tech-stack.mdc documentation is updated accordingly.

Whenever a file is added, deleted, renamed, or moved in the project, ensure the <project-structure> documentation is updated to reflect the new structure/naming.

All token bucket / rate-limit logic should live in the shared rateLimit utilities, never inside individual components.

Do not create a dedicated folder or file just for type definitions; integrate types near their relevant code instead.`;

const parseMemories = (): string[] => {
  return memoriesRaw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
};

const MemoriesSection: React.FC = () => {
  const memories = React.useMemo(() => parseMemories(), []);

  return (
    <div className="prose prose-gray dark:prose-invert max-w-none">
      <h1 className="text-3xl font-bold mb-6">Memories</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Cursor stores small pieces of knowledge as <em>memories</em>. They act like sticky-notes the AI can reference in future sessions.
      </p>
      <div className="space-y-6">
        {memories.map((text, idx) => (
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