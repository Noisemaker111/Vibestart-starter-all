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
}

export const availablePlatforms: readonly AvailablePlatform[] = [
  { key: "web", label: "Web", icon: Globe },
  { key: "mobile-app", label: "Mobile App", icon: Smartphone },
  { key: "mobile-game", label: "Mobile Game", icon: Gamepad2 },
  { key: "desktop", label: "Desktop", icon: Monitor },
  { key: "desktop-game", label: "Desktop Game", icon: Gamepad2 },
  { key: "app", label: "App", icon: Smartphone },
  { key: "game", label: "Game", icon: Gamepad2 },
  { key: "discord", label: "Discord Bot", icon: FaDiscord },
  { key: "telegram", label: "Telegram Bot", icon: FaTelegramPlane },
  { key: "extension", label: "Browser Extension", icon: Plug },
  { key: "vscode", label: "VS Code Extension", icon: FaCode },
  { key: "cli", label: "CLI", icon: Terminal },
  { key: "watch", label: "Watch", icon: WatchIcon },
  { key: "arvr", label: "AR/VR", icon: Box },
] as const;

export type AvailablePlatformKey = typeof availablePlatforms[number]["key"];

// Convenience list of platform keys
export const availablePlatformKeys: readonly AvailablePlatformKey[] = availablePlatforms.map(
  (platform) => platform.key
) as AvailablePlatformKey[]; 