import { polarWebhookRoute } from "@server/polarWebhook";
import { withLogging } from "@server/utils/logger";

export const action = withLogging(polarWebhookRoute.action, "polarWebhook.action");
export const loader = withLogging(
  polarWebhookRoute.loader ?? (() => new Response("Not Found", { status: 404 })),
  "polarWebhook.loader"
); 