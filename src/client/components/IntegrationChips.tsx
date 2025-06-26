import React from "react";
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
  Search as SearchIcon,
  MapPin,
} from "lucide-react";

interface Integration {
  key: string;
  label: string;
  icon: React.ReactNode;
}

const integrations: Integration[] = [
  { key: "database", label: "Database", icon: <Database className="w-4 h-4" /> },
  { key: "solana", label: "Solana Sign In", icon: <Fingerprint className="w-4 h-4" /> },
  { key: "google", label: "Google Sign In", icon: <LogIn className="w-4 h-4" /> },
  { key: "github", label: "GitHub Sign In", icon: <Shield className="w-4 h-4" /> },
  { key: "llm", label: "LLM Chatbox", icon: <Brain className="w-4 h-4" /> },
  { key: "uploads", label: "Uploads", icon: <Upload className="w-4 h-4" /> },
  { key: "billing", label: "Billing", icon: <CreditCard className="w-4 h-4" /> },
  { key: "realtime", label: "Realtime Messaging", icon: <MessageCircle className="w-4 h-4" /> },
  { key: "notifications", label: "Notifications", icon: <Bell className="w-4 h-4" /> },
  { key: "analytics", label: "Analytics", icon: <BarChart3 className="w-4 h-4" /> },
  { key: "maps", label: "Maps", icon: <MapPin className="w-4 h-4" /> },
  { key: "search", label: "Search", icon: <SearchIcon className="w-4 h-4" /> },
];

interface IntegrationChipsProps {
  /** Additional Tailwind classes */
  className?: string;
  /** Keys of integrations that should be considered active. When omitted, all are active. */
  activeKeys?: string[];
}

export default function IntegrationChips({ className, activeKeys }: IntegrationChipsProps) {
  // Treat no activeKeys prop as "all active"
  const activeSet = new Set(activeKeys ?? integrations.map((i) => i.key));

  return (
    <div className={`flex flex-wrap gap-2 ${className ?? ""}`.trim()}>
      {integrations
        .filter((i) => activeSet.has(i.key))
        .map((i) => (
          <span
            key={i.key}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg border border-purple-500 animate-in fade-in"
          >
            {i.icon}
            {i.label}
          </span>
        ))}
    </div>
  );
} 