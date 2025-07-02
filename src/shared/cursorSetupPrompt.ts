import { cursorMemories } from "@shared/cursorMemories";

export interface CursorSetupPromptOptions {
  projectStructureMdc: string;
  techStackMdc: string;
  setupCommands: string;
  memories: string[];
}
export function buildCursorSetupPrompt({
  projectStructureMdc,
  techStackMdc,
  setupCommands,
  memories = cursorMemories,
}: CursorSetupPromptOptions): string {
  const memoryCommands = memories.map((m) => `/Create Memory\n${m}`).join("\n\n");

  return `${memoryCommands}\n\n/Generate Cursor Rules\n\n<project-structure.mdc>\n${projectStructureMdc}\n\n<tech-stack.mdc>\n${techStackMdc}\n\n/Setup Project\n${setupCommands}`;
} 