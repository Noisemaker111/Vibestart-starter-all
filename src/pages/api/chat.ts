import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { streamText } from "ai";
import { checkBotId } from "botid/server";

const DEFAULT_LLM_MODEL = "google/gemini-2.5-flash";

interface ChatRequestBody {
  messages: Array<{ id?: string; role: "user" | "assistant" | "system"; content: string }>;
  model?: string;
  structured?: boolean;
}

export async function action({ request }: { request: Request }) {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const botCheck = import.meta.env.DEV ? { isBot: false } : await checkBotId();
  if (botCheck.isBot) {
    return new Response(JSON.stringify({ error: "Access denied" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
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

  const chosenModel = model || DEFAULT_LLM_MODEL;
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "OpenRouter API key missing" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const openrouter = createOpenRouter({ apiKey });
    const result = streamText({
      model: openrouter(chosenModel) as any,
      messages,
      system: structured ? "You are a helpful AI. Respond only with valid, compact JSON." : undefined,
    }) as any;
    return result.toDataStreamResponse();
  } catch (err: any) {
    console.error("[chat.server]", err);
    return new Response(JSON.stringify({ error: err?.message || "AI error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function loader() {
  return new Response(JSON.stringify({ ok: true }), {
    headers: { "Content-Type": "application/json" },
  });
} 