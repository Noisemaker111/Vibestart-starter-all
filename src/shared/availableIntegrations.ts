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
  Plug,
  Mail,
  File,
} from "lucide-react";

import { FaDiscord } from "react-icons/fa";

export interface AvailableIntegration {
  key: string;
  label: string;
  /** Optional icon component for UI usage */
  icon?: ComponentType<{ className?: string }>;
  /** Availability status */
  status?: "available" | "soon";
}

export const availableIntegrations: readonly AvailableIntegration[] = [
  { key: "database", label: "Database", icon: Database, status: "available" },
  { key: "uploads", label: "Uploads", icon: Upload, status: "available" },
  { key: "solana", label: "Solana Sign In", icon: Fingerprint, status: "available" },
  { key: "google", label: "Google Sign In", icon: LogIn, status: "available" },
  { key: "github", label: "GitHub Sign In", icon: Shield, status: "available" },
  { key: "discord", label: "Discord Sign In", icon: FaDiscord, status: "available" },  
  { key: "llm", label: "LLM Chatbox", icon: Brain, status: "available" },
  { key: "billing", label: "Billing", icon: CreditCard, status: "soon" },
  { key: "realtime", label: "Realtime Messaging", icon: MessageCircle, status: "soon" },
  { key: "notifications", label: "Notifications", icon: Bell, status: "soon" },
  { key: "analytics", label: "Analytics", icon: BarChart3, status: "available" },
  { key: "maps", label: "Maps", icon: MapPin, status: "soon" },
  { key: "payments", label: "Payments", icon: CreditCard, status: "soon" },
  { key: "email", label: "Email", icon: Mail, status: "soon" },
  { key: "sms", label: "SMS", icon: MessageCircle, status: "soon" },
  { key: "files", label: "Files", icon: File, status: "soon" },
  { key: "api", label: "External API", icon: Plug, status: "available" },
] as const;

export type AvailableIntegrationKey = typeof availableIntegrations[number]["key"];

// Convenience list of integration keys
export const availableIntegrationKeys: readonly AvailableIntegrationKey[] = availableIntegrations.map(
  (integration) => integration.key
) as AvailableIntegrationKey[]; 