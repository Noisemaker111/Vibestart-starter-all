import { checkBotId } from "botid/server";

export const botidRouteHandler = {
  async loader(): Promise<Response> {
    const verification = await checkBotId();
    const headers = { "Content-Type": "application/json" } as const;
    if (verification.isBot) {
      return new Response(JSON.stringify({ error: "Access denied", isBot: true }), { status: 403, headers });
    }
    return new Response(JSON.stringify({ isBot: false }), { headers });
  },
};

function hashString(str: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = (hash * 0x1000193) >>> 0;
  }
  return hash.toString(16);
}

export function canCallIntegrations(request?: Request): boolean {
  const authorisedHash = import.meta.env.VITE_DEV_EMAIL_HASH;
  if (!request) {
    const isDevBuild = typeof import.meta !== "undefined" && import.meta.env && import.meta.env.DEV;
    return isDevBuild || process.env.NODE_ENV !== "production";
  }
  const cookieName = "anon_token";
  const incomingCookie = request.headers.get("cookie")?.split(/;\s*/).find((c) => c.startsWith(`${cookieName}=`))?.split("=")[1];
  const token = verify(incomingCookie) ?? null;
  const isDevBuild = typeof import.meta !== "undefined" && import.meta.env && import.meta.env.DEV;
  if (isDevBuild || process.env.NODE_ENV !== "production") return true;
  if (!authorisedHash || !token) return false;
  const sessionEmail = "user@example.com";
  return hashString(sessionEmail) === authorisedHash.toLowerCase();
}

import { randomUUID } from "crypto";

export function generateSignedToken(): { id: string; cookie: string } {
  const id = randomUUID();
  return { id, cookie: id };
}

export function verify(cookieVal: string | undefined | null): string | null {
  if (!cookieVal) return null;
  const uuidv4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidv4Regex.test(cookieVal) ? cookieVal : null;
}

export const sign = (token: string): string => token; 