
import { z } from "zod";
export {}; // ensure this file is treated as a module

declare global {
  interface Window {
    processIdea?: typeof processIdea;
  }
}
// Full merge
// From integrationLLM.ts
export interface SpecificationResponse { platform?: string; error?: string; requestBody?: string; rawContent?: string; }
export interface ImageInput { url?: string; base64?: string; type: "url" | "base64"; }
export async function processIdea(idea: string, second?: ImageInput[] | string, third?: string | "structured" | "text", fourth?: "structured" | "text"): Promise<SpecificationResponse> {
  if (import.meta.env.DEV) console.log("[processIdea]", idea);
  let images: ImageInput[] | undefined;
  let model: string | undefined;
  let generation: "structured" | "text" = "structured";
  if (Array.isArray(second)) {
    images = second;
    if (typeof third === "string" && (third === "structured" || third === "text")) {
      generation = third;
      model = fourth as string | undefined;
    } else {
      model = third as string | undefined;
      generation = (fourth as any) ?? "structured";
    }
  } else if (typeof second === "string") {
    if (second === "structured" || second === "text") {
      generation = second;
      model = third as string | undefined;
    } else {
      model = second;
      if (typeof third === "string" && (third === "structured" || third === "text")) {
        generation = third;
      }
    }
  }
  if (!model) {
    console.warn("processIdea: model not specified, falling back to default – provide model explicitly for clarity");
    model = import.meta.env.VITE_DEFAULT_LLM_MODEL;
  }
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
  if (import.meta.env.DEV) console.debug("[processIdea] idea", idea, "images", images?.length);
  if (!apiKey) {
    console.warn("OpenRouter API key missing – skipping AI integration selection");
    return { error: "OpenRouter API key missing" };
  }
  const userContent: Array<{ type: "text"; text: string } | { type: "image_url"; image_url: { url: string } }> = [{ type: "text", text: `Analyze this idea and return the required integrations: ${idea}` }];
  if (images && images.length > 0) {
    for (const img of images) {
      let imgUrl: string | undefined;
      if (img.type === "base64" && img.base64) {
        imgUrl = `data:image/jpeg;base64,${img.base64}`;
      } else if (img.type === "url" && img.url) {
        imgUrl = img.url;
      }
      if (imgUrl) userContent.push({ type: "image_url", image_url: { url: imgUrl } });
    }
  }
  const bodyObj = {
    model,
    temperature: 0.1,
    ...(generation === "structured" ? { response_format: { type: "json_object" as const } } : {}),
    messages: [
      {
        role: "system",
        content: generation === "structured" ? "You are an API assistant. Reply ONLY with a JSON object containing an optional string 'platform' and an array 'integrations' of required integration keys. Example: {\"platform\": \"web\", \"integrations\": [\"auth\", \"database\"] }" : "You are a helpful assistant.",
      },
      { role: "user", content: userContent },
    ],
  } as const;
  if (import.meta.env.DEV) console.debug("[processIdea] request body", bodyObj);
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": import.meta.env.VITE_SITE_URL,
      "X-Title": "JonStack",
    },
    body: JSON.stringify(bodyObj),
  });
  if (import.meta.env.DEV) console.debug("[processIdea] response status", response.status);
  if (!response.ok) {
    let errorDetails: unknown = null;
    try { errorDetails = await response.clone().json(); } catch {}
    let errMsg = `OpenRouter error ${response.status}`;
    if (errorDetails && typeof errorDetails === "object") {
      const maybeMsg = (errorDetails as any).message || (errorDetails as any).error || (errorDetails as any).detail;
      if (maybeMsg && typeof maybeMsg === "string") errMsg += ` – ${maybeMsg}`;
    }
    if (import.meta.env.DEV) console.error(errMsg, errorDetails);
    return { error: errMsg };
  }
  const data = await response.json();
  const rawContent: string = (data?.choices?.[0]?.message?.content ?? "").trim();
  if (import.meta.env.DEV) console.debug("[processIdea] raw content", rawContent);
  if (generation !== "structured") return { rawContent } as SpecificationResponse;
  try {
    let jsonText = rawContent;
    if (jsonText.startsWith("```")) jsonText = jsonText.replace(/^```[a-zA-Z]*\s*/i, "").replace(/```\s*$/, "").trim();
    if (jsonText === "") throw new Error("Empty JSON received from model");
    const decodedJson = JSON.parse(jsonText);
    const SpecObject = z.object({ platform: z.string().optional() });
    const spec = SpecObject.parse(decodedJson);
    const platform: string | undefined = spec.platform;
    try {
      const usage = (data as any)?.usage;
      if (usage && typeof usage.prompt_tokens === "number" && typeof usage.completion_tokens === "number") {
        fetch("/api/token-usage", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idea, promptTokens: usage.prompt_tokens, completionTokens: usage.completion_tokens }),
        }).catch(() => {/* fire-and-forget */});
      }
    } catch {/* ignore */}
    return { platform, requestBody: JSON.stringify(bodyObj, null, 2), rawContent };
  } catch (err) {
    if (import.meta.env.DEV) console.error("[processIdea] Failed to parse integration list", rawContent, err);
    return { error: (err as Error)?.message ?? "Parse error", requestBody: JSON.stringify(bodyObj, null, 2), rawContent };
  }
}
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = (err) => reject(err);
  });
};
export const isValidImageUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};
export const isSupportedImageType = (file: File): boolean => {
  const supported = ["image/png", "image/jpeg", "image/webp"];
  return supported.includes(file.type);
};
export async function generateImages(prompt: string, model: string, options: { n?: number; size?: string; quality?: "low" | "medium" | "high"; format?: "png" | "jpeg" | "webp"; background?: "transparent" | "opaque" | "auto" } = {}): Promise<{ raw: string; urls: string[]; error?: string }> {
  const openAiModels = ["gpt-image-1", "dall-e", "openai/"];
  const isOpenAI = openAiModels.some((m) => model.includes(m));
  if (isOpenAI) {
    try {
      const response = await fetch("/api/image-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, model, ...options }),
      });
      if (!response.ok) {
        const text = await response.text();
        return { raw: text, urls: [], error: `OpenAI image error ${response.status}` };
      }
      const data = await response.json();
      return { raw: typeof data.raw === "string" ? data.raw : JSON.stringify(data.raw), urls: data.urls ?? [], error: data.error };
    } catch (err: any) {
      const message = err?.message || "OpenAI image generation failed";
      return { raw: "", urls: [], error: message };
    }
  }
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
  if (!apiKey) return { raw: "", urls: [], error: "OpenRouter API key missing" };
  const { n = 1, size = "1024x1024" } = options;
  try {
    const body = { model, prompt, n, size } as const;
    const response = await fetch("https://openrouter.ai/api/v1/images/generations", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json", "HTTP-Referer": import.meta.env.VITE_SITE_URL, "X-Title": "JonStack" },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      const raw = await response.text();
      return { raw, urls: [], error: `OpenRouter image error ${response.status}` };
    }
    const dataImg = await response.json();
    const urls: string[] = Array.isArray(dataImg?.data) ? dataImg.data.map((d: any) => {
      if (typeof d?.url === "string") return d.url;
      if (typeof d?.b64_json === "string") return `data:image/png;base64,${d.b64_json}`;
      return undefined;
    }).filter((u: any): u is string => typeof u === "string") : [];
    return { raw: JSON.stringify(dataImg), urls };
  } catch (err: any) {
    const message = err?.message || "Image generation failed";
    console.error("[generateImages]", message, err);
    return { raw: "", urls: [], error: message };
  }
}
if (typeof window !== "undefined" && import.meta.env.DEV) {
  if (!window.processIdea) {
    (window as any).processIdea = processIdea;
    console.info("%cprocessIdea() available in console. Example:\n  processIdea('Generate a SaaS idea…').then(r => console.log(r));", "color: purple; font-weight: bold;");
  }
}

