import { db, animalsTable, uploadsTable } from "@server/integrations/database";
import { verify, generateSignedToken, botidRouteHandler } from "@server/utils/security";
import { eq, desc } from "drizzle-orm";
import { withLogging } from "@server/utils/logger";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { streamText } from "ai";
import { checkBotId } from "botid/server";
import { emailRouteHandler } from "@server/integrations/email";
import { polarRouteHandler } from "@server/integrations/polar";
import { polarWebhookRoute } from "@server/integrations/polar-webhook";
import { imageGenerationHandler } from "@server/integrations/image-generation";
import { tokenUsageRouteHandler } from "@server/integrations/token-usage";
import { routeHandler, utapi } from "@server/integrations/uploadthing";
import { imageGenerationsTable } from "@server/integrations/database";
import { imageCreditsTable } from "@server/integrations/database";
import { getUserRoleFromRequest } from "@server/utils/security";
// (fetch API provides the global Request type)

export async function loader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const path = url.pathname.replace('/api/', '');
  switch (path) {
    case 'animals': return withLogging(animalsLoader, "animals.loader")({ request });
    case 'botid': return withLogging(botidRouteHandler.loader, "botid.loader")({ request });
    case 'chat': return withLogging(chatLoader, "chat.loader")({ request });
    case 'credits': return withLogging(creditsLoader, "credits.loader")({ request });
    case 'image-generate': return withLogging(imageGenerationHandler.loader, "imageGenerate.loader")({ request });
    case 'images': return withLogging(imagesLoader, "images.loader")({ request });
    case 'my-generations': return withLogging(myGenerationsLoader, "myGenerations.loader")({ request });
    case 'polar': return withLogging(polarRouteHandler.loader, "polar.loader")({ request });
    case 'uploadthing': return withLogging(routeHandler.loader, "uploadthing.loader")({ request });
    default: return new Response("Not Found", { status: 404 });
  }
}

export async function action({ request }: { request: Request }) {
  const url = new URL(request.url);
  const path = url.pathname.replace('/api/', '');
  switch (path) {
    case 'animals': return withLogging(animalsAction, "animals.action")({ request });
    case 'chat': return withLogging(chatAction, "chat.action")({ request });
    case 'credits': return withLogging(creditsAction, "credits.action")({ request });
    case 'email': return withLogging(emailRouteHandler.action, "email.action")({ request });
    case 'image-generate': return withLogging(imageGenerationHandler.action, "imageGenerate.action")({ request });
    case 'images': return withLogging(imagesAction, "images.action")({ request });
    // Note: my-generations is GET only at present
    case 'polar/webhook': return withLogging(polarWebhookRoute.action, "polarWebhook.action")({ request });
    case 'polar': return withLogging(polarRouteHandler.action, "polar.action")({ request });
    case 'token-usage': return withLogging(tokenUsageRouteHandler.action, "tokenUsage.action")({ request });
    case 'uploadthing': return withLogging(routeHandler.action, "uploadthing.action")({ request });
    default: return new Response("Not Found", { status: 404 });
  }
}

// Moved from animals.ts
async function animalsLoader({ request }: { request: Request }) {
  const cookieName = "anon_token";
  const incomingCookie = request.headers.get("cookie")?.split(/;\s*/).find((c: string) => c.startsWith(`${cookieName}=`))?.split("=")[1];
  let token = verify(incomingCookie) ?? null;
  let setCookieHeader: string | null = null;
  if (!token) {
    const { id, cookie } = generateSignedToken();
    token = id;
    setCookieHeader = `${cookieName}=${cookie}; Path=/; HttpOnly; SameSite=Lax; Max-Age=31536000`;
  }
  const rows = await db.select().from(animalsTable).where(eq(animalsTable.owner_token, token));
  const headers = new Headers({ "Content-Type": "application/json" });
  if (setCookieHeader) headers.set("Set-Cookie", setCookieHeader);
  return new Response(JSON.stringify(rows), { headers });
}

