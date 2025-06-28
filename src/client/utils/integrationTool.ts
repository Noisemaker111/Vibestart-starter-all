import type { AvailableIntegration } from "@shared/availableIntegrations";
import { buildPlatformIntegrationPrompt } from "./platformIntegrationPrompt";
import { availableIntegrations } from "@shared/availableIntegrations";
import { z } from "zod";

export interface SpecificationResponse {
  platform?: string;
  integrations: AvailableIntegration[];
  error?: string;
  /** JSON sent to OpenRouter (pretty-printed) */
  requestBody?: string;
  /** Raw content string returned by the model (before parsing) */
  rawContent?: string;
}

export const DEFAULT_MODEL = "google/gemini-2.0-flash-001" as const;

export const processIdea = async (
  idea: string,
  model: string = DEFAULT_MODEL
): Promise<SpecificationResponse> => {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY || import.meta.env.VITE_OPENROUTER_KEY;

  if (import.meta.env.DEV) console.debug("[processIdea] idea", idea);

  if (!apiKey) {
    console.warn("OpenRouter API key missing – skipping AI integration selection");
    return { integrations: [], error: "OpenRouter API key missing" };
  }

  const bodyObj = {
    model,
    temperature: 0.1,
    // Encourage the model to respond with structured JSON only
    response_format: { type: "json_object" as const },
    messages: [
      {
        role: "system",
        content: buildPlatformIntegrationPrompt(idea),
      },
      {
        role: "user",
        content: `Analyze this idea and return the required integrations: ${idea}`,
      },
    ],
  } as const;

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
};

function mapKeysToIntegrations(keys: string[]): AvailableIntegration[] {
  return keys
    .map((key) => availableIntegrations.find((i) => i.key === key))
    .filter((i): i is AvailableIntegration => Boolean(i));
} 