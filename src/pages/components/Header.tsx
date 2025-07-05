import { Link, useLocation } from "react-router";
import { useAuth } from "@pages/components/integrations/auth/AuthContext";
import { usePostHog } from "posthog-js/react";
import { useEnvironment } from "@pages/components/IDEselector";
import type { EnvironmentType } from "@pages/components/IDEselector";

export function Header() {
  const location = useLocation();
  const { session } = useAuth();
  const posthog = usePostHog();

  // Global environment state
  const { env, setEnv } = useEnvironment();

  const navItems = [
    { href: "/docs", label: "Docs" },
    { href: "/test", label: "Tests" },
  ];

  return (
    <header className="bg-gray-900/90 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50">
      <div className="mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo and Navigation */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                VibeStart
              </span>
            </Link>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-6">
              {navItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => posthog.capture(`nav_${item.label.toLowerCase()}_click`)}
                    className={`text-sm font-semibold transition-colors ${
                      isActive
                        ? 'text-purple-500 drop-shadow-sm'
                        : 'text-purple-400 hover:text-purple-300 drop-shadow-sm'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Mobile Links */}
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => posthog.capture(`nav_${item.label.toLowerCase()}_click`)}
                className={`md:hidden text-sm font-semibold transition-colors ${
                  location.pathname === item.href
                    ? 'text-purple-500 drop-shadow-sm'
                    : 'text-purple-400 hover:text-purple-300 drop-shadow-sm'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
          
          {/* Alpha badge + Environment Selector & User Actions */}
          <div className="flex items-center gap-4">
            {/* Alpha version badge */}
            <span className="text-sm font-bold uppercase text-yellow-900 bg-yellow-400/90 px-3 py-1 rounded-lg shadow-md ring-2 ring-yellow-500/60 select-none animate-pulse">
              Alpha Version
            </span>

            {location.pathname.startsWith("/docs") && (
              <div className="hidden md:flex items-center">
                {/* Environment selector with sliding indicator */}
                {(() => {
                  const envOptions = [
                    { id: "cursor", img: "https://ub2fn6mfq7.ufs.sh/f/qmic4Bwp6v0GN5opBIR05IS8LmcaWvOtlxnRABobdyrDNzfg", alt: "Cursor" },
                    { id: "claude", img: "https://ub2fn6mfq7.ufs.sh/f/qmic4Bwp6v0G62M16RliI58BwvbV0HgTMGDOAcK2X9dQno3l", alt: "Claude" },
                    { id: "gemini", img: "https://ub2fn6mfq7.ufs.sh/f/qmic4Bwp6v0GluEo24UNz2yIcw3vhuo5DpsJA90BxQVOgmLS", alt: "Gemini" },
                  ] as const;

                  const BUTTON_PX = 36; // width/height for w-9
                  const GAP_PX = 8; // gap-2 (0.5rem)
                  const selectedIdx = envOptions.findIndex((opt) => opt.id === env);

                  return (
                    <div className="relative bg-gray-800 rounded-full px-2 py-1 flex items-center gap-2">
                      {/* Sliding highlight */}
                      <span
                        className="absolute top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white shadow-lg ring-2 ring-purple-400/60 transition-transform duration-300"
                        style={{ transform: `translateX(${selectedIdx * (BUTTON_PX + GAP_PX)}px)` }}
                        aria-hidden="true"
                      />

                      {envOptions.map(({ id, img, alt }) => (
                        <button
                          key={id}
                          onClick={() => setEnv(id as EnvironmentType)}
                          className={`relative z-10 p-0 flex items-center justify-center rounded-full transition-transform duration-200 ${
                            env === id ? "scale-105" : "hover:scale-105"
                          }`}
                        >
                          <img src={img} alt={alt} className="w-9 h-9 object-contain" />
                        </button>
                      ))}
                    </div>
                  );
                })()}
              </div>
            )}

            {/* User Actions */}
            <div className="flex items-center gap-4">
              {session && (
                <span className="hidden sm:block text-sm font-medium text-gray-300">
                  {session.user.email}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
} 