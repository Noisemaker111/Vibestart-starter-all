import { createHmac, randomUUID } from "crypto";

const SECRET = process.env.ANON_TOKEN_SECRET;
if (!SECRET) {
  throw new Error("ANON_TOKEN_SECRET env var is required");
}

export function sign(token: string): string {
  const sig = createHmac("sha256", SECRET).update(token).digest("base64url");
  return `${token}.${sig}`;
}

export function verify(cookieVal: string | undefined | null): string | null {
  if (!cookieVal) return null;
  const [id, sig] = cookieVal.split(".");
  if (!id || !sig) return null;
  return sign(id) === cookieVal ? id : null;
}

export function generateSignedToken(): { id: string; cookie: string } {
  const id = randomUUID();
  return { id, cookie: sign(id) };
} 