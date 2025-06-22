import type { Route } from "@client/pages/+types/api.ideas";
import { IdeaSchema } from "@shared/schema";
import { createIdea, listIdeas } from "@server/db/queries/ideas";

export async function action({ request }: Route.ActionArgs) {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }
  try {
    const data = await request.json();
    const parsed = IdeaSchema.parse(data);
    const created = await createIdea({ text: parsed.text });
    return new Response(JSON.stringify({ success: true, idea: created }), {
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

export async function loader({}: Route.LoaderArgs): Promise<Response> {
  try {
    const ideas = await listIdeas();
    return new Response(JSON.stringify({ success: true, ideas }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: (error as Error).message, success: false }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
} 