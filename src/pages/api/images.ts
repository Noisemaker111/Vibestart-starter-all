import { db } from "@server/db";
import { uploadsTable } from "@server/db/schema";
import { desc, eq } from "drizzle-orm";
import { verify, generateSignedToken } from "@server/utils/visitorToken";
import { utapi } from "@server/uploadthing";
import { withLogging } from "@server/utils/logger";

async function loaderHandler({ request }: { request: Request }) {
  const cookieName = "anon_token";
  const incomingCookie = request.headers
    .get("cookie")?.split(/;\s*/)
    .find((c: string) => c.startsWith(`${cookieName}=`))
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

async function actionHandler({ request }: { request: Request }) {
  if (request.method === "DELETE") {
    const cookieName = "anon_token";
    const incomingCookie = request.headers
      .get("cookie")?.split(/;\s*/)
      .find((c: string) => c.startsWith(`${cookieName}=`))
      ?.split("=")[1];
    const token = verify(incomingCookie) ?? null;
    if (!token) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const rows = await db.select({ key: uploadsTable.key }).from(uploadsTable).where(eq(uploadsTable.owner_token, token));

    if (rows.length > 0) {
      try {
        await utapi.deleteFiles(rows.map((r) => r.key));
      } catch (err) {
        console.error("[images] Failed to delete UploadThing files", err);
      }
    }

    await db.delete(uploadsTable).where(eq(uploadsTable.owner_token, token));
    return new Response(JSON.stringify({ success: true }));
  }
  return new Response(null, { status: 405 });
}

export const loader = withLogging(loaderHandler, "images.loader");
export const action = withLogging(actionHandler, "images.action"); 