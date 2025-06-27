import type { AvailableIntegration } from "@shared/availableIntegrations";
import { buildPlatformIntegrationPrompt } from "./platformIntegrationPrompt";
import { analyticsDebug } from "@shared/debug";

export interface SpecificationResponse {
  platform?: string;
  integrations: AvailableIntegration[];
  error?: string;
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

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": import.meta.env.VITE_SITE_URL || window.location.origin,
      "X-Title": "JonStack", // site name for OpenRouter attribution
    },
    body: JSON.stringify({
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
    }),
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
    console.error(`OpenRouter error ${response.status}:`, errorDetails);
    return { integrations: [], error: `OpenRouter error ${response.status}` };
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;

  if (analyticsDebug) {
    console.debug("[processIdea] raw content", content);
  }

  try {
    let jsonText = content?.trim() ?? "";
    if (jsonText.startsWith("```")) {
      jsonText = jsonText.replace(/^```[a-zA-Z]*\s*/i, "").replace(/```\s*$/, "").trim();
    }
    const parsed = JSON.parse(jsonText);
    let integrationsArray: AvailableIntegration[] = [];
    let platform: string | undefined = undefined;

    if (Array.isArray(parsed)) {
      integrationsArray = parsed as AvailableIntegration[];
    } else if (parsed && Array.isArray(parsed.integrations)) {
      integrationsArray = parsed.integrations as AvailableIntegration[];
      platform = parsed.platform;
    }

    if (analyticsDebug) console.log("Parsed integrations:", integrationsArray);

    return { platform, integrations: integrationsArray };
  } catch (err) {
    console.error("Failed to parse integration list", content, err);
    return { integrations: [], error: (err as Error)?.message || "Parse error" };
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