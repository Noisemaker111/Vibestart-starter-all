import React, { useState } from "react";
import {
  Code2,
  Server,
  Plus,
  Smartphone,
  Monitor,
} from "lucide-react";
import {
  availablePlatforms,
  type AvailablePlatformKey,
} from "@shared/availablePlatforms";
import {
  availableIntegrations,
  type AvailableIntegrationKey,
} from "@shared/availableIntegrations";
import Badge from "./Badge";

interface Category {
  key: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  technologies: string[];
  status?: "available" | "soon" | "far";
}

// Re-usable colour palette (cycled through for integration cards)
const colourCycle = [
  "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "bg-green-500/20 text-green-400 border-green-500/30",
  "bg-purple-500/20 text-purple-400 border-purple-500/30",
  "bg-red-500/20 text-red-400 border-red-500/30",
  "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  "bg-pink-500/20 text-pink-400 border-pink-500/30",
  "bg-orange-500/20 text-orange-400 border-orange-500/30",
  "bg-lime-500/20 text-lime-400 border-lime-500/30",
];

/**
 * TechStack renders an at-a-glance overview of the core technologies that ship
 * with a freshly generated VibeStart project. The list can be adapted in the
 * future for non-web targets (mobile, desktop, etc.) by passing the platformKey
 * prop. For now, only the "web" stack is defined.
 */
interface Props {
  /** Optionally pre-select a platform. Defaults to "web". */
  platformKey?: AvailablePlatformKey;
}

// Helper to detect if screen width is >= md (768px)
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia(query);
    const listener = () => setMatches(media.matches);
    listener(); // set initial
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [query]);

  return matches;
}

// -----------------------------------------------------------------------------
// Helper that returns the core technology categories for a given platform.
// Only the web/mobile/desktop platforms are fully supported for now – other
// platforms will fall back to a generic "Coming Soon" placeholder so that the
// UI updates when selecting them but without misleading users.
// -----------------------------------------------------------------------------
function getCoreCategories(platform: AvailablePlatformKey): Category[] {
  switch (platform) {
    case "web":
      return [
        {
          key: "frontend",
          title: "Front-end & UI",
          icon: <Code2 className="w-5 h-5" />,
          color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
          technologies: ["React 19", "Tailwind CSS 4", "React Router 7"],
        },
        {
          key: "backend",
          title: "Backend & API",
          icon: <Server className="w-5 h-5" />,
          color: "bg-green-500/20 text-green-400 border-green-500/30",
          technologies: ["Node.js 18", "Vite 6"],
        },
      ];

    case "mobile-app":
      return [
        {
          key: "frontend-mobile",
          title: "Front-end & UI",
          icon: <Smartphone className="w-5 h-5" />,
          color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
          technologies: ["React Native", "Expo", "Tamagui"],
        },
        {
          key: "backend-mobile",
          title: "Backend & API",
          icon: <Server className="w-5 h-5" />,
          color: "bg-green-500/20 text-green-400 border-green-500/30",
          technologies: ["Node.js 18", "tRPC"],
        },
      ];

    case "desktop":
      return [
        {
          key: "frontend-desktop",
          title: "Front-end & UI",
          icon: <Monitor className="w-5 h-5" />,
          color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
          technologies: ["Electron", "React 19", "Tailwind CSS 4"],
        },
        {
          key: "backend-desktop",
          title: "Backend & API",
          icon: <Server className="w-5 h-5" />,
          color: "bg-green-500/20 text-green-400 border-green-500/30",
          technologies: ["Node.js 18", "Vite 6"],
        },
      ];

    default:
      return [
        {
          key: "coming-soon",
          title: "Platform Support",
          icon: <Code2 className="w-5 h-5" />,
          color: "bg-gray-500/20 text-gray-400 border-gray-500/30",
          technologies: ["Coming soon"],
          status: "soon",
        },
      ];
  }
}

// -----------------------------------------------------------------------------
// END helper
// -----------------------------------------------------------------------------

