export const vibestartMemories: string[] = [];

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
  memories = vibestartMemories,
}: CursorSetupPromptOptions): string {
  const memoryCommands = memories.length
    ? memories.map((m) => `/generate memory\n${m}`).join("\n\n")
    : "";

  const prefix = memoryCommands ? `${memoryCommands}\n\n` : "";

  return `${prefix}/Generate VibeStart Rules

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
    ? memories.map((m) => `/generate memory\n${m}`).join("\n\n")
    : "";
  const prefix = memoryCommands ? `${memoryCommands}\n\n` : "";
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
    ? memories.map((m) => `/generate memory\n${m}`).join("\n\n")
    : "";
  const prefix = memoryCommands ? `${memoryCommands}\n\n` : "";
  return `${prefix}/Generate Gemini Rules

<project-structure.mdc>
${projectStructureMdc}

<tech-stack.mdc>
${techStackMdc}

/Setup Project
${setupCommands}`;
}