import type { AvailableIntegration } from "@shared/availableIntegrations";
import { promptHomeIdeaConverter } from "@shared/promptHomeIdeaConverter";
import { availableIntegrations } from "@shared/availableIntegrations";
import { z } from "zod";
import { DEFAULT_LLM_MODEL } from "@shared/constants";

export interface SpecificationResponse {
  platform?: string;
  integrations: AvailableIntegration[];
  error?: string;
  /** JSON sent to OpenRouter (pretty-printed) */
  requestBody?: string;
  /** Raw content string returned by the model (before parsing) */
  rawContent?: string;
}

export interface ImageInput {
  url?: string;
  base64?: string;
  type: "url" | "base64";
}

export const DEFAULT_MODEL = DEFAULT_LLM_MODEL;

export async function processIdea(
  idea: string,
  images?: ImageInput[],
  model?: string
): Promise<SpecificationResponse>;
export async function processIdea(
  idea: string,
  model?: string
): Promise<SpecificationResponse>;
export async function processIdea(
  idea: string,
  images: ImageInput[],
  model: string,
  generation: "structured" | "text"
): Promise<SpecificationResponse>;

export async function processIdea(
  idea: string,
  second?: ImageInput[] | string,
  third?: string | "structured" | "text",
  fourth?: "structured" | "text"
): Promise<SpecificationResponse> {
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
    model = DEFAULT_MODEL;
  }

  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY || import.meta.env.VITE_OPENROUTER_KEY;

  if (import.meta.env.DEV) console.debug("[processIdea] idea", idea, "images", images?.length);

  if (!apiKey) {
    console.warn("OpenRouter API key missing – skipping AI integration selection");
    return { integrations: [], error: "OpenRouter API key missing" };
  }

  // Build user content – first text, then any images provided
  const userContent: Array<
    | { type: "text"; text: string }
    | { type: "image_url"; image_url: { url: string } }
  > = [
    {
      type: "text",
      text: `Analyze this idea and return the required integrations: ${idea}`,
    },
  ];

  if (images && images.length > 0) {
    for (const img of images) {
      let imgUrl: string | undefined;
      if (img.type === "base64" && img.base64) {
        // Default to jpeg – could be extended to detect mime
        imgUrl = `data:image/jpeg;base64,${img.base64}`;
      } else if (img.type === "url" && img.url) {
        imgUrl = img.url;
      }
      if (imgUrl) {
        userContent.push({ type: "image_url", image_url: { url: imgUrl } });
      }
    }
  }

  const bodyObj = {
    model,
    temperature: 0.1,
    ...(generation === "structured" ? { response_format: { type: "json_object" as const } } : {}),
    messages: [
      {
        role: "system",
        content: generation === "structured" ? promptHomeIdeaConverter(idea) : "You are a helpful assistant.",
      },
      {
        role: "user",
        content: userContent,
      },
    ],
  } as const;

  // In development, log full request body for easy inspection in browser console
  if (import.meta.env.DEV) {
    console.debug("[processIdea] request body", bodyObj);
  }

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": import.meta.env.VITE_SITE_URL || window.location.origin,
      "X-Title": "JonStack", // site name for OpenRouter attribution
    },
    body: JSON.stringify(bodyObj),
  });

  if (import.meta.env.DEV) console.debug("[processIdea] response status", response.status);

  if (!response.ok) {
    let errorDetails: unknown = null;
    try {
      errorDetails = await response.clone().json();
    } catch {
      // ignore
    }
    let errMsg = `OpenRouter error ${response.status}`;
    if (errorDetails && typeof errorDetails === "object") {
      const maybeMsg = (errorDetails as any).message || (errorDetails as any).error || (errorDetails as any).detail;
      if (maybeMsg && typeof maybeMsg === "string") errMsg += ` – ${maybeMsg}`;
    }
    if (import.meta.env.DEV) console.error(errMsg, errorDetails);
    return { integrations: [], error: errMsg };
  }

  const data = await response.json();

  const rawContent: string = (data?.choices?.[0]?.message?.content ?? "").trim();

  if (import.meta.env.DEV) console.debug("[processIdea] raw content", rawContent);

  if (generation !== "structured") {
    // For non-structured requests, we don't parse JSON; just return raw content
    return { integrations: [], rawContent } as unknown as SpecificationResponse;
  }

  try {
    let jsonText = rawContent;

    // Remove fenced code blocks (```json ... ```)
    if (jsonText.startsWith("```")) {
      jsonText = jsonText.replace(/^```[a-zA-Z]*\s*/i, "").replace(/```\s*$/, "").trim();
    }

    if (jsonText === "") throw new Error("Empty JSON received from model");

    const decodedJson = JSON.parse(jsonText);

    // Zod schemas for robust validation
    const RawKeyArray = z.array(z.string());
    const SpecObject = z.object({
      platform: z.string().optional(),
      integrations: z.array(z.string()),
    });

    let integrationKeys: string[];
    let platform: string | undefined;

    if (RawKeyArray.safeParse(decodedJson).success) {
      integrationKeys = decodedJson as string[];
    } else {
      const spec = SpecObject.parse(decodedJson);
      integrationKeys = spec.integrations;
      platform = spec.platform;
    }

    const integrationsArray = mapKeysToIntegrations(integrationKeys);

    // ──────────────────────────────────────────────────────────
    // Token usage reporting – send to server so it appears in logs
    // ──────────────────────────────────────────────────────────
    try {
      const usage = (data as any)?.usage;
      if (usage && typeof usage.prompt_tokens === "number" && typeof usage.completion_tokens === "number") {
        fetch("/api/token-usage", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            idea,
            promptTokens: usage.prompt_tokens,
            completionTokens: usage.completion_tokens,
          }),
        }).catch(() => {/* fire-and-forget */});
      }
    } catch {/* ignore */}

    return {
      platform,
      integrations: integrationsArray,
      requestBody: JSON.stringify(bodyObj, null, 2),
      rawContent,
    };
  } catch (err) {
    if (import.meta.env.DEV) console.error("[processIdea] Failed to parse integration list", rawContent, err);
    return {
      integrations: [],
      error: (err as Error)?.message ?? "Parse error",
      requestBody: JSON.stringify(bodyObj, null, 2),
      rawContent,
    };
  }
}

