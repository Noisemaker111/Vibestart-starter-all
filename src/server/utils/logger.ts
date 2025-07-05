export type RouteHandler = (args: { request: Request }) => Promise<Response> | Response;

/**
 * Wrap a Remix/React-Router style loader/action so every request & response is logged
 * with timing, request body (JSON up to 2 kB), and error stack traces.
 */
export function withLogging(handler: RouteHandler, name = "handler"): RouteHandler {
  return async function ({ request }) {
    const start = Date.now();

    // ─── Gather brief request info ────────────────────────────────────────────
    const { method, url } = request;
    const parsedUrl = new URL(url);
    const contentType = request.headers.get("content-type") || "";
    let bodySummary = "";
    try {
      if (contentType.includes("application/json")) {
        const text = await request.clone().text();
        bodySummary = text.length > 2048 ? text.slice(0, 2048) + "…" : text;
      } else if (contentType.includes("multipart/form-data")) {
        const len = request.headers.get("content-length") || "unknown";
        bodySummary = `multipart/form-data (${len} bytes)`;
      } else if (contentType) {
        bodySummary = contentType;
      }
    } catch {
      bodySummary = "<failed to read body for log>";
    }

    console.log(`[${name}] › ${method} ${parsedUrl.pathname}${parsedUrl.search} ${bodySummary}`);

    // ─── Invoke the original handler ─────────────────────────────────────────
    try {
      const response = await handler({ request });
      const duration = Date.now() - start;
      console.log(`[${name}] ‹ ${response.status} (${duration}ms)`);

      // Log response body when status >= 400 for easier debugging (up to 2 kB)
      if (response.status >= 400) {
        try {
          const text = await response.clone().text();
          const trimmed = text.length > 2048 ? text.slice(0, 2048) + "…" : text;
          console.error(`[${name}] Response body:`, trimmed);
        } catch {/* ignore */}
      }

      return response;
    } catch (err) {
      const duration = Date.now() - start;
      console.error(`[${name}] ✖ Error after ${duration}ms`, err);
      throw err;
    }
  };
} 