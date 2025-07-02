import { Link, useLocation } from "react-router";
import { useAuth } from "@client/context/AuthContext";
import { usePostHog } from "posthog-js/react";
import { useEnvironment } from "@client/context/EnvironmentContext";
import type { EnvironmentType } from "@client/context/EnvironmentContext";

export function Header() {
  const location = useLocation();
  const { session } = useAuth();
  const posthog = usePostHog();

  // Global environment state
  const { env, setEnv } = useEnvironment();

  const navItems = [
    { href: "/docs", label: "Docs" },
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

            {/* Mobile Docs Link */}
            <Link
              to="/docs"
              onClick={() => posthog.capture('nav_docs_click')}
              className={`md:hidden text-sm font-semibold transition-colors ${
                location.pathname === '/docs'
                  ? 'text-purple-500 drop-shadow-sm'
                  : 'text-purple-400 hover:text-purple-300 drop-shadow-sm'
              }`}
            >
              Docs
            </Link>
          </div>
          
          {/* Environment Selector Slider & User Actions */}
          <div className="flex items-center gap-4">
            {location.pathname.startsWith("/docs") && (
              <div className="hidden md:flex items-center">
                <div className="relative bg-gray-800 rounded-full px-2 py-0 flex items-center gap-1">
                  {( 
                    [
                      { id: "cursor", img: "https://ub2fn6mfq7.ufs.sh/f/qmic4Bwp6v0GW45AxaZLpdOz8koXPIARmrajUTxi1QZNyGtJ", alt: "Cursor" },
                      { id: "claude", img: "https://ub2fn6mfq7.ufs.sh/f/qmic4Bwp6v0GlKr861UNz2yIcw3vhuo5DpsJA90BxQVOgmLS", alt: "Claude" },
                      { id: "gemini", img: "https://ub2fn6mfq7.ufs.sh/f/qmic4Bwp6v0GUTTfzTL38gaiXL7ce2OnjumGwIv4d9KlCS1H", alt: "Gemini" },
                    ] as const
                  ).map(({ id, img, alt }) => (
                    <button
                      key={id}
                      onClick={() => setEnv(id as EnvironmentType)}
                      className={`p-0 flex items-center justify-center rounded-full transition-all duration-200 ${
                        env === id
                          ? "bg-gradient-to-br from-purple-600 to-indigo-600 shadow-lg ring-2 ring-purple-400/60 scale-105"
                          : "hover:bg-gray-700 hover:scale-105"
                      }`}
                    >
                      <img src={img} alt={alt} className="w-12 h-12 object-contain" />
                    </button>
                  ))}
                </div>
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