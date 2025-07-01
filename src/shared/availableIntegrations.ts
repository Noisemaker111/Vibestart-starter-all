import type { ComponentType } from "react";
import {
  Database,
  Shield,
  Brain,
  Upload,
  CreditCard,
  MessageCircle,
  Bell,
  BarChart3,
  MapPin,
  Plug,
  Mail,
  File,
} from "lucide-react";
import { FaChalkboard } from "react-icons/fa6";

export interface AvailableIntegration {
  key: string;
  label: string;
  /** Optional icon component for UI usage */
  icon?: ComponentType<{ className?: string }>;
  /** Availability status */
  status?: "available" | "soon";
  /** Additional tools/accounts required before using this integration */
  prerequisites?: string[];
  /** Environment variables the CLI sets up (deduplicated later) */
  envVars?: string[];
  cliFlag?: string;
}

export const availableIntegrations: readonly AvailableIntegration[] = [
  {
    key: "database",
    label: "Database",
    icon: Database,
    status: "available",
    prerequisites: ["Create a Supabase account – https://supabase.com/docs/guides/getting-started"],
    envVars: ["DATABASE_URL", "VITE_SUPABASE_URL", "VITE_SUPABASE_ANON_KEY"],
  },
  {
    key: "uploads",
    label: "Uploads",
    icon: Upload,
    status: "available",
    prerequisites: ["Create an UploadThing account – https://docs.uploadthing.com"],
    envVars: ["UPLOADTHING_TOKEN"],
  },
  {
    key: "auth",
    label: "Authentication",
    icon: Shield,
    status: "available",
    prerequisites: [
      "Create a Supabase account – https://supabase.com/docs/guides/getting-started",
    ],
    envVars: ["VITE_SUPABASE_URL", "VITE_SUPABASE_ANON_KEY"],
  },
  {
    key: "llm",
    label: "LLM Text",
    icon: Brain,
    status: "available",
    prerequisites: ["Create an OpenRouter account (min. $5 credit) – https://openrouter.ai"],
    envVars: ["VITE_OPENROUTER_API_KEY"],
  },
  {
    key: "llm-json",
    label: "LLM JSON",
    icon: Brain,
    status: "available",
    prerequisites: ["Create an OpenRouter account (min. $5 credit) – https://openrouter.ai"],
    envVars: ["VITE_OPENROUTER_API_KEY"],
  },
  {
    key: "llm-image",
    label: "LLM Image",
    icon: Brain,
    status: "available",
    prerequisites: ["Create an OpenRouter account (min. $5 credit) – https://openrouter.ai"],
    envVars: ["VITE_OPENROUTER_API_KEY", "OPENAI_API_KEY"],
  },
  {
    key: "analytics",
    label: "Analytics",
    icon: BarChart3,
    status: "available",
    prerequisites: ["Create a PostHog account – https://posthog.com/docs"],
    envVars: ["VITE_PUBLIC_POSTHOG_KEY", "VITE_PUBLIC_POSTHOG_HOST"],
  },
  {
    key: "api",
    label: "External API",
    icon: Plug,
    status: "available"
  },
  { key: "billing", label: "Billing", icon: CreditCard, status: "soon" },
  { key: "realtime", label: "Realtime Messaging", icon: MessageCircle, status: "soon" },
  { key: "notifications", label: "Notifications", icon: Bell, status: "soon" },
  { key: "maps", label: "Maps", icon: MapPin, status: "soon" },
  { key: "email", label: "Email", icon: Mail, status: "soon" },
  { key: "sms", label: "SMS", icon: MessageCircle, status: "soon" },
  { key: "files", label: "Files", icon: File, status: "soon" },
  { key: "whiteboard", label: "Whiteboard", icon: FaChalkboard, status: "soon" },
  {
    key: "bot-detection",
    label: "Bot Detection (BotID)",
    icon: Shield,
    status: "available",
    prerequisites: [
      "Enable Vercel BotID in your project dashboard – https://vercel.com/docs/botid",
    ],
    envVars: [],
  },
] as const;

export type AvailableIntegrationKey = typeof availableIntegrations[number]["key"];

// Convenience list of integration keys
export const availableIntegrationKeys: readonly AvailableIntegrationKey[] = availableIntegrations.map(
  (integration) => integration.key
) as AvailableIntegrationKey[]; 