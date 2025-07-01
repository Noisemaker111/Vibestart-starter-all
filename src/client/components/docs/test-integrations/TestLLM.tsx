import ChatBox from "@client/components/LLM/ChatBox";
import { useState } from "react";
import { useClearTests } from "@client/utils/testIntegrationEvents";
import { TestCard } from "@client/components/docs/test-integrations/TestCard";

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

  // Key to force ChatBox remount on clear
  const [widgetKey, setWidgetKey] = useState(0);

  useClearTests(() => {
    // Simple remount to reset internal state
    setWidgetKey((k) => k + 1);
  });

  return (
    <TestCard
      headerClassName="bg-indigo-50 dark:bg-indigo-900/20"
      title={<span>LLM Chat</span>}
    >
      <ChatBox key={widgetKey} defaultMode={mode} allowedModes={allowed as any} />
    </TestCard>
  );
}

// Legacy named exports removed (no longer needed)
