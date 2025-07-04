import type { ComponentType } from "react";
import { Globe, Smartphone, Monitor } from "lucide-react";

export interface AvailablePlatform {
  key: string;
  label: string;
  /** Optional icon component for UI usage */
  icon?: ComponentType<{ className?: string }>;
}

export const availablePlatforms: readonly AvailablePlatform[] = [
  { key: "website", label: "Website", icon: Globe },
  { key: "mobile-app", label: "Mobile App", icon: Smartphone },
  { key: "desktop-app", label: "Desktop App", icon: Monitor },
] as const;

export type AvailablePlatformKey = typeof availablePlatforms[number]["key"];

// Convenience list of platform keys
export const availablePlatformKeys: readonly AvailablePlatformKey[] = availablePlatforms.map(
  (platform) => platform.key
) as AvailablePlatformKey[]; 