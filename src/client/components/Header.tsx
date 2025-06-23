import { Link, useLocation } from "react-router";
import { useAuth } from "@client/context/AuthContext";

export function Header() {
  const location = useLocation();
  const { session } = useAuth();

  const navItems = [
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

              {/* GitHub external link */}
              <a
                href="https://github.com/Noisemaker111/jonstack"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm font-medium bg-[#24292f] text-white px-3 py-2 rounded-lg hover:bg-[#2f363d] transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12C0 17.303 3.438 21.8 8.205 23.385C8.805 23.498 9.025 23.15 9.025 22.845V20.611C5.672 21.338 4.968 19.182 4.968 19.182C4.422 17.827 3.633 17.459 3.633 17.459C2.546 16.709 3.714 16.724 3.714 16.724C4.922 16.813 5.554 17.994 5.554 17.994C6.636 19.845 8.346 19.348 9.051 19.066C9.156 18.287 9.467 17.761 9.81 17.46C7.145 17.157 4.344 16.112 4.344 11.475C4.344 10.163 4.799 9.083 5.579 8.237C5.456 7.932 5.05 6.69 5.69 5.025C5.69 5.025 6.703 4.697 9.009 6.262C9.965 5.991 10.985 5.856 12 5.851C13.015 5.856 14.035 5.991 14.991 6.262C17.297 4.697 18.309 5.025 18.309 5.025C18.95 6.69 18.543 7.932 18.421 8.237C19.203 9.083 19.654 10.163 19.654 11.475C19.654 16.112 16.848 17.152 14.175 17.449C14.6 17.836 14.982 18.589 14.982 19.754V22.845C14.982 23.155 15.189 23.506 15.799 23.385C20.565 21.796 24 17.298 24 12C24 5.37 18.63 0 12 0Z" />
                </svg>
                <span className="hidden sm:inline">GitHub</span>
              </a>
            </nav>
          </div>
          
          {/* User Menu / Get Started */}
          <div className="flex items-center gap-4">
            {session && (
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{session.user.email}</span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
} 