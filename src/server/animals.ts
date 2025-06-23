import { db } from "@server/db";
import { animalsTable } from "@server/db/schema";
import { and, eq } from "drizzle-orm";

export const animalsRouteHandler = {
  async loader() {
    const rows = await db.select().from(animalsTable);
    return new Response(JSON.stringify(rows), {
      headers: { "Content-Type": "application/json" },
    });
  },

  async action({ request }: { request: Request }) {
    try {
      const payload = await request.json();

      if (Array.isArray(payload?.names)) {
        // Insert multiple names
        const insertPayload = payload.names
          .filter((n: unknown) => typeof n === "string" && n.trim())
          .map((name: string) => ({ name }));

        if (insertPayload.length === 0) {
          return new Response(JSON.stringify({ error: "No valid names provided" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }

        await db.insert(animalsTable).values(insertPayload);
        return new Response(JSON.stringify({ success: true }), {
          headers: { "Content-Type": "application/json" },
        });
      }

      if (typeof payload?.name === "string" && payload.name.trim()) {
        await db.insert(animalsTable).values({ name: payload.name.trim() });
        return new Response(JSON.stringify({ success: true }), {
          headers: { "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ error: "Invalid payload" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    } catch (err: any) {
      return new Response(
        JSON.stringify({ error: err?.message || "Internal Server Error" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  },
}; 