export const botidRouteHandler = {
  async loader({ request }: { request: Request }) {
    // TODO: Replace mock implementation with real `checkBotId()` once Vercel BotID is integrated.
    const mockIsBot = false;
    return new Response(
      JSON.stringify({ isBot: mockIsBot }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  },
}; 