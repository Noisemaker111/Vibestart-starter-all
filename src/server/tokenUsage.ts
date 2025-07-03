export const tokenUsageRouteHandler = {
  async action({ request }: { request: Request }) {
    try {
      const { idea, promptTokens, completionTokens } = (await request.json()) as {
        idea?: string;
        promptTokens?: number;
        completionTokens?: number;
      };

      // Fall-back values
      const inTok = typeof promptTokens === "number" ? promptTokens : "?";
      const outTok = typeof completionTokens === "number" ? completionTokens : "?";
      const ideaLabel = idea ? `Idea "${idea.slice(0, 80)}" ` : "";

      console.log(`[${ideaLabel}Inputed:${inTok} tokens, Output ${outTok} tokens]`);

      return new Response(JSON.stringify({ ok: true }), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (err: any) {
      console.error("tokenUsageRouteHandler error", err);
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