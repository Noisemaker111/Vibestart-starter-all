export const cursorMemories: string[] = [
  "The user prefers to have explicit console.log statements at the start and end of significant operations (e.g., clicking things, making funtions or actions work) for debugging.",
  "Whenever a new client page or API endpoint is created, ensure src/client/routes.ts is updated to include the new route so navigation/build pipeline works.",
  "The user wants interval/timer values to live in a central constants file rather than hard-coded in components.",
  "The user prefers code that is self-explanatory and avoids unnecessary comments.",
  "All token bucket / rate-limit logic should live in the shared rateLimit utilities, never inside individual components.",
  "Do not create a dedicated folder or file just for type definitions; integrate types near their relevant code instead.",
  "When the user types 'run', 'start project', or similar, automatically execute 'npm run dev'; if they say 'stop' or 'close', terminate the dev server. If you think its their first time make sure they run 'npm run db:migrate' first.",
]; 