"use client"

import React, { useState } from "react";
import { RULE_CONFIG } from "../constants/rule-config";
import type { RuleType } from "../constants/rule-config";
import { DEFAULT_RULE_FILES as FILES } from "../constants/default-rule-files";

export default function CursorProjectRule() {
  // ────────────────────────────────────────────────────────────────────────────
  // Local component state
  // ────────────────────────────────────────────────────────────────────────────

  // Track component state per file index
  const [ruleTypes, setRuleTypes] = useState<string[]>(FILES.map(() => "Always"));
  const [descriptions, setDescriptions] = useState<string[]>(FILES.map(() => RULE_CONFIG.Always.defaultDesc));
  const [contents, setContents] = useState<string[]>(FILES.map(f => f.defaultBody));

  const updateRuleType = (idx: number, newType: keyof typeof RULE_CONFIG) => {
    setRuleTypes(prev => {
      const next = [...prev];
      next[idx] = newType;
      return next;
    });
    setDescriptions(prev => {
      const next = [...prev];
      next[idx] = RULE_CONFIG[newType].defaultDesc;
      return next;
    });
  };

  const copyToClipboard = async (idx: number) => {
    const ruleObject = {
      name: FILES[idx].name,
      rule_type: ruleTypes[idx],
      other: descriptions[idx],
      body: contents[idx]
    } as const;

    try {
      await navigator.clipboard.writeText(JSON.stringify(ruleObject, null, 2));
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  // ────────────────────────────────────────────────────────────────────────────
  // Render
  // ────────────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-10">
      {FILES.map((file, idx) => {
        const ruleKey = ruleTypes[idx] as RuleType;
        const cfg = RULE_CONFIG[ruleKey];

        return (
          <div
            key={file.name}
            className="w-full max-w-4xl mx-auto bg-gray-900 text-white font-mono text-sm rounded-lg overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between bg-gray-800 px-4 py-2 border-b border-gray-700">
              <span className="text-gray-300">{file.name}</span>
              <button
                onClick={() => copyToClipboard(idx)}
                className="text-xs px-2 py-1 rounded border border-gray-600 hover:bg-gray-700"
              >
                Copy
              </button>
            </div>

            {/* Form Fields */}
            <div className="p-4 space-y-4">
              {/* Select & Description row */}
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Rule Type */}
                <div className="flex-1 sm:max-w-[160px] space-y-1">
                  <label htmlFor={`rule-type-${idx}`} className="text-gray-400 text-xs">
                    Rule Type
                  </label>
                  <select
                    id={`rule-type-${idx}`}
                    value={ruleTypes[idx]}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      updateRuleType(idx, e.target.value as RuleType)
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
                  <label htmlFor={`description-${idx}`} className="text-gray-400 text-xs">
                    {cfg.label}
                  </label>
                  <input
                    id={`description-${idx}`}
                    type="text"
                    value={descriptions[idx]}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setDescriptions(prev => {
                        const next = [...prev];
                        next[idx] = e.target.value;
                        return next;
                      })
                    }
                    className={`w-full bg-gray-800 border border-gray-700 text-gray-200 text-xs px-2 py-1 rounded ${
                      !cfg.editable ? "opacity-60 cursor-not-allowed" : ""
                    }`}
                    placeholder={cfg.placeholder}
                    disabled={!cfg.editable}
                  />
                </div>
              </div>

              {/* Content */}
              <div className="space-y-1">
                <label htmlFor={`content-${idx}`} className="text-gray-400 text-xs">
                  Body
                </label>
                <textarea
                  id={`content-${idx}`}
                  value={contents[idx]}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setContents(prev => {
                      const next = [...prev];
                      next[idx] = e.target.value;
                      return next;
                    })
                  }
                  className="w-full min-h-[400px] bg-gray-800 border border-gray-700 text-gray-200 text-xs leading-relaxed p-2 rounded resize-y"
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}