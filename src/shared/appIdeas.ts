export type Platform = "web" | "mobile" | "desktop" | "game";

export interface AppIdea {
  idea: string;
  integrations: string[]; // keys that map to IntegrationChips entries
  platform: Platform;
}

export const appIdeas: AppIdea[] = [
  {
    idea: "Peer-to-peer clothing rental platform using AR try-on",
    integrations: ["database", "uploads", "google", "llm"],
    platform: "mobile",
  },
  {
    idea: "Real-time collaborative recipe builder with ingredient tracking",
    integrations: ["database", "realtime", "uploads", "google"],
    platform: "web",
  },
  {
    idea: "Personalised mental-health journaling with mood insights",
    integrations: ["database", "llm", "analytics", "notifications"],
    platform: "mobile",
  },
  {
    idea: "Virtual study-group matcher with voice rooms",
    integrations: ["realtime", "database", "google", "notifications"],
    platform: "desktop",
  },
  {
    idea: "Local volunteer opportunity marketplace with skill matching",
    integrations: ["database", "maps", "search", "notifications"],
    platform: "web",
  },
  {
    idea: "Fractional real-estate micro-investment dashboard",
    integrations: ["database", "billing", "analytics", "google"],
    platform: "web",
  },
  {
    idea: "AI-driven résumé builder optimised for job boards",
    integrations: ["llm", "uploads", "google", "database"],
    platform: "desktop",
  },
  {
    idea: "Subscription management & one-click cancellation helper",
    integrations: ["database", "billing", "notifications", "analytics"],
    platform: "web",
  },
  {
    idea: "Eco-friendly product scanner with carbon-score badges",
    integrations: ["search", "analytics", "database", "llm"],
    platform: "mobile",
  },
  {
    idea: "Immersive VR language-learning chatrooms",
    integrations: ["realtime", "llm", "analytics", "notifications"],
    platform: "game",
  },
  {
    idea: "Neighborhood tool & equipment sharing network",
    integrations: ["database", "maps", "google", "notifications"],
    platform: "mobile",
  },
  {
    idea: "Wearable-driven custom workout generator",
    integrations: ["database", "analytics", "notifications", "llm"],
    platform: "mobile",
  },
  {
    idea: "Remote team-building mini-game suite with analytics",
    integrations: ["realtime", "analytics", "database", "llm"],
    platform: "web",
  },
  {
    idea: "On-demand virtual interior-design consultations",
    integrations: ["database", "uploads", "llm", "google"],
    platform: "web",
  },
  {
    idea: "Digital wardrobe organiser with smart outfit suggestions",
    integrations: ["uploads", "database", "llm", "google"],
    platform: "mobile",
  },
  {
    idea: "Sustainable meal-planning app that minimises waste",
    integrations: ["database", "llm", "analytics", "notifications"],
    platform: "web",
  },
  {
    idea: "Blockchain-based academic-credential verifier",
    integrations: ["database", "solana", "analytics"],
    platform: "web",
  },
  {
    idea: "Skill-barter exchange for freelancers",
    integrations: ["database", "realtime", "google", "billing"],
    platform: "web",
  },
  {
    idea: "Virtual farmers-market with local delivery logistics",
    integrations: ["database", "maps", "billing", "notifications"],
    platform: "mobile",
  },
  {
    idea: "Smart parking-spot finder with reservation & payment",
    integrations: ["maps", "realtime", "billing", "notifications"],
    platform: "mobile",
  },
];

export default appIdeas; 