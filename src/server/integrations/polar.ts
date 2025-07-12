import { checkBotId } from "botid/server";
import { canCallIntegrations } from "../utils/security";

export const polarRouteHandler = {
  async loader({ request }: { request: Request }) {
    if (!canCallIntegrations(request)) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });
    const botCheck = import.meta.env.DEV ? { isBot: false } : await checkBotId();
    if (botCheck.isBot) return new Response(JSON.stringify({ error: "Access denied" }), { status: 403, headers: { "Content-Type": "application/json" } });
    const url = new URL(request.url);
    const mode = url.searchParams.get("mode") || "ping";
    const token = import.meta.env.VITE_POLAR_ACCESS_TOKEN;
    if (!token) return new Response(JSON.stringify({ error: "POLAR_ACCESS_TOKEN env var missing" }), { status: 500, headers: { "Content-Type": "application/json" } });
    const baseUrl = token.startsWith("sandbox_") || url.searchParams.get("env") === "sandbox" ? "https://sandbox-api.polar.sh" : "https://api.polar.sh";
    try {
      if (mode === "products") {
        const res = await fetch(`${baseUrl}/v1/products`, { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) {
          const detail = await res.text();
          return new Response(JSON.stringify({ error: `Polar API error ${res.status}`, detail }), { status: 500, headers: { "Content-Type": "application/json" } });
        }
        const data = await res.json();
        return new Response(JSON.stringify({ ok: true, products: data }), { headers: { "Content-Type": "application/json" } });
      }
      return new Response(JSON.stringify({ ok: true }), { headers: { "Content-Type": "application/json" } });
    } catch (err: any) {
      return new Response(JSON.stringify({ error: err?.message || "Polar connectivity failed" }), { status: 500, headers: { "Content-Type": "application/json" } });
    }
  },
  async action() {
    return new Response("Method Not Allowed", { status: 405 });
  },
}; 