import { availableIntegrationKeys } from "@shared/availableIntegrations";
import { availablePlatformKeys } from "@shared/availablePlatforms";

export function buildPlatformIntegrationPrompt(userIdea: string): string {


  return `
You are a deterministic JSON generator. Your only job is to read the user's idea and return **one raw JSON object** with **exactly two keys**:

* "platform" – one value from the platform list
* "integrations" – an array of keys from the integrations list

If you're unsure about an integration, **include it**. Always deduplicate and alphabetically sort the integrations. Do **not** add any extra keys, comments, markdown, or code fences — only valid raw JSON.

### Example_Output:

{
  "platform": "web",
  "integrations": ["analytics", "database", "llm", "uploads"]
}

### Available_platforms:
${availablePlatformKeys.join(", ")}

### Available_integrations:
${availableIntegrationKeys.join(", ")}



### User_Idea:

${userIdea}
`;
}

// Backward compatibility alias (remove once callers updated)
export { buildPlatformIntegrationPrompt as buildIntegrationPrompt };