import type { ComponentType } from "react";
import { Globe, Smartphone, Monitor } from "lucide-react";

export interface AvailablePlatform {
  key: string;
  label: string;
  /** Optional icon component for UI usage */
  icon?: ComponentType<{ className?: string }>;
  /** Availability status (e.g., available now, soon, or far in the roadmap) */
  status?: "available" | "soon";
}

export const availablePlatforms: readonly AvailablePlatform[] = [
  { key: "website", label: "Website", icon: Globe, status: "available" },
  { key: "mobile-app", label: "Mobile App", icon: Smartphone, status: "available" },
  { key: "desktop-app", label: "Desktop App", icon: Monitor, status: "available" },
] as const;

export type AvailablePlatformKey = typeof availablePlatforms[number]["key"];

// Convenience list of platform keys
export const availablePlatformKeys: readonly AvailablePlatformKey[] = availablePlatforms.map(
  (platform) => platform.key
) as AvailablePlatformKey[]; 