import { z } from "zod";
import { checkBotId } from "botid/server";
import { canCallIntegrations } from "../utils/security";
import { db, imageCreditsTable, imageGenerationsTable } from "@server/integrations/database";
import { eq } from "drizzle-orm";
import { verify, generateSignedToken, getUserRoleFromRequest } from "@server/utils/security";

const BodySchema = z.object({
  prompt: z.string().min(1, "Prompt required"),
  model: z.string().default("gpt-image-1"),
  n: z.number().int().min(1).max(10).optional(),
  size: z.string().optional(),
  quality: z.enum(["low", "medium", "high"]).optional(),
  format: z.enum(["png", "jpeg", "webp"]).optional(),
  background: z.enum(["transparent", "opaque", "auto"]).optional(),
});

export const imageGenerationHandler = {
  async action({ request }: { request: Request }) {
    if (request.method !== "POST") return new Response("Method Not Allowed", { status: 405 });
    if (!canCallIntegrations(request)) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });
    const botCheck = import.meta.env.DEV ? { isBot: false } : await checkBotId();
    if (botCheck.isBot) return new Response(JSON.stringify({ error: "Access denied" }), { status: 403, headers: { "Content-Type": "application/json" } });

    // Determine owner token (anonymous or signed)
    const cookieName = "anon_token";
    const incomingCookie = request.headers.get("cookie")?.split(/;\s*/).find((c: string) => c.startsWith(`${cookieName}=`))?.split("=")[1];
    let ownerToken = verify(incomingCookie) ?? null;
    let setCookieHeader: string | null = null;
    if (!ownerToken) {
      const { id, cookie } = generateSignedToken();
      ownerToken = id;
      setCookieHeader = `${cookieName}=${cookie}; Path=/; HttpOnly; SameSite=Lax; Max-Age=31536000`;
    }

    let parsedBody;
    try {
      const bodyJson = await request.json();
      parsedBody = BodySchema.parse(bodyJson);
    } catch (err: any) {
      return new Response(JSON.stringify({ error: err?.message || "Invalid body" }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    const { n = 1 } = parsedBody;

    // Check and debit credits
    const role = getUserRoleFromRequest(request);
    const unlimited = role === "owner";

    const existingCreditRows = await db
      .select()
      .from(imageCreditsTable)
      .where(eq(imageCreditsTable.owner_token, ownerToken));
    const currentCredits = existingCreditRows[0]?.credits_available ?? 0;

    if (!unlimited && currentCredits < n) {
      return new Response(
        JSON.stringify({ error: "Insufficient credits" }),
        {
          status: 402,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Proceed with generation
    const apiKey = process.env.OPENAI_API_KEY ?? (import.meta as any).env?.VITE_OPENAI_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "OPENAI_API_KEY env var missing" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
    const { prompt, model, size, quality, format, background } = parsedBody;
    const body: Record<string, unknown> = { model, prompt, n };
    if (size) body.size = size;
    if (quality) body.quality = quality;
    if (format) body.response_format = format;
    if (background) body.background = background;
    try {
      const openaiRes = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
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

      // Debit credits and log generations in DB within a transaction-like flow
      await db.transaction(async (tx) => {
        // Update credits
        if (!unlimited) {
          if (existingCreditRows.length === 0) {
            await tx
              .insert(imageCreditsTable)
              .values({ owner_token: ownerToken, credits_available: currentCredits - urls.length });
          } else {
            await tx
              .update(imageCreditsTable)
              .set({ credits_available: currentCredits - urls.length })
              .where(eq(imageCreditsTable.owner_token, ownerToken));
          }
        }

        // Insert generation records
        if (urls.length > 0) {
          const insertValues = urls.map((u) => ({ url: u, prompt, owner_token: ownerToken }));
          await tx.insert(imageGenerationsTable).values(insertValues);
        }
      });

      const headers = new Headers({ "Content-Type": "application/json" });
      if (setCookieHeader) headers.set("Set-Cookie", setCookieHeader);
      return new Response(JSON.stringify({ raw: data, urls }), { headers });
    } catch (err: any) {
      console.error("[imageGenerationHandler]", err);
      return new Response(JSON.stringify({ error: err?.message || "Image generation failed" }), { status: 500, headers: { "Content-Type": "application/json" } });
    }
  },
  async loader() {
    return new Response(JSON.stringify({ ok: true }), { headers: { "Content-Type": "application/json" } });
  },
}; 