import { db } from "@server/db";
import { animalsTable } from "@server/db/schema";
import { verify, generateSignedToken } from "@server/utils/anonToken";
import { eq } from "drizzle-orm";

export const animalsRouteHandler = {
  async loader({ request }: { request: Request }) {
    // Ensure each visitor has a signed anon token stored in cookie
    const cookieName = "anon_token";
    const incomingCookie = request.headers.get("cookie")?.split(/;\s*/).find((c) => c.startsWith(`${cookieName}=`))?.split("=")[1];
    let token = verify(incomingCookie) ?? null;
    let setCookieHeader: string | null = null;
    if (!token) {
      const { id, cookie } = generateSignedToken();
      token = id;
      setCookieHeader = `${cookieName}=${cookie}; Path=/; HttpOnly; SameSite=Lax; Max-Age=31536000`;
    }

    // Fetch only rows belonging to this token
    const rows = await db.select().from(animalsTable).where(eq(animalsTable.owner_token, token));
    const headers = new Headers({ "Content-Type": "application/json" });
    if (setCookieHeader) headers.set("Set-Cookie", setCookieHeader);

    return new Response(JSON.stringify(rows), {
      headers,
    });
  },

  async action({ request }: { request: Request }) {
    const cookieName = "anon_token";
    const incomingCookie = request.headers.get("cookie")?.split(/;\s*/).find((c) => c.startsWith(`${cookieName}=`))?.split("=")[1];
    let token = verify(incomingCookie) ?? null;
    let setCookieHeader: string | null = null;
    if (!token) {
      const { id, cookie } = generateSignedToken();
      token = id;
      setCookieHeader = `${cookieName}=${cookie}; Path=/; HttpOnly; SameSite=Lax; Max-Age=31536000`;
    }
    try {
      const payload = await request.json();
      const headers = new Headers({ "Content-Type": "application/json" });
      if (setCookieHeader) headers.set("Set-Cookie", setCookieHeader);

      if (Array.isArray(payload?.names)) {
        // Insert multiple names
        const insertPayload = payload.names
          .filter((n: unknown) => typeof n === "string" && n.trim())
          .map((name: string) => ({ name, owner_token: token }));

        if (insertPayload.length === 0) {
          return new Response(JSON.stringify({ error: "No valid names provided" }), {
            status: 400,
            headers,
          });
        }

        await db.insert(animalsTable).values(insertPayload);
        return new Response(JSON.stringify({ success: true }), {
          headers,
        });
      }

      if (typeof payload?.name === "string" && payload.name.trim()) {
        await db.insert(animalsTable).values({ name: payload.name.trim(), owner_token: token });
        return new Response(JSON.stringify({ success: true }), {
          headers,
        });
      }

      if (request.method === "DELETE") {
        await db.delete(animalsTable).where(eq(animalsTable.owner_token, token));
        return new Response(JSON.stringify({ success: true }), {
          headers,
        });
      }

      return new Response(JSON.stringify({ error: "Invalid payload" }), {
        status: 400,
        headers,
      });
    } catch (err: any) {
      const headers = new Headers({ "Content-Type": "application/json" });
      if (setCookieHeader) headers.set("Set-Cookie", setCookieHeader);
      return new Response(
        JSON.stringify({ error: err?.message || "Internal Server Error" }),
        {
          status: 500,
          headers,
        }
      );
    }
  },
}; 