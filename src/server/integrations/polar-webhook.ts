import { validateEvent, WebhookVerificationError } from "@polar-sh/sdk/webhooks";

export const polarWebhookRoute = {
  async action({ request }: { request: Request }) {
    const bodyBuffer = await request.arrayBuffer();
    const secret = import.meta.env.VITE_POLAR_WEBHOOK_SECRET;
    if (!secret) return new Response("Webhook secret missing", { status: 500 });
    let event: any;
    try {
      event = validateEvent(Buffer.from(bodyBuffer), Object.fromEntries(request.headers), secret);
    } catch (err: any) {
      if (err instanceof WebhookVerificationError) return new Response("Invalid signature", { status: 403 });
      console.error("[polarWebhookRoute] validation error", err);
      return new Response("Webhook error", { status: 400 });
    }
    try {
      switch (event.type) {
        case "order.paid": break;
        case "order.refunded": break;
        case "customer.state_changed": break;
        default: break;
      }
      return new Response("ok", { status: 202 });
    } catch (err: any) {
      console.error("[polarWebhookRoute] handler error", err);
      return new Response("Server error", { status: 500 });
    }
  },
}; 