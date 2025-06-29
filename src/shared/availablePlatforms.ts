import type { ComponentType } from "react";
import {
  Globe,
  Smartphone,
  Gamepad2,
  Monitor,
  Plug,
  Terminal,
  Watch as WatchIcon,
  Box,
} from "lucide-react";
import { FaDiscord, FaTelegramPlane, FaCode } from "react-icons/fa";

export interface AvailablePlatform {
  key: string;
  label: string;
  /** Optional icon component for UI usage */
  icon?: ComponentType<{ className?: string }>;
  /** Availability status (e.g., available now, soon, or far in the roadmap) */
  status?: "available" | "soon";
}

export const availablePlatforms: readonly AvailablePlatform[] = [
  { key: "web", label: "Web", icon: Globe, status: "available" },
  { key: "mobile-app", label: "Mobile App", icon: Smartphone, status: "available" },
  { key: "desktop", label: "Desktop App", icon: Monitor, status: "available" },
  { key: "mobile-game", label: "Mobile Game", icon: Gamepad2, status: "soon" },
  { key: "desktop-game", label: "Desktop Game", icon: Gamepad2, status: "soon" },
  { key: "discord", label: "Discord Bot", icon: FaDiscord, status: "soon" },
  { key: "telegram", label: "Telegram Bot", icon: FaTelegramPlane, status: "soon" },
  { key: "extension", label: "Browser Extension", icon: Plug, status: "soon" },
  { key: "vscode", label: "VS Code Extension", icon: FaCode, status: "soon" },
  { key: "cli", label: "CLI", icon: Terminal, status: "soon" },
  { key: "watch", label: "Watch", icon: WatchIcon, status: "soon" },
  { key: "arvr", label: "AR/VR", icon: Box, status: "soon" },
] as const;

export type AvailablePlatformKey = typeof availablePlatforms[number]["key"];

// Convenience list of platform keys
export const availablePlatformKeys: readonly AvailablePlatformKey[] = availablePlatforms.map(
  (platform) => platform.key
) as AvailablePlatformKey[]; 