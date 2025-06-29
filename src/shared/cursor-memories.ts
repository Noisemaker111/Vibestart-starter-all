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

export const memories: ContextualMemories = {
  global: [],
  byPlatform: {},
  byIntegration: {},
}; 