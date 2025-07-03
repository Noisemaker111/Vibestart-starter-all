import { checkBotId } from "botid/server";

export const botidRouteHandler = {
  async loader(): Promise<Response> {
    // Perform server-side BotID verification
    const verification = await checkBotId();

    const headers = { "Content-Type": "application/json" } as const;

    if (verification.isBot) {
      // Block bot access with 403
      return new Response(
        JSON.stringify({ error: "Access denied", isBot: true }),
        { status: 403, headers }
      );
    }

    return new Response(JSON.stringify({ isBot: false }), { headers });
  },
}; 