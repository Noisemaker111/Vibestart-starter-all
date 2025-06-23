import { Link, useLocation } from "react-router";
import { useAuth } from "@client/context/AuthContext";
import { useState } from "react";
import { LoginModal } from "@client/components/LoginModal";
import { AvatarDropdown } from "@client/components/AvatarDropdown";

export function Header() {
  const location = useLocation();
  const { session } = useAuth();
  
  const [loginOpen, setLoginOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/ideas", label: "Ideas" },
    { href: "/docs", label: "Docs" },
  ];

  return (
    <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Navigation */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                JonStack
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
                    className={`text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
          
          {/* User Menu / Get Started */}
          <div className="flex items-center gap-4">
            {session ? (
              <AvatarDropdown user={session.user} />
            ) : (
              <button
                onClick={() => setLoginOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-sm"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 11c1.656 0 3-1.344 3-3s-1.344-3-3-3-3 1.344-3 3 1.344 3 3 3zm0 1c-2.674 0-8 1.344-8 4v2h16v-2c0-2.656-5.326-4-8-4z"
                  />
                </svg>
                Log In
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </header>
  );
} 