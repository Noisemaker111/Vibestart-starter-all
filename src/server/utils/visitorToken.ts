import { randomUUID } from "crypto";

// ----------------------------------------------------------------------------------------
// Lightweight visitor token helpers
// ----------------------------------------------------------------------------------------
// We rely solely on the randomness of UUID-v4 values to identify unauthenticated visitors.
// No HMAC signing/verification or shared secret is required.

// Generates a bare UUID token that can be stored in a cookie.
export function generateSignedToken(): { id: string; cookie: string } {
  const id = randomUUID();
  return { id, cookie: id };
}

// Verifies that the supplied cookie value looks like a UUID-v4. Returns the token string or
// null if invalid/empty.
export function verify(cookieVal: string | undefined | null): string | null {
  if (!cookieVal) return null;
  const uuidv4Regex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidv4Regex.test(cookieVal) ? cookieVal : null;
}

// Kept for backward compatibility; now simply returns the token unchanged.
export const sign = (token: string): string => token; 