async function animalsAction({ request }: { request: Request }) {
  const cookieName = "anon_token";
  const incomingCookie = request.headers.get("cookie")?.split(/;\s*/).find((c: string) => c.startsWith(`${cookieName}=`))?.split("=")[1];
  let token = verify(incomingCookie) ?? null;
  let setCookieHeader: string | null = null;
  if (!token) {
    const { id, cookie } = generateSignedToken();
    token = id;
    setCookieHeader = `${cookieName}=${cookie}; Path=/; HttpOnly; SameSite=Lax; Max-Age=31536000`;
  }
  try {
    const payload = await request.json();
    const headers = new Headers({ "Content-Type": "application/json" });
    if (setCookieHeader) headers.set("Set-Cookie", setCookieHeader);
    if (Array.isArray(payload?.names)) {
      const insertPayload = payload.names.filter((n: unknown) => typeof n === "string" && n.trim()).map((name: string) => ({ name, owner_token: token }));
      if (insertPayload.length === 0) return new Response(JSON.stringify({ error: "No valid names provided" }), { status: 400, headers });
      await db.insert(animalsTable).values(insertPayload);
      return new Response(JSON.stringify({ success: true }), { headers });
    }
    if (typeof payload?.name === "string" && payload.name.trim()) {
      await db.insert(animalsTable).values({ name: payload.name.trim(), owner_token: token });
      return new Response(JSON.stringify({ success: true }), { headers });
    }
    if (request.method === "DELETE") {
      await db.delete(animalsTable).where(eq(animalsTable.owner_token, token));
      return new Response(JSON.stringify({ success: true }), { headers });
    }
    return new Response(JSON.stringify({ error: "Invalid payload" }), { status: 400, headers });
  } catch (err: any) {
    const headers = new Headers({ "Content-Type": "application/json" });
    if (setCookieHeader) headers.set("Set-Cookie", setCookieHeader);
    return new Response(JSON.stringify({ error: err?.message || "Internal Server Error" }), { status: 500, headers });
  }
}

// Moved from chat.ts
interface ChatRequestBody {
  messages: Array<{ id?: string; role: "user" | "assistant" | "system"; content: string }>;
  model?: string;
  structured?: boolean;
}

