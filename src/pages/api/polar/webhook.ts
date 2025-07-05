import { polarWebhookRoute } from "@server/polarWebhook";

export const action = polarWebhookRoute.action;
export const loader = polarWebhookRoute.loader ?? (() => new Response("Not Found", { status: 404 })); 