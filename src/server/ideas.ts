import { IdeaSchema } from "@shared/schema";
import { createIdea, listIdeas } from "@server/db/queries/ideas";
import { getUserVote } from "@server/db/queries/votes";

export async function action({ request }: { request: Request }) {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }
  try {
    const data = await request.json();
    const parsed = IdeaSchema.parse(data);
    const created = await createIdea({
      text: parsed.text,
      user_id: parsed.user_id ?? null,
      author_name: parsed.author_name ?? null,
      author_avatar_url: parsed.author_avatar_url ?? null,
    });

    const ideaResponse = {
      ...created,
      author: {
        name: created.author_name ?? "Anon",
        avatar_url: created.author_avatar_url ?? null,
      },
    };

    return new Response(JSON.stringify({ success: true, idea: ideaResponse }), {
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

export async function loader({ request }: { request: Request }): Promise<Response> {
  const url = new URL(request.url);
  const userId = url.searchParams.get("user_id");
  try {
    const ideasRaw = await listIdeas();
    const ideas = await Promise.all(
      ideasRaw.map(async (i) => {
        const userVote = userId ? await getUserVote(i.id, userId) : 0;
        return {
          ...i,
          author: {
            name: i.author_name ?? "Anon",
            avatar_url: i.author_avatar_url ?? null,
          },
          userVote,
        };
      })
    );

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