async function chatAction({ request }: { request: Request }) {
  if (request.method !== "POST") return new Response("Method Not Allowed", { status: 405 });
  const botCheck = import.meta.env.DEV ? { isBot: false } : await checkBotId();
  if (botCheck.isBot) return new Response(JSON.stringify({ error: "Access denied" }), { status: 403, headers: { "Content-Type": "application/json" } });
  let body: ChatRequestBody;
  try { body = await request.json(); } catch { return new Response("Invalid JSON body", { status: 400 }); }
  const { messages, model, structured } = body;
  if (!Array.isArray(messages) || messages.length === 0) return new Response("No messages provided", { status: 400 });
  const chosenModel = model || import.meta.env.VITE_DEFAULT_LLM_MODEL;
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "OPENROUTER_API_KEY env var missing" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
  try {
    const openrouter = createOpenRouter({ apiKey });
    const result = streamText({ model: openrouter(chosenModel) as any, messages, system: structured ? "You are a helpful AI. Respond only with valid, compact JSON." : undefined }) as any;
    return result.toDataStreamResponse();
  } catch (err: any) {
    console.error("[chat.server]", err);
    return new Response(JSON.stringify({ error: err?.message || "AI error" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}

async function chatLoader({ request: _ }: { request: Request }) {
  return new Response(JSON.stringify({ ok: true }), { headers: { "Content-Type": "application/json" } });
}

// Moved from images.ts
async function imagesLoader({ request }: { request: Request }) {
  const cookieName = "anon_token";
  const incomingCookie = request.headers.get("cookie")?.split(/;\s*/).find((c: string) => c.startsWith(`${cookieName}=`))?.split("=")[1];
  let token = verify(incomingCookie) ?? null;
  let setCookieHeader: string | null = null;
  if (!token) {
    const { id, cookie } = generateSignedToken();
    token = id;
    setCookieHeader = `${cookieName}=${cookie}; Path=/; HttpOnly; SameSite=Lax; Max-Age=31536000`;
  }
  const images = await db.select().from(uploadsTable).where(eq(uploadsTable.owner_token, token)).orderBy(desc(uploadsTable.created_at)).limit(50);
  const headers = new Headers({ "Content-Type": "application/json" });
  if (setCookieHeader) headers.set("Set-Cookie", setCookieHeader);
  return new Response(JSON.stringify(images), { headers });
}

async function imagesAction({ request }: { request: Request }) {
  if (request.method === "DELETE") {
    const cookieName = "anon_token";
    const incomingCookie = request.headers.get("cookie")?.split(/;\s*/).find((c: string) => c.startsWith(`${cookieName}=`))?.split("=")[1];
    const token = verify(incomingCookie) ?? null;
    if (!token) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    const rows = await db.select({ key: uploadsTable.key }).from(uploadsTable).where(eq(uploadsTable.owner_token, token));
    if (rows.length > 0) {
      try { await utapi.deleteFiles(rows.map((r) => r.key)); } catch (err) { console.error("[images] Failed to delete UploadThing files", err); }
    }
    await db.delete(uploadsTable).where(eq(uploadsTable.owner_token, token));
    return new Response(JSON.stringify({ success: true }));
  }
  return new Response(null, { status: 405 });
}

async function myGenerationsLoader({ request }: { request: Request }) {
  const cookieName = "anon_token";
  const incomingCookie = request.headers.get("cookie")?.split(/;\s*/).find((c: string) => c.startsWith(`${cookieName}=`))?.split("=")[1];
  let token = verify(incomingCookie) ?? null;
  let setCookieHeader: string | null = null;
  if (!token) {
    const { id, cookie } = generateSignedToken();
    token = id;
    setCookieHeader = `${cookieName}=${cookie}; Path=/; HttpOnly; SameSite=Lax; Max-Age=31536000`;
  }

  const rows = await db
    .select({ id: imageGenerationsTable.id, url: imageGenerationsTable.url, prompt: imageGenerationsTable.prompt, created_at: imageGenerationsTable.created_at })
    .from(imageGenerationsTable)
    .where(eq(imageGenerationsTable.owner_token, token))
    .orderBy(desc(imageGenerationsTable.created_at))
    .limit(50);

  const headers = new Headers({ "Content-Type": "application/json" });
  if (setCookieHeader) headers.set("Set-Cookie", setCookieHeader);
  return new Response(JSON.stringify(rows), { headers });
}

// ────────────────────────────────────────────────────────────────────────────────
// Credits endpoint – GET returns balance, POST initializes credits based on role
// ────────────────────────────────────────────────────────────────────────────────

async function creditsLoader({ request }: { request: Request }) {
  const role = getUserRoleFromRequest(request);

  // Owners have unlimited credits (represented as -1)
  if (role === "owner") {
    return new Response(JSON.stringify({ credits: -1 }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  const cookieName = "anon_token";
  const incomingCookie = request.headers
    .get("cookie")
    ?.split(/;\s*/)
    .find((c) => c.startsWith(`${cookieName}=`))
    ?.split("=")[1];
  let token = verify(incomingCookie) ?? null;
  let setCookieHeader: string | null = null;
  if (!token) {
    const { id, cookie } = generateSignedToken();
    token = id;
    setCookieHeader = `${cookieName}=${cookie}; Path=/; HttpOnly; SameSite=Lax; Max-Age=31536000`;
  }

  const row = await db
    .select()
    .from(imageCreditsTable)
    .where(eq(imageCreditsTable.owner_token, token))
    .limit(1);
  const credits = row[0]?.credits_available ?? 0;

  const headers = new Headers({ "Content-Type": "application/json" });
  if (setCookieHeader) headers.set("Set-Cookie", setCookieHeader);
  return new Response(JSON.stringify({ credits }), { headers });
}

async function creditsAction({ request }: { request: Request }) {
  if (request.method !== "POST")
    return new Response("Method Not Allowed", { status: 405 });

  const role = getUserRoleFromRequest(request);

  const cookieName = "anon_token";
  const incomingCookie = request.headers
    .get("cookie")
    ?.split(/;\s*/)
    .find((c) => c.startsWith(`${cookieName}=`))
    ?.split("=")[1];
  let token = verify(incomingCookie) ?? null;
  let setCookieHeader: string | null = null;
  if (!token) {
    const { id, cookie } = generateSignedToken();
    token = id;
    setCookieHeader = `${cookieName}=${cookie}; Path=/; HttpOnly; SameSite=Lax; Max-Age=31536000`;
  }

  const targetCredits = role === "owner" ? -1 : role === "admin" ? 100 : 4;

  const existing = await db
    .select()
    .from(imageCreditsTable)
    .where(eq(imageCreditsTable.owner_token, token))
    .limit(1);

  if (existing.length === 0) {
    await db.insert(imageCreditsTable).values({
      owner_token: token,
      credits_available: targetCredits,
    });
  } else {
    const current = existing[0].credits_available;
    if (current < targetCredits) {
      await db
        .update(imageCreditsTable)
        .set({ credits_available: targetCredits })
        .where(eq(imageCreditsTable.owner_token, token));
    }
  }

  const headers = new Headers({ "Content-Type": "application/json" });
  if (setCookieHeader) headers.set("Set-Cookie", setCookieHeader);
  return new Response(JSON.stringify({ success: true, credits: targetCredits }), {
    headers,
  });
}