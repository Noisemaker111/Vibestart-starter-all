import { upsertIdeaVote } from "@server/db/queries/votes";

export async function action({ request, params }: { request: Request; params: any }) {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  const ideaId = Number(params.id);
  if (isNaN(ideaId)) {
    return new Response(JSON.stringify({ error: "Invalid idea id" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const body = await request.json();
  const { value, user_id } = body as { value: 1 | -1 | 0; user_id?: string };
  if (!user_id) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (![1, -1, 0].includes(value)) {
    return new Response(JSON.stringify({ error: "Invalid vote value" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const score = await upsertIdeaVote(ideaId, user_id, value as any);
    return new Response(JSON.stringify({ success: true, score, userVote: value }), {
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