import { Link, useLocation } from "react-router";
import { useAuth } from "@client/context/AuthContext";

export function Header() {
  const location = useLocation();
  const { session } = useAuth();

  const navItems = [
    { href: "/docs", label: "Docs" },
    { href: "/test", label: "Test" }
  ];

  return (
    <header className="bg-gray-900/90 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Navigation */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
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
                        ? 'text-white'
                        : 'text-white/80 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
          
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
    </header>
  );
} 