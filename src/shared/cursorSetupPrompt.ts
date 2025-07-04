// Default memory list – can be populated with initial memory entries as needed
export const cursorMemories: string[] = [];

export interface CursorSetupPromptOptions {
  projectStructureMdc: string;
  techStackMdc: string;
  setupCommands: string;
  memories?: string[];
}
export function promptCursorSetup({
  projectStructureMdc,
  techStackMdc,
  setupCommands,
  memories = cursorMemories,
}: CursorSetupPromptOptions): string {
  const memoryCommands = memories.length
    ? memories.map((m) => `/generate memory
${m}`).join("\n\n")
    : "";

  const prefix = memoryCommands ? `${memoryCommands}

` : "";

  return `${prefix}/Generate Cursor Rules

<project-structure.mdc>
${projectStructureMdc}

<tech-stack.mdc>
${techStackMdc}

/Setup Project
${setupCommands}`;
}

// Additional setup prompts for Claude and Gemini

export interface GenericSetupPromptOptions {
  projectStructureMdc: string;
  techStackMdc: string;
  setupCommands: string;
  memories?: string[];
}

export function promptClaudeSetup({
  projectStructureMdc,
  techStackMdc,
  setupCommands,
  memories = [],
}: GenericSetupPromptOptions): string {
  const memoryCommands = memories.length
    ? memories.map((m) => `/generate memory
${m}`).join("\n\n")
    : "";
  const prefix = memoryCommands ? `${memoryCommands}

` : "";
  return `${prefix}/Generate Claude Rules

<project-structure.mdc>
${projectStructureMdc}

<tech-stack.mdc>
${techStackMdc}

/Setup Project
${setupCommands}`;
}

export function promptGeminiSetup({
  projectStructureMdc,
  techStackMdc,
  setupCommands,
  memories = [],
}: GenericSetupPromptOptions): string {
  const memoryCommands = memories.length
    ? memories.map((m) => `/generate memory
${m}`).join("\n\n")
    : "";
  const prefix = memoryCommands ? `${memoryCommands}

` : "";
  return `${prefix}/Generate Gemini Rules

<project-structure.mdc>
${projectStructureMdc}

<tech-stack.mdc>
${techStackMdc}

/Setup Project
${setupCommands}`;
}