export default function TechStack({ platformKey = "web" }: Props) {
  const [selectedPlatform, setSelectedPlatform] = useState<AvailablePlatformKey>(
    platformKey
  );
  const isMdUp = useMediaQuery("(min-width: 768px)");
  const [menuOpen, setMenuOpen] = useState(false);

  /**
   * Per-platform integration lists. Anything not explicitly listed will fall
   * back to the full default set so that experimental platforms still show all
   * available integrations until we curate them.
   */
  const defaultIntegrationKeys = availableIntegrations.map(
    (i) => i.key as AvailableIntegrationKey
  );

  const platformIntegrationMap: Partial<Record<
    AvailablePlatformKey,
    AvailableIntegrationKey[]
  >> = {
    web: [
      "database",
      "uploads",
      "solana",
      "google",
      "github",
      "discord",
      "llm",
      "analytics",
      "api",
    ],
    "mobile-app": [
      "database",
      "uploads",
      "google",
      "discord",
      "llm",
      "analytics",
      "api",
    ],
    desktop: [
      "database",
      "uploads",
      "github",
      "discord",
      "llm",
      "analytics",
      "api",
    ],
  };

  // Provider lists for each integration (displayed under card title)
  const providersMap: Partial<Record<AvailableIntegrationKey, string[]>> = {
    database: ["Supabase", "Drizzle ORM", "PostgreSQL"],
    uploads: ["UploadThing"],
    solana: ["Supabase Auth"],
    google: ["Supabase Auth"],
    github: ["Supabase Auth"],
    discord: ["Supabase Auth"],
    llm: ["OpenRouter"],
    analytics: ["PostHog"],
    api: ["Vercel Edge Functions"],
  };

  /* -------------------------- Build card definitions -------------------------- */
  const staticCategories = getCoreCategories(selectedPlatform);

  const integrationsForPlatform =
    platformIntegrationMap[selectedPlatform] ?? defaultIntegrationKeys;

  const integrationCategories: (Category | null)[] = integrationsForPlatform.map((key, idx) => {
    const integration = availableIntegrations.find((i) => i.key === key);
    if (!integration) return null;

    const IconComponent = integration.icon;
    const providers = providersMap[key];

    return {
      key: integration.key,
      title: integration.label,
      icon: IconComponent ? (
        <IconComponent className="w-5 h-5" />
      ) : null,
      color: colourCycle[(idx + staticCategories.length) % colourCycle.length],
      technologies:
        integration.status === "available" && providers
          ? providers
          : [integration.status === "soon" ? "Soon" : "Available"],
      status: integration.status,
    };
  });

  // Hide future integrations (status === "soon") by default to keep the UI
  // focused on what is ready to use today. This can be revisited later once
  // more integrations graduate to "available".
  const techCategories: Category[] = [
    ...staticCategories,
    ...integrationCategories.filter((c): c is Category => {
      if (!c) return false;
      return c.status !== "soon";
    }),
  ];

  /* ---------------------------------- Render --------------------------------- */
  return (
    <section className="relative py-16 px-4 bg-gradient-to-b from-gray-900/0 via-gray-900/10 to-gray-900/20">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold text-white">
            Production-Ready Tech Stack
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Everything you need to build modern, scalable applications—already
            wired-up. One language. Everything runs on 
            <span className="inline-flex items-center gap-1 align-baseline">
              <span className="text-white font-medium">TypeScript</span>
              <img
                src="https://jm6qi1k67z.ufs.sh/f/xjiCC72FKQkxHAGHxoL1E21nUvL8WDXqxyCl4QguTVKRPAsJ"
                alt="TypeScript logo"
                className="w-6 h-6 inline-block"
              />
            </span>
            —from database to UI.
          </p>
        </div>

        {/* Platform selector (collapsible on md+) */}
        <div className="flex flex-wrap md:flex-nowrap justify-center gap-2 overflow-hidden whitespace-nowrap pt-4">
          {(() => {
            const extIdx = availablePlatforms.findIndex((p) => p.key === "extension");
            const visiblePlatforms = !isMdUp || extIdx === -1 ? availablePlatforms : availablePlatforms.slice(0, extIdx + 1);

            const elements = visiblePlatforms.map((platform) => {
              const Icon = platform.icon;
              const isSelected = selectedPlatform === platform.key;
              const chipBase =
                "shrink-0 relative flex items-center justify-center gap-1 min-w-[7rem] px-2 py-1 rounded-full border text-xs md:text-sm transition-colors";
              return (
                <button
                  key={platform.key}
                  type="button"
                  onClick={() =>
                    setSelectedPlatform(platform.key as AvailablePlatformKey)
                  }
                  aria-pressed={isSelected}
                  className={`${chipBase} ${
                    isSelected
                      ? "bg-purple-600 text-white border-purple-600"
                      : "bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700"
                  } ${platform.status === "soon" ? "opacity-70 blur-[1px]" : ""}`}
                >
                  {Icon && <Icon className="w-4 h-4" />} <span>{platform.label}</span>
                  {platform.status === "soon" && (
                    <Badge label="soon" className="-top-1 -right-1" />
                  )}
                </button>
              );
            });

            // Add + button that opens popover with remaining platforms
            if (isMdUp && extIdx !== -1 && extIdx < availablePlatforms.length - 1) {
              const hiddenPlatforms = availablePlatforms.slice(extIdx + 1);
              elements.push(
                <div key="show-more" className="relative inline-flex">
                  <button
                    type="button"
                    onClick={() => setMenuOpen((v) => !v)}
                    className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700"
                    aria-label="Show more platforms"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  {menuOpen && (
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 flex flex-wrap justify-center gap-2 bg-gray-900/95 backdrop-blur-lg p-3 rounded-lg shadow-lg border border-gray-700 z-10">
                      {hiddenPlatforms.map((platform) => {
                        const Icon = platform.icon;
                        const isSelected = selectedPlatform === platform.key;
                        const chipBase =
                          "shrink-0 relative flex items-center justify-center gap-1 min-w-[7rem] px-2 py-1.5 rounded-full border text-xs md:text-sm transition-colors";
                        return (
                          <button
                            key={platform.key}
                            type="button"
                            onClick={() => {
                              setSelectedPlatform(platform.key as AvailablePlatformKey);
                              setMenuOpen(false);
                            }}
                            className={`${chipBase} ${
                              isSelected
                                ? "bg-purple-600 text-white border-purple-600"
                                : "bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700"
                            } ${platform.status === "soon" ? "opacity-70 blur-[1px]" : ""}`}
                          >
                            {Icon && <Icon className="w-4 h-4" />} {platform.label}
                            {platform.status === "soon" && (
                              <Badge label="soon" className="-top-1 -right-1" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            return elements;
          })()}
        </div>

        {/* Tech / integration cards */}
        <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {techCategories.map((category) => (
            <div
              key={category.key}
              className="relative bg-gray-900/50 border border-gray-800 rounded-2xl p-5 backdrop-blur-sm shadow-lg transition-transform hover:-translate-y-1 hover:shadow-purple-600/20"
            >
              {/* Badge for non-available */}
              {category.status === "soon" && (
                <Badge label="soon" />
              )}
              {/* Header */}
              <div className="flex items-center gap-4 mb-4">
                <div
                  className={`flex items-center justify-center p-2 rounded-lg shrink-0 ${category.color}`}
                >
                  {category.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    {category.title}
                  </h3>
                  {category.technologies?.length > 0 && (
                    <p className="text-gray-400 text-sm">
                      {category.technologies.join(", ")}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 