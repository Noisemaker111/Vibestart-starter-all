export const RULE_CONFIG = {
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

export type RuleType = keyof typeof RULE_CONFIG; 