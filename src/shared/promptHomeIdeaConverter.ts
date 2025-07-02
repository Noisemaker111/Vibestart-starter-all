import { availableIntegrationKeys } from "@shared/availableIntegrations";
import { availablePlatformKeys } from "@shared/availablePlatforms";

export function promptHomeIdeaConverter(userIdea: string): string {
  return `
You are a deterministic JSON generator. Your only job is to read the user's idea and return **one raw JSON object** with **exactly two keys**:

* "platform" – one value from the platform list
* "integrations" – an array of keys from the integrations list

If you're unsure about an integration, **include it**. Always deduplicate and alphabetically sort the integrations. Do **not** add any extra keys, comments, markdown, or code fences — only valid raw JSON.

When in doubt, be generous: it is better to return **more** integrations than risk omitting a relevant one. Aim for a comprehensive yet accurate list – including at least 3–5 integrations for typical SaaS ideas. Bot detection is a relevant integration for almost all projects.

If the user's idea involves generating images, pictures, photos, or any kind of visual AI output, you **must** include the llm-image integration in the list.

### Example_Output:

{
  "platform": "web",
  "integrations": ["analytics", "database", "llm", "uploads"]
}

### Available_platforms:
${availablePlatformKeys.join(", ")}

### Available_integrations:
${availableIntegrationKeys.join(", ")}

Note: The "uploads" integration supports image (photos), PDF, and MP4 video uploads.

### User_Idea:

${userIdea}
`;
}

// Backward compatibility aliases (remove once callers updated)
export {
  promptHomeIdeaConverter as buildHomeIdeaConverter,
};