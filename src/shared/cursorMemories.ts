export const cursorMemories: string[] = [
  "The user wants interval/timer values to live in a central constants file rather than hard-coded in components.",
  "The user prefers components/files be renamed to context-appropriate, accurate names and is always willing to change names to improve clarity.",
  "The user prefers code that is self-explanatory and avoids unnecessary comments.",
  "Always reply in concise, plain English. Avoid verbose Markdown or unnecessary context that inflates character count; include only information essential to the user's request.",
  "Whenever the tech stack, integration names, versions, or other relevant tech details change, ensure the tech-stack.mdc documentation is updated accordingly.",
  "Whenever a file is added, deleted, renamed, or moved in the project, ensure the <project-structure> documentation is updated to reflect the new structure/naming.",
  "All token bucket / rate-limit logic should live in the shared rateLimit utilities, never inside individual components.",
  "Do not create a dedicated folder or file just for type definitions; integrate types near their relevant code instead.",
  "When the user types 'run', 'start project', or similar, automatically execute 'npm run dev'; if they say 'stop' or 'close', terminate the dev server.",
]; 