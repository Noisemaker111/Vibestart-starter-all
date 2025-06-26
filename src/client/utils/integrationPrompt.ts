const availableIntegrations = `Available integrations:
{ key: "database",      label: "Database" }
{ key: "solana",        label: "Solana Sign In" }
{ key: "google",        label: "Google Sign In" }
{ key: "github",        label: "GitHub Sign In" }
{ key: "llm",           label: "LLM Chatbox" }
{ key: "uploads",       label: "Uploads" }
{ key: "billing",       label: "Billing" }
{ key: "realtime",      label: "Realtime Messaging" }
{ key: "notifications", label: "Notifications" }
{ key: "analytics",     label: "Analytics" }
{ key: "search",        label: "Search" }
{ key: "maps",          label: "Maps" }`;

/**
 * Builds the system prompt for OpenRouter.
 * The AI should return ONLY a JSON array of {key,label}.
 * We additionally tell it to almost always assume one authentication method.
 */
export function buildIntegrationPrompt(userIdea: string): string {
  return `You are an assistant that takes a user's high-level idea and outputs only a JSON array of objects, each with exactly the fields "key" and "label," selecting the relevant integrations from the list below. Do not output anything except the raw JSON array.
${availableIntegrations}
<user-idea> ${userIdea} <user-idea>
General rules:
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