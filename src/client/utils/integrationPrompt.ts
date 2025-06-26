// Single source-of-truth list of integrations
const integrationsList = [
  { key: "database", label: "Database" },
  { key: "solana", label: "Solana Sign In" },
  { key: "google", label: "Google Sign In" },
  { key: "github", label: "GitHub Sign In" },
  { key: "llm", label: "LLM Chatbox" },
  { key: "uploads", label: "Uploads" },
  { key: "billing", label: "Billing" },
  { key: "realtime", label: "Realtime Messaging" },
  { key: "notifications", label: "Notifications" },
  { key: "analytics", label: "Analytics" },
  { key: "search", label: "Search" },
  { key: "maps", label: "Maps" },
] as const;

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
  You are an assistant that takes a user's high-level idea and outputs only a JSON array of objects, each with exactly the fields "key" and "label," selecting the relevant integrations from the list below. Do not output anything except the raw JSON array.
${availableIntegrations}

When interpreting the user's idea, think broadly about synonyms and related terms.  For example, "Stripe", "checkout", or "subscription" all imply the "billing" integration, while "chat" or "WebSocket" imply "realtime messaging."  Map such synonyms to the integration keys in the list above.
<user-idea> ${userIdea} <user-idea>
${mustIncludeDirective}General rules:
• Unless it is crystal-clear that no user authentication is needed (e.g. entirely offline tool), assume ONE suitable authentication integration (solana, google or github).
• When in doubt, err on the side of including an integration that might be useful (e.g. payments, maps, analytics). The list should slightly over-specify rather than under-specify.
Step 1 – Prompt Refinement
If the idea is too generic or spans many domains, inject / assume clarifying details using this mini-template to cover only the elements the user needs:
• Platform & audience (web, mobile, desktop, game)
• Core data & storage needs (relational data, file attachments, analytics)
• Authentication (email/password, social OAuth, blockchain wallets)
• File handling (uploads, downloads)
• Real-time features (messaging, live updates)
• Notifications (in-app, push, email)
• Search requirements
• Analytics & reporting
• Billing & subscriptions
• AI/LLM features (chatbot, content generation)
• Blockchain/crypto features (on-chain payments, NFT integration)
• Any third-party services to integrate
Produce one cohesive specification paragraph that incorporates only the chosen elements.
Step 2 – JSON Generation
From that refined spec, select only the relevant entries from the options list above and output a JSON array of objects with exactly the fields "key" and "label." Do not include any extra keys, comments or items not in the options list.`;
} 