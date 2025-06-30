import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { streamText } from "ai";
import { DEFAULT_LLM_MODEL } from "@shared/constants";

interface ChatRequestBody {
  messages: Array<{ id?: string; role: "user" | "assistant" | "system"; content: string }>;
  model?: string;
  /** When true, response should be a JSON object. */
  structured?: boolean;
}

export const chatRouteHandler = {
  /**
   * POST handler – streams AI chat completions back to the client.
   * Expected body: { messages: [...], model?: string, structured?: boolean }
   */
  async action({ request }: { request: Request }) {
    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    let body: ChatRequestBody;
    try {
      body = await request.json();
    } catch {
      return new Response("Invalid JSON body", { status: 400 });
    }

    const { messages, model, structured } = body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response("No messages provided", { status: 400 });
    }

    // Choose model (OpenRouter supports many IDs)
    const chosenModel = model || DEFAULT_LLM_MODEL;

    try {
      const apiKey = process.env.VITE_OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY;
      if (!apiKey) {
        return new Response(JSON.stringify({ error: "OpenRouter API key missing" }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }

      const openrouter = createOpenRouter({ apiKey });

      const result = streamText({
        model: openrouter(chosenModel) as any,
        messages,
        system: structured
          ? "You are a helpful AI. Respond only with valid, compact JSON."
          : undefined,
      }) as any;

      // Return Node/Web Response stream
      return result.toDataStreamResponse();
    } catch (err: any) {
      console.error("[chatRouteHandler]", err);
      return new Response(JSON.stringify({ error: err?.message || "AI error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  },

  async loader() {
    return new Response(
      JSON.stringify({ ok: true }),
      { headers: { "Content-Type": "application/json" } }
    );
  },
}; 