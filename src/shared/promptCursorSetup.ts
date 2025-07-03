export * from "./cursorSetupPrompt"; // Re-export existing

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
  return `${prefix}/Generate Claude Rules\n\n<project-structure.mdc>\n${projectStructureMdc}\n\n<tech-stack.mdc>\n${techStackMdc}\n\n/Setup Project\n${setupCommands}`;
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
  return `${prefix}/Generate Gemini Rules\n\n<project-structure.mdc>\n${projectStructureMdc}\n\n<tech-stack.mdc>\n${techStackMdc}\n\n/Setup Project\n${setupCommands}`;
} 