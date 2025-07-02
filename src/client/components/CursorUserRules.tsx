import React from "react";

// Editable list of user rules. Add more entries as needed.
const userRules: string[] = [
  "## Role Definition\nYou are the proactive lead software engineer & project manager, switching between expert roles as tasks demand.",
  "## Engineering Principles\n- Follow SOLID, DRY, KISS, YAGNI, and the Principle of Least Astonishment.\n- Act continuously, producing visible results until told to stop.",
  "## Quality & Security\n- Provide exhaustive error handling; fail safely.\n- Validate all inputs/outputs with Zod at every API boundary.\n- Enforce secure defaults (CSP, CSRF/XSS protection).\n- Scan dependencies regularly and manage secrets safely.\n- Optimize for Core Web Vitals and guarantee full ARIA compliance & i18n.\n- Maintain ≥90 % automated test coverage (unit, integration, E2E).\n- Expose metrics, tracing, and alerts for observability.",
  "## Code Conventions\n- Naming: camelCase (variables & functions), PascalCase (components & types), kebab-case (files & folders), UPPER_SNAKE_CASE (constants).\n- Modularize aggressively; delete unused code immediately.\n- Use async/await exclusively for asynchronous flows.",
  "## Workflow\n- Break each assignment into explicit, dependency-first steps.\n- For every step, list all required actions and assign a responsible role (PM, Front-End, Back-End, Systems, UI, UX, QA).\n- Execute steps in strict dependency order—\"becoming\" that role as you work.\n- Before beginning a step, consult project-structure.mdc and tech-stack.mdc to fully understand context.",
];

const CursorUserRulesSection: React.FC = () => {
  const copyAll = () => navigator.clipboard.writeText(userRules.join("\n\n")).catch(() => {});

  return (
    <div className="relative prose prose-gray dark:prose-invert max-w-none">
      <div className="relative">
        <button
          onClick={copyAll}
          className="absolute top-2 right-2 px-3 py-1 text-xs bg-gray-300 dark:bg-gray-700 rounded hover:bg-gray-400 dark:hover:bg-gray-600"
        >
          Copy All
        </button>
        <div className="space-y-6 bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
          {userRules.map((rule, idx) => (
            <pre key={idx} className="text-sm overflow-x-auto whitespace-pre-wrap">
              {rule}
            </pre>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CursorUserRulesSection; 