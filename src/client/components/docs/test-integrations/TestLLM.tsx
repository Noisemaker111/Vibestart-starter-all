import ChatBox from "@client/components/LLM/ChatBox";

interface Props {
  mode?: "text" | "structured" | "image";
  allowedModes?: ("text" | "structured" | "image")[];
}

export default function DocsTestLLM({ mode = "text", allowedModes }: Props) {
  const allowed = allowedModes && allowedModes.length > 0
    ? allowedModes
    : mode === "text"
      ? ["text"]
      : mode === "structured"
        ? ["structured"]
        : ["image"];

  return (
    <details
      className="mb-10 bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden"
      open
    >
      <summary className="cursor-pointer select-none px-6 py-4 font-semibold text-lg bg-indigo-50 dark:bg-indigo-900/20 flex items-center gap-2">
        <span>LLM Chat</span>
      </summary>
      <div className="p-6">
        <ChatBox defaultMode={mode} allowedModes={allowed as any} />
      </div>
    </details>
  );
}

// Legacy named exports removed (no longer needed)
