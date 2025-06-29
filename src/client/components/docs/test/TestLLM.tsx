import { useState } from "react";
import { processIdea } from "@client/utils/integrationTool";
import { DEFAULT_MODEL } from "@client/utils/integrationTool";


export default function DocsTestLLM() {
  const [llmIdea, setLlmIdea] = useState("");
  const [selectedModel, setSelectedModel] = useState<string>(DEFAULT_MODEL);
  const [llmOutput, setLlmOutput] = useState<string>("");

  async function runLlmChat() {
    if (!llmIdea.trim()) return;
    try {
      const res = await processIdea(llmIdea.trim(), selectedModel);
      const { platform, integrations, error } = res;
      setLlmOutput(
        JSON.stringify(
          {
            platform,
            integrations: integrations.map((i: any) => i.key),
            ...(error ? { error } : {}),
          },
          null,
          2
        )
      );
    } catch (err: any) {
      setLlmOutput(`Error: ${err.message || String(err)}`);
    }
  }

  // Only render the interactive chat in development builds
  if (!import.meta.env.DEV) {
    return (
      <details className="mb-10 bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
        <summary className="cursor-pointer select-none px-6 py-4 font-semibold text-lg bg-indigo-50 dark:bg-indigo-900/20 flex items-center gap-2">
          <span>LLM Chat</span>
          <span className="ml-2 bg-yellow-900/30 text-yellow-300 text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded-md">soon</span>
        </summary>
        <div className="p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">Feature coming soon.</p>
        </div>
      </details>
    );
  }

  return (
    <details className="mb-10 bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
      <summary className="cursor-pointer select-none px-6 py-4 font-semibold text-lg bg-indigo-50 dark:bg-indigo-900/20 flex items-center gap-2">
        <span>LLM Chat</span>
      </summary>
      <div className="p-6 space-y-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium" htmlFor="model-select">
              Model:
            </label>
            <select
              id="model-select"
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="input max-w-xs py-1 px-2 text-sm"
            >
            </select>
          </div>
          <textarea
            value={llmIdea}
            onChange={(e) => setLlmIdea(e.target.value)}
            placeholder="Your idea…"
            rows={3}
            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg"
          />

          <div className="flex flex-wrap gap-3">
            <button onClick={runLlmChat} className="btn-primary">
              Run LLM Chat
            </button>
          </div>

          <pre className="bg-gray-900 text-gray-100 text-xs p-4 rounded-lg overflow-x-auto min-h-[160px]">
            {llmOutput || "Output will appear here…"}
          </pre>
        </div>
      </div>
    </details>
  );
}
