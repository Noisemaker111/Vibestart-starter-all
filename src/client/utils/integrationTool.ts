import type { Integration, SpecificationResponse } from "./types.ts";

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
          content: `You are an assistant that takes a user's high-level idea and outputs only a JSON array of objects, each with exactly the fields "key" and "label," selecting the relevant integrations from the list below. Do not output anything except the raw JSON array.\nAvailable integrations:\n{ key: "database",      label: "Database" }\n{ key: "solana",        label: "Solana Sign In" }\n{ key: "google",        label: "Google Sign In" }\n{ key: "github",        label: "GitHub Sign In" }\n{ key: "llm",           label: "LLM Chatbox" }\n{ key: "uploads",       label: "Uploads" }\n{ key: "billing",       label: "Billing" }\n{ key: "realtime",      label: "Realtime Messaging" }\n{ key: "notifications", label: "Notifications" }\n{ key: "analytics",     label: "Analytics" }\n{ key: "search",        label: "Search" }\n<user-idea> ${idea} <user-idea>\nStep 1 – Prompt Refinement\nIf the idea is too generic or spans many domains, inject / assume clarifying details using this mini-template to cover only the elements the user needs:\n• Platform & audience (web, mobile, desktop, game)\n• Core data & storage needs (relational data, file attachments, analytics)\n• Authentication (email/password, social OAuth, blockchain wallets)\n• File handling (uploads, downloads)\n• Real-time features (messaging, live updates)\n• Notifications (in-app, push, email)\n• Search requirements\n• Analytics & reporting\n• Billing & subscriptions\n• AI/LLM features (chatbot, content generation)\n• Blockchain/crypto features (on-chain payments, NFT integration)\n• Any third-party services to integrate\nProduce one cohesive specification paragraph that incorporates only the chosen elements.\nStep 2 – JSON Generation\nFrom that refined spec, select only the relevant entries from the options list above and output a JSON array of objects with exactly the fields "key" and "label." Do not include any extra keys, comments or items not in the options list.`,
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
    const integrationsArray = JSON.parse(jsonText) as Integration[];
    console.log("Parsed integrations:", integrationsArray);
    return { specification: "", integrations: integrationsArray };
  } catch (err) {
    console.error("Failed to parse integration list", content, err);
    return { specification: "", integrations: [] };
  }
}; 