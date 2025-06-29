export type RuleItem = {
  /** Unique identifier for the rule */
  id: string;
  /** Detailed description of the rule */
  description: string;
};

export type Platform = string;
export type Integration = string;

export interface ProjectRules {
  /** Rules that apply to all platforms and integrations */
  global: RuleItem[];
  /** Platform-specific rules */
  byPlatform: Record<Platform, RuleItem[]>;
  /** Integration-
   * 
   * these are all my project rules, they are for web and all integrations currently available
   * 
   * 
   * 
   * 
   * 
   * 
   * specific rules */
  byIntegration: Record<Integration, RuleItem[]>;
}

export const projectRules: ProjectRules = {
  global: [],
  byPlatform: {},
  byIntegration: {},
}; 