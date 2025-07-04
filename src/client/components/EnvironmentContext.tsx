import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type EnvironmentType = "cursor" | "claude" | "gemini";

interface EnvironmentContextValue {
  env: EnvironmentType;
  setEnv: (env: EnvironmentType) => void;
}

const DEFAULT_ENV: EnvironmentType = "cursor";

const EnvironmentContext = createContext<EnvironmentContextValue | undefined>(undefined);

export function EnvironmentProvider({ children }: { children: React.ReactNode }) {
  const [env, setEnv] = useState<EnvironmentType>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("vibestart_selected_env");
        if (stored === "cursor" || stored === "claude" || stored === "gemini") {
          return stored;
        }
      } catch {}
    }
    return DEFAULT_ENV;
  });

  useEffect(() => {
    try {
      localStorage.setItem("vibestart_selected_env", env);
    } catch {}
  }, [env]);

  const value = useMemo<EnvironmentContextValue>(() => ({ env, setEnv }), [env]);

  return <EnvironmentContext.Provider value={value}>{children}</EnvironmentContext.Provider>;
}

export function useEnvironment(): EnvironmentContextValue {
  const ctx = useContext(EnvironmentContext);
  if (!ctx) throw new Error("useEnvironment() must be used within an EnvironmentProvider");
  return ctx;
} 