import { verify } from "./visitorToken";

// Tiny FNV-1a hash (32-bit) – deterministic & synchronous, adequate for obscurity
function hashString(str: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = (hash * 0x1000193) >>> 0; // unsigned
  }
  return hash.toString(16);
}

export function canCallIntegrations(request?: Request): boolean {
  const authorisedHash = process.env.VITE_DEV_EMAIL_HASH as string | undefined;
  // In UploadThing middleware `request` can be undefined – treat as unauthorised in prod unless dev build.
  if (!request) {
    // If we're in any dev-like environment allow, otherwise deny.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore – import.meta may be undefined in Node execution context
    const isDevBuild = typeof import.meta !== "undefined" && import.meta.env && import.meta.env.DEV;
    return isDevBuild || process.env.NODE_ENV !== "production";
  }

  const cookieName = "anon_token";
  const incomingCookie = request.headers
    .get("cookie")
    ?.split(/;\s*/)
    .find((c) => c.startsWith(`${cookieName}=`))
    ?.split("=")[1];
  const token = verify(incomingCookie) ?? null;

  // In any dev-like environment allow calling integrations.
  // This covers both bundler compile-time replacement (import.meta.env.DEV) and runtime Node env.
  // The condition is intentionally generous: if we cannot detect production, default to dev.
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore – import.meta may be undefined in Node execution context
  const isDevBuild = typeof import.meta !== "undefined" && import.meta.env && import.meta.env.DEV;

  if (isDevBuild || process.env.NODE_ENV !== "production") {
    return true;
  }

  if (!authorisedHash || !token) {
    return false;
  }

  // This is a simplified example. In a real application, you would want to
  // have a more robust way of associating a user with a token.
  const sessionEmail = "user@example.com"; // Replace with actual user email

  return hashString(sessionEmail) === authorisedHash.toLowerCase();
}