function mapKeysToIntegrations(keys: string[]): AvailableIntegration[] {
  return keys
    .map((key) => availableIntegrations.find((i) => i.key === key))
    .filter((i): i is AvailableIntegration => Boolean(i));
}

// ----------------------------------------
// Helper utilities for external callers
// ----------------------------------------

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

// Quick helper to generate images; returns array of URLs if any detected in raw content.
export async function generateImages(
  prompt: string,
  model: string,
  options: { n?: number; size?: string; quality?: "low" | "medium" | "high"; format?: "png" | "jpeg" | "webp"; background?: "transparent" | "opaque" | "auto" } = {}
): Promise<{ raw: string; urls: string[]; error?: string }> {
  // Detect if this should go via OpenAI direct (handled server-side)
  const openAiModels = ["gpt-image-1", "dall-e", "openai/"]; // simple heuristic
  const isOpenAI = openAiModels.some((m) => model.includes(m));

  if (isOpenAI) {
    try {
      const response = await fetch("/api/image-generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt, model, ...options }),
      });

      if (!response.ok) {
        const text = await response.text();
        return { raw: text, urls: [], error: `OpenAI image error ${response.status}` };
      }

      const data = await response.json();
      return {
        raw: typeof data.raw === "string" ? data.raw : JSON.stringify(data.raw),
        urls: data.urls ?? [],
        error: data.error,
      };
    } catch (err: any) {
      const message = err?.message || "OpenAI image generation failed";
      return { raw: "", urls: [], error: message };
    }
  }

  // Fallback to OpenRouter for other models (existing behaviour)
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY || import.meta.env.VITE_OPENROUTER_KEY;

  if (!apiKey) {
    return { raw: "", urls: [], error: "OpenRouter API key missing" };
  }

  const { n = 1, size = "1024x1024" } = options;

  try {
    const body = {
      model,
      prompt,
      n,
      size,
    } as const;

    const response = await fetch("https://openrouter.ai/api/v1/images/generations", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": import.meta.env.VITE_SITE_URL || window.location.origin,
        "X-Title": "JonStack",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const raw = await response.text();
      return { raw, urls: [], error: `OpenRouter image error ${response.status}` };
    }

    const dataImg = await response.json();

    const urls: string[] = Array.isArray(dataImg?.data)
      ? dataImg.data
          .map((d: any) => {
            if (typeof d?.url === "string") return d.url;
            if (typeof d?.b64_json === "string") return `data:image/png;base64,${d.b64_json}`;
            return undefined;
          })
          .filter((u: any): u is string => typeof u === "string")
      : [];

    return { raw: JSON.stringify(dataImg), urls };
  } catch (err: any) {
    const message = err?.message || "Image generation failed";
    console.error("[generateImages]", message, err);
    return { raw: "", urls: [], error: message };
  }
}

// ──────────────────────────────────────────────────────────
// Dev helper: expose processIdea for direct browser-console use
// ──────────────────────────────────────────────────────────
if (typeof window !== "undefined" && import.meta.env.DEV) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore – augmenting global window for debugging purposes
  if (!window.processIdea) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore – assign helper
    window.processIdea = processIdea;
    console.info(
      "%cprocessIdea() available in console. Example:\n  processIdea('Generate a SaaS idea…').then(r => console.log(r));",
      "color: purple; font-weight: bold;"
    );
  }
}