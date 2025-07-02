// cursorMemories removed – default memories list now empty

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
  memories = [],
}: CursorSetupPromptOptions): string {
  const memoryCommands = `/Create Memory\n${memories.join("\n\n")}`;

  return `${memoryCommands}\n\n/Generate Cursor Rules\n\n<project-structure.mdc>\n${projectStructureMdc}\n\n<tech-stack.mdc>\n${techStackMdc}\n\n/Setup Project\n${setupCommands}`;
} 