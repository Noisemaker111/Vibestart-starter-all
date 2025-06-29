import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

type OsType = "windows" | "mac" | "linux";

interface OsContextValue {
  os: OsType;
  setOs: (os: OsType) => void;
}

// -----------------------------------------------------------------------------
// Helpers – detect user OS (best-effort, client-side only)
// -----------------------------------------------------------------------------

function detectDefaultOs(): OsType {
  if (typeof navigator === "undefined") return "windows"; // SSR fallback
  const ua = navigator.userAgent || navigator.platform || "";
  if (/Win/i.test(ua)) return "windows";
  if (/Mac/i.test(ua)) return "mac";
  if (/Linux/i.test(ua)) return "linux";
  return "windows";
}

// -----------------------------------------------------------------------------
// Context implementation
// -----------------------------------------------------------------------------

const OsContext = createContext<OsContextValue | undefined>(undefined);

export function OsProvider({ children }: { children: React.ReactNode }) {
  const [os, setOs] = useState<OsType>(() => detectDefaultOs());

  // Persist choice in localStorage so refresh preserves selection
  useEffect(() => {
    try {
      localStorage.setItem("vibestart_selected_os", os);
    } catch {
      /* ignore */
    }
  }, [os]);

  // Initialise from storage on first render (client only)
  useEffect(() => {
    try {
      const stored = localStorage.getItem("vibestart_selected_os");
      if (stored === "windows" || stored === "mac" || stored === "linux") {
        setOs(stored);
      }
    } catch {
      /* ignore */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo<OsContextValue>(() => ({ os, setOs }), [os]);

  return <OsContext.Provider value={value}>{children}</OsContext.Provider>;
}

export function useOs(): OsContextValue {
  const ctx = useContext(OsContext);
  if (!ctx) {
    throw new Error("useOs() must be used within an OsProvider");
  }
  return ctx;
} 