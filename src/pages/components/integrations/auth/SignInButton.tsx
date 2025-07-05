import { useState } from "react";
import { supabase } from "@shared/supabase";
import { useAuth } from "./AuthContext";
import { LoginModal } from "@pages/components/integrations/auth/LoginModal";

interface Props {
  className?: string;
}

/**
 * SignInButton shows a "Log In" button when the user is signed out and a
 * "Log Out" button when signed in. Clicking "Log In" opens the <LoginModal/>
 * component. Clicking "Log Out" signs the user out via Supabase.
 */
export function SignInButton({ className }: Props) {
  const { session } = useAuth();
  const [open, setOpen] = useState(false);

  // Signed-in state → render "Log Out"
  if (session) {
    return (
      <button
        onClick={() => supabase.auth.signOut()}
        className={`btn-primary ${className ?? ""}`.trim()}
      >
        Log Out
      </button>
    );
  }

  // Signed-out state → render "Log In" & modal trigger
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`btn-primary ${className ?? ""}`.trim()}
      >
        Log In
      </button>
      <LoginModal open={open} onClose={() => setOpen(false)} />
    </>
  );
} 