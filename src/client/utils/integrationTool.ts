import type { AvailableIntegration } from "@shared/availableIntegrations";
import { buildPlatformIntegrationPrompt } from "./platformIntegrationPrompt";
import { analyticsDebug } from "@shared/debug";
import { availableIntegrations } from "@shared/availableIntegrations";

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

  if (analyticsDebug) {
    console.debug("[processIdea] idea", idea);
  }

  if (!apiKey) {
    console.warn("OpenRouter API key missing – skipping AI integration selection");
    return { integrations: [], error: "OpenRouter API key missing" };
  }

  const bodyObj = {
    model,
    temperature: 0.1,
    messages: [
      {
        role: "system",
        content: buildPlatformIntegrationPrompt(idea),
      },
    ],
    tools: [
      {
        type: "function",
        function: {
          name: "processUserIdea",
          description: "Process a user idea into a specification and required integrations",
          parameters: {
            type: "object",
            properties: {
              idea: { type: "string", description: "The user idea to be processed" },
            },
            required: ["idea"],
          },
        },
      },
    ],
  };

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

  if (analyticsDebug) {
    console.debug("[processIdea] response status", response.status);
  }

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
    if (analyticsDebug) {
      console.error(errMsg, errorDetails);
    }
    return { integrations: [], error: errMsg };
  }

  const data = await response.json();

  // The model may respond either via plain JSON in the `content` field OR via
  // the OpenAI function-calling format (tool_calls). Prefer tool_calls when present
  // because it guarantees valid JSON.
  const toolArgs: unknown =
    data?.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments || null;

  // Keep a copy of the raw string we attempt to parse for easier debugging
  const rawContent = typeof toolArgs === "string" && toolArgs
    ? toolArgs
    : (data?.choices?.[0]?.message?.content ?? "");

  if (analyticsDebug) {
    console.debug("[processIdea] raw content", rawContent);
  }

  try {
    // Choose the safest JSON source available
    let jsonText =
      typeof toolArgs === "string" && toolArgs.trim().length > 0
        ? toolArgs.trim()
        : (typeof toolArgs === "object" && toolArgs !== null)
          ? JSON.stringify(toolArgs)
          : (rawContent as string).trim();

    // Strip markdown fences when using content fallback
    if (jsonText.startsWith("```")) {
      jsonText = jsonText.replace(/^```[a-zA-Z]*\s*/i, "").replace(/```\s*$/, "").trim();
    }

    if (jsonText === "") {
      throw new Error("Received empty JSON string from model");
    }

    const parsed = JSON.parse(jsonText);
    let integrationsArray: AvailableIntegration[] = [];
    let platform: string | undefined = undefined;

    if (Array.isArray(parsed)) {
      // Model returned a raw array (likely of keys)
      integrationsArray = mapKeysToIntegrations(parsed);
    } else if (parsed && Array.isArray(parsed.integrations)) {
      integrationsArray = mapKeysToIntegrations(parsed.integrations);
      platform = parsed.platform;
    }

    if (analyticsDebug) console.log("Parsed integrations:", integrationsArray);

    return {
      platform,
      integrations: integrationsArray,
      requestBody: JSON.stringify(bodyObj, null, 2),
      rawContent: rawContent,
    };
  } catch (err) {
    // Fallback: try to extract first JSON object within the content
    try {
      if (typeof rawContent === "string") {
        const firstBrace = rawContent.indexOf("{");
        const lastBrace = rawContent.lastIndexOf("}");
        if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
          const snippet = rawContent.slice(firstBrace, lastBrace + 1);
          const fallbackParsed = JSON.parse(snippet);
          const fallbackInts: AvailableIntegration[] = Array.isArray(fallbackParsed.integrations)
            ? mapKeysToIntegrations(fallbackParsed.integrations)
            : [];
          return {
            platform: fallbackParsed.platform,
            integrations: fallbackInts,
            requestBody: JSON.stringify(bodyObj, null, 2),
            rawContent: rawContent,
            error: "Parsed via fallback (response contained extra text)",
          };
        }
      }
    } catch {
      // ignore
    }

    if (analyticsDebug) {
      console.error("Failed to parse integration list", rawContent, err);
    }
    return {
      integrations: [],
      error: (err as Error)?.message || "Parse error",
      requestBody: JSON.stringify(bodyObj, null, 2),
      rawContent: rawContent,
    };
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Helper to trim the specification response down to primitives
// ─────────────────────────────────────────────────────────────────────────────

export interface TrimmedPlatformIntegration {
  platform?: string;
  integrations: string[]; // integration keys only
}

export function trimPlatformIntegrationResponse(
  result: SpecificationResponse
): TrimmedPlatformIntegration {
  const keys = (result.integrations ?? []).map((i) => i.key);
  const deduped = Array.from(new Set(keys)).sort();
  return {
    platform: result.platform ?? "",
    integrations: deduped,
  };
}

function mapKeysToIntegrations(keys: string[]): AvailableIntegration[] {
  return keys
    .map((key) => availableIntegrations.find((i) => i.key === key))
    .filter((i): i is AvailableIntegration => Boolean(i));
} 