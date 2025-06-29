import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

// Types
export type OSType = "windows" | "mac" | "linux";

interface OsContextValue {
  os: OSType;
  setOs: (os: OSType) => void;
}

// Detect user OS best-effort
function detectDefaultOS(): OSType {
  if (typeof navigator === "undefined") return "windows"; // SSR fallback
  const ua = navigator.userAgent || navigator.platform || "";
  if (/Win/i.test(ua)) return "windows";
  if (/Mac/i.test(ua)) return "mac";
  if (/Linux/i.test(ua)) return "linux";
  return "windows";
}

const OsContext = createContext<OsContextValue | undefined>(undefined);

export function OSProvider({ children }: { children: React.ReactNode }) {
  const [os, setOs] = useState<OSType>(() => detectDefaultOS());

  // Persist selection
  useEffect(() => {
    try {
      localStorage.setItem("vibestart_selected_os", os);
    } catch {}
  }, [os]);

  // Restore on mount (client-side)
  useEffect(() => {
    try {
      const stored = localStorage.getItem("vibestart_selected_os");
      if (stored === "windows" || stored === "mac" || stored === "linux") {
        setOs(stored);
      }
    } catch {}
  }, []);

  const value = useMemo<OsContextValue>(() => ({ os, setOs }), [os]);

  return <OsContext.Provider value={value}>{children}</OsContext.Provider>;
}

export function useOs(): OsContextValue {
  const ctx = useContext(OsContext);
  if (!ctx) throw new Error("useOs() must be used within an OSProvider");
  return ctx;
} 