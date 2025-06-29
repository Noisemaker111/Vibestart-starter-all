export type MemoryItem = {
  /** Unique identifier for this memory */
  id: string;
  /** Description or details of the memory */
  description: string;
};

// Supported platform identifiers, extend as needed (e.g., 'ios', 'android').
export type Platform = string;
// Supported third-party integration identifiers (e.g., 'supabase', 'stripe').
export type Integration = string;

export interface ContextualMemories {
  /** Memories that apply globally, regardless of platform or integration */
  global: MemoryItem[];
  /** Platform-specific memories (keyed by platform id) */
  byPlatform: Record<Platform, MemoryItem[]>;
  /** Integration-specific memories (keyed by integration id) */
  byIntegration: Record<Integration, MemoryItem[]>;
}

/**
 * Central store of all contextual memories.
 * 
 * 
 * these are all my memories, they are for web and all integrations currently available
 *
 * Always reply in concise, plain English. Avoid verbose Markdown or unnecessary context that inflates character count; include only information essential to the user's request.
 * All current and future tasks must be recorded and maintained in .cursor/rules/tasks.mdc. When the user asks to create or manage tasks, update this file accordingly with structured prompts.
 * Whenever the tech stack, integration names, versions, or other relevant tech details change, ensure the tech-stack.mdc documentation is updated accordingly.
 * Whenever a file is added, deleted, renamed, or moved in the project, ensure the project-structure.mdc documentation is updated to reflect the new structure.
 * All token bucket / rate-limit logic should live in the shared rateLimit utilities, never inside individual components.
 * 
 * 
 * 
 * NOTE: Populate these arrays at build-time or dynamically load them from an
 * external source if you need runtime extensibility.
 */
export const memories: ContextualMemories = {
  global: [],
  byPlatform: {},
  byIntegration: {},
}; 