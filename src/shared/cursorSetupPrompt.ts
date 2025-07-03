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
    ? memories.map((m) => `/generate memory\n${m}`).join("\n\n")
    : "";

  const prefix = memoryCommands ? `${memoryCommands}\n\n` : "";

  return `${prefix}/Generate Cursor Rules\n\n<project-structure.mdc>\n${projectStructureMdc}\n\n<tech-stack.mdc>\n${techStackMdc}\n\n/Setup Project\n${setupCommands}`;
} 