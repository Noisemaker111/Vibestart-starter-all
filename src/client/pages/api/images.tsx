import { db } from "@server/db";
import { uploadsTable } from "@server/db/schema";
import { desc, eq } from "drizzle-orm";
import { verify, generateSignedToken } from "@server/utils/anonToken";

export async function loader({ request }: { request: Request }) {
  const cookieName = "anon_token";
  const incomingCookie = request.headers
    .get("cookie")?.split(/;\s*/)
    .find((c) => c.startsWith(`${cookieName}=`))
    ?.split("=")[1];
  let token = verify(incomingCookie) ?? null;
  let setCookieHeader: string | null = null;
  if (!token) {
    const { id, cookie } = generateSignedToken();
    token = id;
    setCookieHeader = `${cookieName}=${cookie}; Path=/; HttpOnly; SameSite=Lax; Max-Age=31536000`;
  }

  const images = await db
    .select()
    .from(uploadsTable)
    .where(eq(uploadsTable.owner_token, token))
    .orderBy(desc(uploadsTable.created_at))
    .limit(50);

  const headers = new Headers({ "Content-Type": "application/json" });
  if (setCookieHeader) headers.set("Set-Cookie", setCookieHeader);

  return new Response(JSON.stringify(images), { headers });
}

export async function action({ request }: { request: Request }) {
  if (request.method === "DELETE") {
    const cookieName = "anon_token";
    const incomingCookie = request.headers
      .get("cookie")?.split(/;\s*/)
      .find((c) => c.startsWith(`${cookieName}=`))
      ?.split("=")[1];
    const token = verify(incomingCookie) ?? null;
    if (!token) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    await db.delete(uploadsTable).where(eq(uploadsTable.owner_token, token));
    return new Response(JSON.stringify({ success: true }));
  }
  return new Response(null, { status: 405 });
} 