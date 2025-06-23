import { ideasTable } from "@server/db/schema";
import { db } from "@server/db";
import { eq } from "drizzle-orm";

export async function action({ request }: { request: Request }) {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { user_id, avatar_url } = await request.json();
    if (!user_id || !avatar_url) {
      return new Response(JSON.stringify({ error: "Missing params" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    await db
      .update(ideasTable)
      .set({ author_avatar_url: avatar_url })
      .where(eq(ideasTable.user_id, user_id));

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
} 