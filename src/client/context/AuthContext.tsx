import { createContext, useContext, useEffect, useState, useRef } from "react";
import { supabase } from "@shared/supabase";
import type { Session } from "@supabase/supabase-js";
import { useLocation } from "react-router";

interface AuthContextType {
  session: Session | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  loading: true,
});

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const lastPathRef = useRef(location.pathname);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Auto-logout after navigation, refresh, or 2-minute idle
  useEffect(() => {
    if (!session) return;

    // Timer – 2 minutes
    const timer = setTimeout(() => {
      supabase.auth.signOut();
    }, 2 * 60 * 1000);

    // Sign out on tab close / refresh
    const handleUnload = () => supabase.auth.signOut();
    window.addEventListener("beforeunload", handleUnload);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [session]);

  // Sign out if the user navigates to a different route before timer fires
  useEffect(() => {
    if (!session) return;
    if (location.pathname !== lastPathRef.current) {
      supabase.auth.signOut();
    }
    lastPathRef.current = location.pathname;
  }, [location.pathname, session]);

  return (
    <AuthContext.Provider value={{ session, loading }}>
      {children}
    </AuthContext.Provider>
  );
} 