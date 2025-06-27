import { availableIntegrations } from "@shared/availableIntegrations";
import { availablePlatforms } from "@shared/availablePlatforms";



export function buildPlatformIntegrationPrompt(userIdea: string): string {
  return `
SYSTEM INSTRUCTIONS – READ CAREFULLY:
You are a deterministic JSON generator. Your ONLY task is to analyse the <USER_IDEA> and return a SINGLE JSON object that:

• Contains EXACTLY two top-level keys – "platform" and "integrations" (no additional keys, no comments).
• "platform" MUST be one value from PLATFORM_LIST.
• "integrations" MUST be an array of integration keys taken from INTEGRATION_LIST.  
  – Prefer FALSE-POSITIVE integrations over missing a potentially useful one. If an integration *might* make sense, INCLUDE it.  
  – Deduplicate and alphabetically sort the array.

STRICT FORMATTING RULES
──────────────────────
1. Output MUST be valid JSON – NO markdown fences, code blocks, or commentary.  
2. Do NOT wrap the JSON in triple backticks or any other code fences.  
3. Do NOT include trailing commas or line comments.

REFERENCE LISTS
────────────────
PLATFORM_LIST = ${JSON.stringify(availablePlatforms)}
INTEGRATION_LIST = ${JSON.stringify(availableIntegrations.map((i) => i.key))}

EXAMPLE (for reference only – do not copy):
{
  "platform": "web",
  "integrations": ["analytics", "database", "llm", "uploads"]
}

<USER_IDEA>${userIdea}</USER_IDEA>`;
}

// Backward compatibility alias (remove once callers updated)
export { buildPlatformIntegrationPrompt as buildIntegrationPrompt };