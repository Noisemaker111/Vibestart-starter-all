import { INTEGRATIONS as integrationsList } from "@shared/integrations";
import { PLATFORMS } from "@shared/platforms";

// Build the human-readable prompt section from the list above
const availableIntegrations =
  "Available integrations:\n" +
  integrationsList
    .map(
      (i) => {
        const padding = Math.max(0, 12 - i.key.length);
        return `{ key: "${i.key}",${" ".repeat(padding)}label: "${i.label}" }`;
      }
    )
    .join(" \n");

// Build platform list string
const availablePlatforms = "Available platforms: " + PLATFORMS.join(", ");

/**
 * Detect integrations explicitly referenced in the user's idea.
 * Matches against both key and label (case-insensitive, substring match).
 */
function detectMentionedIntegrations(idea: string) {
  const lower = idea.toLowerCase();
  const matches: { key: string; label: string }[] = [];

  // Direct matches against key or label
  for (const i of integrationsList) {
    if (lower.includes(i.key) || lower.includes(i.label.toLowerCase())) {
      matches.push(i);
    }
  }

  // Heuristic synonym detection has been removed. Synonym handling is now
  // delegated to the language model via the prompt (see synonymsSection).
  return matches;
}

/**
 * Builds the system prompt for OpenRouter.
 * The AI should return ONLY a JSON array of {key,label}.
 * We additionally tell it to almost always assume one authentication method.
 */
export function buildIntegrationPrompt(userIdea: string): string {
  const mentioned = detectMentionedIntegrations(userIdea);
  const mustIncludeDirective =
    mentioned.length > 0
      ? `The user explicitly mentioned or implied the following integrations which MUST be included in your output: ${mentioned
          .map((m) => `${m.key}`)
          .join(", ")}.\n`
      : "";

  return `
  You are an assistant that takes a user's high-level idea and returns exactly a single JSON object with two fields:
  {
    "platform": string,           // one value from the platform list below
    "integrations": Integration[] // array of { key, label } objects chosen from the list below
  }

${availablePlatforms}

${availableIntegrations}

When interpreting the user's idea, think broadly about synonyms and related terms. For example, "Stripe", "checkout", or "subscription" all imply the "billing" integration, while "chat" or "WebSocket" imply "realtime". Map such synonyms to the integration keys above.

<user-idea> ${userIdea} <user-idea>

${mustIncludeDirective}General rules:
• Unless it is crystal-clear that no user authentication is needed (e.g. entirely offline tool), assume ONE suitable authentication integration (solana, google or github).
• When in doubt, err on the side of including an integration that might be useful (e.g. payments, maps, analytics). The list should slightly over-specify rather than under-specify.

Step 1 – Prompt Refinement
If the idea is too generic or spans many domains, inject / assume clarifying details:
• Platform & audience (${PLATFORMS.join(", ")})

Step 2 – JSON Generation
From that refined spec, select only the relevant entries from the options list above and output a JSON array of objects with exactly the fields "key" and "label." Do not include any extra keys, comments or items not in the options list.`;
} 