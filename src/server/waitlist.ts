import type { Route } from "@client/pages/+types/api.waitlist";
import { createWaitlistEntry } from "@server/db/queries/waitlist";
import { WaitlistSchema } from "@shared/schema";

export async function action({ request }: Route.ActionArgs) {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }
  const data = await request.json();
  try {
    const parsed = WaitlistSchema.parse(data);
    await createWaitlistEntry({
      name: parsed.name,
      company: parsed.company ?? null,
      occupation: parsed.occupation ?? null,
      state: parsed.state ?? null,
      country: parsed.country ?? null,
      level: parsed.level,
    });
    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: (error as Error).message, success: false }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
} 