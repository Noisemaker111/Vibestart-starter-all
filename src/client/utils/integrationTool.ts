import type { Integration, SpecificationResponse } from "./types.ts";
import { buildIntegrationPrompt } from "./integrationPrompt";

export const processIdea = async (idea: string): Promise<SpecificationResponse> => {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY || import.meta.env.VITE_OPENROUTER_KEY;

  if (!apiKey) {
    console.warn("OpenRouter API key missing – skipping AI integration selection");
    return { specification: "", integrations: [] };
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
      model: "google/gemini-2.0-flash-001", // default model – change via .env if desired
      messages: [
        {
          role: "system",
          content: buildIntegrationPrompt(idea),
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

  if (!response.ok) {
    let errorDetails: unknown = null;
    try {
      errorDetails = await response.clone().json();
    } catch {
      // ignore
    }
    console.error(`OpenRouter error ${response.status}:`, errorDetails);
    return { specification: "", integrations: [] };
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;

  try {
    let jsonText = content?.trim() ?? "";
    if (jsonText.startsWith("```")) {
      jsonText = jsonText.replace(/^```[a-zA-Z]*\s*/i, "").replace(/```\s*$/, "").trim();
    }
    const parsed = JSON.parse(jsonText);
    let integrationsArray: Integration[] = [];
    let ideaSpec = "";
    let platform: string | undefined = undefined;

    if (Array.isArray(parsed)) {
      integrationsArray = parsed as Integration[];
    } else if (parsed && Array.isArray(parsed.integrations)) {
      integrationsArray = parsed.integrations as Integration[];
      ideaSpec = parsed.idea ?? "";
      platform = parsed.platform;
    }

    console.log("Parsed integrations:", integrationsArray);
    return { specification: ideaSpec, platform, integrations: integrationsArray };
  } catch (err) {
    console.error("Failed to parse integration list", content, err);
    return { specification: "", integrations: [] };
  }
}; 