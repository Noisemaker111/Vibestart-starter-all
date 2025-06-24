import { useEffect, useLayoutEffect, useState } from "react";

export function ThemeToggle() {
  const [dark, setDark] = useState(() => {
    if (typeof window === "undefined") return false;
    const stored = localStorage.getItem("theme");
    if (stored === "dark") return true;
    if (stored === "light") return false;
    // Fallback to system preference
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // Apply theme class on mount (before paint) to reduce flashing
  useLayoutEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return (
    <button
      onClick={() => setDark((d) => !d)}
      aria-label="Toggle theme"
      className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
    >
      {dark ? (
        <svg className="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 3a1 1 0 011 1v1a1 1 0 11-2 0V4a1 1 0 011-1zm5.657 2.343a1 1 0 011.414 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707zM20 11a1 1 0 110 2h-1a1 1 0 110-2h1zm-2.929 8.071a1 1 0 01-1.414 0l-.707-.707a1 1 0 111.414-1.414l.707.707a1 1 0 010 1.414zM13 20a1 1 0 11-2 0v-1a1 1 0 112 0v1zm-7.071-1.929a1 1 0 010-1.414l.707-.707a1 1 0 111.414 1.414l-.707.707a1 1 0 01-1.414 0zM4 13a1 1 0 110-2H3a1 1 0 110 2h1zm1.343-7.657a1 1 0 011.414 0l.707.707A1 1 0 015.05 7.464l-.707-.707a1 1 0 010-1.414z" />
        </svg>
      ) : (
        <svg className="w-5 h-5 text-gray-800" fill="currentColor" viewBox="0 0 24 24">
          <path d="M21.752 15.002A9.718 9.718 0 0112 21.75 9.75 9.75 0 018.25 3.248a.75.75 0 00-.535 1.363 8.25 8.25 0 1010.674 10.674.75.75 0 001.363-.535z" />
        </svg>
      )}
    </button>
  );
} 