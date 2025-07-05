import { useAuth } from "@pages/components/integrations/auth/AuthContext";

// ---------------------------------------------------------------------------
// Helper – determines if the current visitor is allowed to hit real services.
// In development we always allow. In production, only the hash of the email
// defined in VITE_DEV_EMAIL_HASH is considered authorised.
// ---------------------------------------------------------------------------

// Tiny FNV-1a hash (32-bit) – deterministic & synchronous, adequate for obscurity
function hashString(str: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = (hash * 0x1000193) >>> 0; // unsigned
  }
  return hash.toString(16);
}

export function useCanCallIntegrations() {
  const { session } = useAuth();
  const authorisedHash = import.meta.env.VITE_DEV_EMAIL_HASH as string | undefined;
  const sessionEmail = session?.user?.email?.toLowerCase() ?? "";
  const isAuthorisedProdUser = !!(
    authorisedHash &&
    session &&
    hashString(sessionEmail) === authorisedHash.toLowerCase()
  );
  return import.meta.env.DEV || isAuthorisedProdUser;
}
