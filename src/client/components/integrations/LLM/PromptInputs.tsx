import React from "react";

type Props = {
  systemPrompt: string;
  userPrompt: string;
  onSystemChange: (v: string) => void;
  onUserChange: (v: string) => void;
};

export default function PromptInputs({ systemPrompt, userPrompt, onSystemChange, onUserChange }: Props) {
  return (
    <div className="flex flex-col gap-3 w-full">
      <textarea
        value={systemPrompt}
        onChange={(e) => onSystemChange(e.target.value)}
        placeholder="System prompt (optional)"
        rows={2}
        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-sm"
      />
      <textarea
        value={userPrompt}
        onChange={(e) => onUserChange(e.target.value)}
        placeholder="User prompt / instructions"
        rows={3}
        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-sm"
      />
    </div>
  );
} 