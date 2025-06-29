export type UserRule = {
  id: string;
  description: string;
};

export type Platform = string;
export type Integration = string;

export interface UserRules {
  global: UserRule[];
  byPlatform: Record<Platform, UserRule[]>;
  byIntegration: Record<Integration, UserRule[]>;
}

export const userRules: UserRules = {
  global: [],
  byPlatform: {},
  byIntegration: {},
}; 