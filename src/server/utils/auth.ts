
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

export function canCallIntegrations(request: Request): boolean {
  const authorisedHash = process.env.VITE_DEV_EMAIL_HASH as string | undefined;
  const cookieName = "anon_token";
  const incomingCookie = request.headers
    .get("cookie")
    ?.split(/;\s*/)
    .find((c) => c.startsWith(`${cookieName}=`))
    ?.split("=")[1];
  const token = verify(incomingCookie) ?? null;

  if (process.env.DEV) {
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
