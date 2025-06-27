import type { ComponentType } from "react";
import {
  Database,
  Fingerprint,
  LogIn,
  Shield,
  Brain,
  Upload,
  CreditCard,
  MessageCircle,
  Bell,
  BarChart3,
  MapPin,
  Search as SearchIcon,
} from "lucide-react";

import { FaDiscord } from "react-icons/fa";

export interface AvailableIntegration {
  key: string;
  label: string;
  /** Optional icon component for UI usage */
  icon?: ComponentType<{ className?: string }>;
}

export const availableIntegrations: readonly AvailableIntegration[] = [
  { key: "database", label: "Database", icon: Database },
  { key: "solana", label: "Solana Sign In", icon: Fingerprint },
  { key: "google", label: "Google Sign In", icon: LogIn },
  { key: "github", label: "GitHub Sign In", icon: Shield },
  { key: "discord", label: "Discord Sign In", icon: FaDiscord },  
  { key: "llm", label: "LLM Chatbox", icon: Brain },
  { key: "uploads", label: "Uploads", icon: Upload },
  { key: "billing", label: "Billing", icon: CreditCard },
  { key: "realtime", label: "Realtime Messaging", icon: MessageCircle },
  { key: "notifications", label: "Notifications", icon: Bell },
  { key: "analytics", label: "Analytics", icon: BarChart3 },
  { key: "maps", label: "Maps", icon: MapPin },
  { key: "search", label: "Search", icon: SearchIcon },
] as const;

export type AvailableIntegrationKey = typeof availableIntegrations[number]["key"]; 