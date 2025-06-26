import type { Integration } from "@shared/integrations";

export type { Integration };

export type SpecificationResponse = {
  specification: string; // refined idea or spec paragraph
  platform?: string;
  integrations: Integration[];
}; 