// From rateLimit.ts
export interface RateLimitInfo { remaining: number; resetTime: number; total: number; retryAfter?: number; }
export interface RateLimitError { code: 'RATE_LIMIT_EXCEEDED'; message: string; remaining: number; resetTime: number; retryAfter: number; }
export type RateLimitType = 'anon_ideas' | 'auth_ideas' | 'auth_votes';
const hasStorage = typeof localStorage !== "undefined";
function lsGet(key: string): string | null { return hasStorage ? localStorage.getItem(key) : null; }
function lsSet(key: string, value: string): void { if (hasStorage) localStorage.setItem(key, value); }
const rateLimitCache = new Map<string, RateLimitInfo & { lastUpdated: number }>()
function getCacheKey(type: RateLimitType, identifier: string): string { return `${type}:${identifier}`; }
function getCachedRateLimit(type: RateLimitType, identifier: string): RateLimitInfo | null {
  const key = getCacheKey(type, identifier);
  const cached = rateLimitCache.get(key);
  if (!cached) return null;
  const now = Date.now();
  if (now - cached.lastUpdated > 30_000 || now >= cached.resetTime) {
    rateLimitCache.delete(key);
    return null;
  }
  return { remaining: cached.remaining, resetTime: cached.resetTime, total: cached.total, retryAfter: cached.retryAfter };
}
function setCachedRateLimit(type: RateLimitType, identifier: string, info: RateLimitInfo): void {
  const key = getCacheKey(type, identifier);
  rateLimitCache.set(key, { ...info, lastUpdated: Date.now() });
}
function extractRateLimitFromResponse(response: Response): RateLimitInfo | null {
  const remaining = response.headers.get('X-RateLimit-Remaining');
  const limit = response.headers.get('X-RateLimit-Limit');
  const reset = response.headers.get('X-RateLimit-Reset');
  const retryAfter = response.headers.get('Retry-After');
  if (remaining && limit && reset) return { remaining: parseInt(remaining, 10), total: parseInt(limit, 10), resetTime: parseInt(reset, 10), retryAfter: retryAfter ? parseInt(retryAfter, 10) : undefined };
  return null;
}
export async function syncRateLimitFromResponse(response: Response, type: RateLimitType, identifier: string): Promise<RateLimitInfo | null> {
  const rateLimitInfo = extractRateLimitFromResponse(response);
  if (rateLimitInfo) setCachedRateLimit(type, identifier, rateLimitInfo);
  if (response.status === 429) {
    try {
      const body = await response.clone().json();
      if (body.code === 'RATE_LIMIT_EXCEEDED') {
        const errorInfo: RateLimitInfo = { remaining: body.remaining ?? 0, resetTime: body.resetTime ?? Date.now() + 60000, total: rateLimitInfo?.total ?? 1, retryAfter: body.retryAfter };
        setCachedRateLimit(type, identifier, errorInfo);
        return errorInfo;
      }
    } catch {} 
  }
  return rateLimitInfo;
}
export function getRateLimitInfo(type: RateLimitType, identifier: string): RateLimitInfo | null { return getCachedRateLimit(type, identifier); }
export function canPerformAction(type: RateLimitType, identifier: string): boolean {
  const info = getCachedRateLimit(type, identifier);
  if (!info) return true;
  const now = Date.now();
  if (now >= info.resetTime) return true;
  return info.remaining > 0;
}
export function getTimeUntilNextAction(type: RateLimitType, identifier: string): number {
  const info = getCachedRateLimit(type, identifier);
  if (!info) return 0;
  const now = Date.now();
  if (info.remaining > 0) return 0;
  return Math.max(0, info.resetTime - now);
}
export interface RateLimitedFetchOptions extends RequestInit { rateLimitType?: RateLimitType; rateLimitIdentifier?: string; skipRateLimitCheck?: boolean; }
function formatSeconds(totalSeconds: number): string {
  const seconds = totalSeconds % 60;
  const minutesTotal = Math.floor(totalSeconds / 60);
  const minutes = minutesTotal % 60;
  const hours = Math.floor(minutesTotal / 60);
  const parts: string[] = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0 || hours > 0) parts.push(`${minutes}m`);
  parts.push(`${seconds}s`);
  return parts.join(" ");
}
export async function rateLimitedFetch(url: string, options: RateLimitedFetchOptions = {}): Promise<Response> {
  const { rateLimitType, rateLimitIdentifier, skipRateLimitCheck = false, ...fetchOptions } = options;
  if (!skipRateLimitCheck && rateLimitType && rateLimitIdentifier) {
    if (!canPerformAction(rateLimitType, rateLimitIdentifier)) {
      const timeUntil = getTimeUntilNextAction(rateLimitType, rateLimitIdentifier);
      throw new Error(`Rate limited. Try again in ${formatSeconds(Math.ceil(timeUntil / 1000))}.`);
    }
  }
  const response = await fetch(url, fetchOptions);
  if (rateLimitType && rateLimitIdentifier) await syncRateLimitFromResponse(response, rateLimitType, rateLimitIdentifier);
  if (response.status === 429) {
    const errorData = await response.clone().json().catch(() => ({}));
    if (errorData.code === 'RATE_LIMIT_EXCEEDED') {
      const error = new Error(errorData.error || 'Rate limit exceeded') as any;
      error.code = 'RATE_LIMIT_EXCEEDED';
      error.remaining = errorData.remaining;
      error.resetTime = errorData.resetTime;
      error.retryAfter = errorData.retryAfter;
      throw error;
    }
  }
  return response;
}
export function getAnonIdeaCooldownMs(): number {
  const info = getCachedRateLimit('anon_ideas', 'browser');
  if (!info) return 0;
  return Math.max(0, info.resetTime - Date.now());
}
export function getIdeaTokens(userId: string): number {
  const info = getCachedRateLimit('auth_ideas', userId);
  return info?.remaining ?? 5;
}
export function getVoteTokens(userId: string): number {
  const info = getCachedRateLimit('auth_votes', userId);
  return info?.remaining ?? 100;
}
export function consumeIdeaToken(userId: string): boolean { return canPerformAction('auth_ideas', userId); }
export function consumeVoteToken(userId: string): boolean { return canPerformAction('auth_votes', userId); }
export function timeUntilNextToken(type: "idea" | "vote", userId: string): number {
  const rateLimitType = type === "idea" ? "auth_ideas" : "auth_votes";
  return getTimeUntilNextAction(rateLimitType, userId);
}
export function recordAnonIdeaSubmit(): void {
  setCachedRateLimit('anon_ideas', 'browser', { remaining: 0, resetTime: Date.now() + 24 * 60 * 60 * 1000, total: 1 });
}
export function useRateLimit(type: RateLimitType, identifier: string) {
  const [info, setInfo] = React.useState(() => getCachedRateLimit(type, identifier));
  React.useEffect(() => {
    const interval = setInterval(() => {
      const updated = getCachedRateLimit(type, identifier);
      setInfo(updated);
    }, 1000);
    return () => clearInterval(interval);
  }, [type, identifier]);
  return {
    canPerform: info ? (info.remaining > 0 || Date.now() >= info.resetTime) : true,
    remaining: info?.remaining ?? null,
    resetTime: info?.resetTime ?? null,
    timeUntilNext: info ? getTimeUntilNextAction(type, identifier) : 0,
  };
}
import * as React from "react";
interface TokenBucketState { tokens: number; lastRefill: number; callsLastMinute: number[]; }
const localTokenBuckets = new Map<string, TokenBucketState>();
export function consumeLocalToken(bucketId: string, capacity: number, regenMsPerToken: number, maxPerMinute: number): boolean {
  const now = Date.now();
  let state = localTokenBuckets.get(bucketId);
  if (!state) {
    state = { tokens: capacity, lastRefill: now, callsLastMinute: [] };
    localTokenBuckets.set(bucketId, state);
  }
  const tokensToAdd = Math.floor((now - state.lastRefill) / regenMsPerToken);
  if (tokensToAdd > 0) {
    state.tokens = Math.min(capacity, state.tokens + tokensToAdd);
    state.lastRefill += tokensToAdd * regenMsPerToken;
  }
  state.callsLastMinute = state.callsLastMinute.filter((t) => now - t < 60_000);
  if (state.tokens <= 0) return false;
  if (state.callsLastMinute.length >= maxPerMinute) return false;
  state.tokens -= 1;
  state.callsLastMinute.push(now);
  return true;
}

// From uploadthing.ts
import { generateUploadButton, generateUploadDropzone, generateReactHelpers } from "@uploadthing/react";
import type { UploadRouter } from "../../server/integrations/uploadthing";
export interface UploadedFile { url: string; name: string; size: number; key: string; }
export interface UploadResponse { files: UploadedFile[]; }
export const UploadButton = generateUploadButton<UploadRouter>({ url: "/api/uploadthing" });
export const UploadDropzone = generateUploadDropzone<UploadRouter>({ url: "/api/uploadthing" });
export const { useUploadThing } = generateReactHelpers<UploadRouter>({ url: "/api/uploadthing" }); 