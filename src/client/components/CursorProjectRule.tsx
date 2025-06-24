"use client"

import { useState } from "react"

export default function CursorProjectRule() {
  // ────────────────────────────────────────────────────────────────────────────
  // Local component state
  // ────────────────────────────────────────────────────────────────────────────
  const RULE_CONFIG = {
    Always: {
      defaultDesc: "This rule is attached to every chat and command+k request",
      editable: false,
      label: "Description",
      placeholder: "",
    },
    AutoAttached: {
      defaultDesc: "",
      editable: true,
      label: "File Pattern Matches",
      placeholder: ".tsx, src/config/**/*.json, *Test.cpp, …",
    },
    AgentRequested: {
      defaultDesc: "",
      editable: true,
      label: "Description",
      placeholder: "Description for the task this rule is helpful for",
    },
    Manual: {
      defaultDesc: "This rule needs to be mentioned to be included",
      editable: false,
      label: "Description",
      placeholder: "",
    },
  } as const;

  type RuleType = keyof typeof RULE_CONFIG;

  const [ruleType, setRuleType] = useState<RuleType>("Always");
  const [description, setDescription] = useState<string>(RULE_CONFIG["Always"].defaultDesc);
  const [content, setContent] = useState<string>(`-It is at upmost importance to keep CursorDev to keep the live directory map 100 % accurate;
-Dont add stupid comments on the side the file or folder, just keep it up to date of what it does and what it is used for

# Project Structure - jonstack

jonstack/
├── src/
│   ├── client/
│   │   ├── components/          React UI elements
│   │   │   ├── CreateOrganizationButton.tsx    Button + modal to create orgs
│   │   │   ├── SignInButton.tsx                Log in / log out button with modal
│   │   │   └── SquareUploadButton.tsx          Square image upload component (no inline preview)
│   │   ├── context/             React contexts & providers
│   │   ├── pages/               Route components
│   │   │   └── home.tsx         Landing page with interactive idea input, unique copy, and modern design
│   │   └── ui/                  
│   ├── utils/                   Client-side helpers
│   ├── server/
│   │   ├── db/
│   │   │   ├── queries/         Query helpers
│   │   │   └── schema.ts        Schema for the entire database of the project (add, alter tables - organizations & profiles table)
│   │   └── utils/               Server helpers`)

  const [copySuccess, setCopySuccess] = useState(false)

  // ────────────────────────────────────────────────────────────────────────────
  // Helpers
  // ────────────────────────────────────────────────────────────────────────────
  async function copyToClipboard() {
    const ruleObject = {
      name: "project-structure.mdc",
      rule_type: ruleType,
      other: description,
      body: content,
    } as const;

    try {
      await navigator.clipboard.writeText(JSON.stringify(ruleObject, null, 2))
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (err) {
      console.error("Failed to copy: ", err)
    }
  }

  // Update description when rule type changes
  function handleRuleTypeChange(newType: RuleType) {
    setRuleType(newType);
    setDescription(RULE_CONFIG[newType].defaultDesc);
  }

  const config = RULE_CONFIG[ruleType];

  // ────────────────────────────────────────────────────────────────────────────
  // Render
  // ────────────────────────────────────────────────────────────────────────────
  return (
    <div className="w-full max-w-4xl mx-auto bg-gray-900 text-white font-mono text-sm rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between bg-gray-800 px-4 py-2 border-b border-gray-700">
        <span className="text-gray-300">project-structure.mdc</span>
        <button
          onClick={copyToClipboard}
          className="text-xs px-2 py-1 rounded border border-gray-600 hover:bg-gray-700"
        >
          {copySuccess ? "Copied" : "Copy"}
        </button>
      </div>

      {/* Form Fields */}
      <div className="p-4 space-y-4">
        {/* Select & Description row */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Rule Type */}
          <div className="flex-1 sm:max-w-[160px] space-y-1">
            <label htmlFor="rule-type" className="text-gray-400 text-xs">
              Rule Type
            </label>
            <select
              id="rule-type"
              value={ruleType}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                handleRuleTypeChange(e.target.value as RuleType)
              }
              className="w-full bg-gray-800 border border-gray-700 text-white text-xs px-2 py-1 rounded"
            >
              <option value="Always">Always</option>
              <option value="AutoAttached">Auto-attached</option>
              <option value="AgentRequested">Agent Requested</option>
              <option value="Manual">Manual</option>
            </select>
          </div>

          {/* Description / Pattern */}
          <div className="flex-1 space-y-1">
            <label htmlFor="description" className="text-gray-400 text-xs">
              {config.label}
            </label>
            <input
              id="description"
              type="text"
              value={description}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)}
              className={`w-full bg-gray-800 border border-gray-700 text-gray-200 text-xs px-2 py-1 rounded ${
                !config.editable ? "opacity-60 cursor-not-allowed" : ""
              }`}
              placeholder={config.placeholder}
              disabled={!config.editable}
            />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-1">
          <label htmlFor="content" className="text-gray-400 text-xs">
            Body
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
            className="w-full min-h-[400px] bg-gray-800 border border-gray-700 text-gray-200 text-xs leading-relaxed p-2 rounded resize-y"
          />
        </div>
      </div>
    </div>
  )
}
