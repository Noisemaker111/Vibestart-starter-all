import { z } from "zod";

const BodySchema = z.object({
  prompt: z.string().min(1, "Prompt required"),
  model: z.string().default("gpt-image-1"),
  n: z.number().int().min(1).max(10).optional(),
  size: z.string().optional(), // e.g., "1024x1024"
  quality: z.enum(["low", "medium", "high"]).optional(),
  format: z.enum(["png", "jpeg", "webp"]).optional(),
  background: z.enum(["transparent", "opaque", "auto"]).optional(),
});

export const imageGenerationHandler = {
  async action({ request }: { request: Request }) {
    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    let parsedBody;
    try {
      const bodyJson = await request.json();
      parsedBody = BodySchema.parse(bodyJson);
    } catch (err: any) {
      return new Response(JSON.stringify({ error: err?.message || "Invalid body" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const apiKey = process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "OpenAI API key missing" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { prompt, model, n = 1, size, quality, format, background } = parsedBody;

    const body: Record<string, unknown> = {
      model,
      prompt,
      n,
    };
    if (size) body.size = size;
    if (quality) body.quality = quality;
    if (format) body.response_format = format;
    if (background) body.background = background;

    try {
      const openaiRes = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!openaiRes.ok) {
        const detail = await openaiRes.text();
        return new Response(detail, { status: openaiRes.status });
      }

      const data = await openaiRes.json();
      const urls: string[] = Array.isArray(data?.data)
        ? data.data
            .map((d: any) => {
              if (typeof d?.url === "string") return d.url;
              if (typeof d?.b64_json === "string") return `data:image/png;base64,${d.b64_json}`;
              return undefined;
            })
            .filter((u: any): u is string => typeof u === "string")
        : [];

      return new Response(JSON.stringify({ raw: data, urls }), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (err: any) {
      console.error("[imageGenerationHandler]", err);
      return new Response(JSON.stringify({ error: err?.message || "Image generation failed" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  },

  async loader() {
    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json" },
    });
  },
}; 