import { upsertIdeaVote } from "@server/db/queries/votes";
import { 
  checkAuthVoteLimit, 
  createRateLimitError,
  type RateLimitError 
} from "@server/utils/rateLimit";

export async function action({ request, params }: { request: Request; params: any }) {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  const ideaId = Number(params.id);
  if (isNaN(ideaId)) {
    return new Response(JSON.stringify({ error: "Invalid idea id" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const body = await request.json();
  const { value, user_id } = body as { value: 1 | -1 | 0; user_id?: string };
  if (!user_id) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (![1, -1, 0].includes(value)) {
    return new Response(JSON.stringify({ error: "Invalid vote value" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    // ────────────────────────────────────────────────────────────────────────────
    // UNIFIED RATE LIMITING - Server-side enforcement
    // ────────────────────────────────────────────────────────────────────────────
    
    const rateLimitResult = await checkAuthVoteLimit(user_id);

    if (!rateLimitResult.allowed) {
      const error = createRateLimitError(rateLimitResult);
      return new Response(
        JSON.stringify({ 
          error: error.message,
          code: error.code,
          remaining: error.remaining,
          resetTime: error.resetTime,
          retryAfter: error.retryAfter,
          success: false 
        }),
        {
          status: 429, // Too Many Requests
          headers: { 
            "Content-Type": "application/json",
            "Retry-After": error.retryAfter.toString(),
            "X-RateLimit-Limit": rateLimitResult.total.toString(),
            "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
            "X-RateLimit-Reset": rateLimitResult.resetTime.toString()
          },
        }
      );
    }

    // ────────────────────────────────────────────────────────────────────────────
    // Process the vote if rate limit allows
    // ────────────────────────────────────────────────────────────────────────────

    const score = await upsertIdeaVote(ideaId, user_id, value as any);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        score, 
        userVote: value,
        rateLimit: {
          remaining: rateLimitResult.remaining - 1, // Subtract 1 since we consumed it
          resetTime: rateLimitResult.resetTime,
          total: rateLimitResult.total
        }
      }), 
      {
        headers: { 
          "Content-Type": "application/json",
          "X-RateLimit-Limit": rateLimitResult.total.toString(),
          "X-RateLimit-Remaining": (rateLimitResult.remaining - 1).toString(),
          "X-RateLimit-Reset": rateLimitResult.resetTime.toString()
        },
      }
    );
  } catch (error) {
    // Handle rate limit errors specifically
    if (error && typeof error === 'object' && 'code' in error && error.code === 'RATE_LIMIT_EXCEEDED') {
      const rateLimitError = error as RateLimitError;
      return new Response(
        JSON.stringify({ 
          error: rateLimitError.message,
          code: rateLimitError.code,
          remaining: rateLimitError.remaining,
          resetTime: rateLimitError.resetTime,
          retryAfter: rateLimitError.retryAfter,
          success: false 
        }),
        {
          status: 429,
          headers: { 
            "Content-Type": "application/json",
            "Retry-After": rateLimitError.retryAfter.toString()
          },
        }
      );
    }

    // Handle other errors (database, etc.)
    return new Response(
      JSON.stringify({ error: (error as Error).message, success: false }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
} 