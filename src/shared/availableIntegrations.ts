import type { ComponentType } from "react";
import {
  Database,
  Shield,
  Brain,
  Upload,
  CreditCard,
  MessageCircle,
  BarChart3,
  MapPin,
  Plug,
  Mail,
  Users,
} from "lucide-react";

export interface AvailableIntegration {
  key: string;
  label: string;
  /** Optional icon component for UI usage */
  icon?: ComponentType<{ className?: string }>;
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
    prerequisites: ["Create a Supabase account – https://supabase.com/docs/guides/getting-started"],
    envVars: ["DATABASE_URL", "VITE_SUPABASE_URL", "VITE_SUPABASE_ANON_KEY"],
  },
  {
    key: "uploads",
    label: "Uploads",
    icon: Upload,
    prerequisites: ["Create an UploadThing account – https://docs.uploadthing.com"],
    envVars: ["UPLOADTHING_TOKEN"],
  },
  {
    key: "auth",
    label: "Authentication",
    icon: Shield,
    prerequisites: [
      "Create a Supabase account – https://supabase.com/docs/guides/getting-started",
    ],
    envVars: ["VITE_SUPABASE_URL", "VITE_SUPABASE_ANON_KEY"],
  },
  {
    key: "llm",
    label: "LLM Text",
    icon: Brain,
    prerequisites: ["Create an OpenRouter account (min. $5 credit) – https://openrouter.ai"],
    envVars: ["VITE_OPENROUTER_API_KEY"],
  },
  {
    key: "llm-json",
    label: "LLM JSON",
    icon: Brain,
    prerequisites: ["Create an OpenRouter account (min. $5 credit) – https://openrouter.ai"],
    envVars: ["VITE_OPENROUTER_API_KEY"],
  },
  {
    key: "llm-image",
    label: "LLM Image",
    icon: Brain,
    prerequisites: ["Create an Openai account (min. $5 credit) – https://openai.com"],
    envVars: ["OPENAI_API_KEY"],
  },
  {
    key: "analytics",
    label: "Analytics",
    icon: BarChart3,
    prerequisites: ["Create a PostHog account – https://posthog.com/docs"],
    envVars: ["VITE_PUBLIC_POSTHOG_KEY", "VITE_PUBLIC_POSTHOG_HOST"],
  },
  {
    key: "api",
    label: "External API",
    icon: Plug,
  },
  {
    key: "billing",
    label: "Billing",
    icon: CreditCard,
    prerequisites: [
      "Create a Polar account – https://polar.sh",
      "Generate an access token – https://app.polar.sh/settings/tokens (or sandbox)"
    ],
    envVars: ["POLAR_ACCESS_TOKEN", "POLAR_WEBHOOK_SECRET"],
  },
  {
    key: "payments",
    label: "Payments",
    icon: CreditCard,
    prerequisites: [
      "Create a Polar account – https://polar.sh",
      "Generate an access token – https://app.polar.sh/settings/tokens (or sandbox)"
    ],
    envVars: ["POLAR_ACCESS_TOKEN", "POLAR_WEBHOOK_SECRET"],
  },
  {
    key: "realtime",
    label: "Realtime",
    icon: MessageCircle,
    prerequisites: [
      "Create a Supabase account – https://supabase.com/docs/guides/getting-started",
      "Enable Realtime replication for the desired tables – https://supabase.com/docs/guides/realtime",
    ],
    envVars: ["VITE_SUPABASE_URL", "VITE_SUPABASE_ANON_KEY"],
  },
  {
    key: "maps",
    label: "Maps Autocomplete",
    icon: MapPin,
    prerequisites: [
      "Create a google cloud account – https://cloud.google.com",
      "Generate an access token – https://cloud.google.com/maps-platform/pricing"
    ],
    envVars: ["VITE_GOOGLE_MAPS_API_KEY"],
  },
  {
    key: "organizations",
    label: "Organizations",
    icon: Users,
    prerequisites: [
      "Supabase set-up with 'organizations' table present (see schema.ts)"
    ],
  },
  {
    key: "email",
    label: "Email",
    icon: Mail,
    prerequisites: [
      "Create a Resend account – https://resend.com",
      "Generate an API key – https://resend.com/api-keys",
    ],
    envVars: ["RESEND_API_KEY"],
  },
] as const;

export type AvailableIntegrationKey = typeof availableIntegrations[number]["key"];

// Convenience list of integration keys
export const availableIntegrationKeys: readonly AvailableIntegrationKey[] = availableIntegrations.map(
  (integration) => integration.key
) as AvailableIntegrationKey[]; 