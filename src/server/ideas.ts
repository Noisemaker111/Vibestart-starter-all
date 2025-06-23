import { z } from "zod";
import { createIdea, listIdeas } from "@server/db/queries/ideas";
import { getUserVote } from "@server/db/queries/votes";
import { 
  checkAnonIdeaLimit, 
  checkAuthIdeaLimit, 
  getClientIdentifier,
  createRateLimitError,
  type RateLimitError,
  RATE_LIMITS,
} from "@server/utils/rateLimit";
import { verify as verifyAnonToken, generateSignedToken } from "@server/utils/anonToken";
import { checkRateLimit } from "@server/utils/rateLimit";
import { DEFAULT_AVATAR_URL } from "@shared/constants";

// Idea submission schema - moved from shared/schema.ts since it's only used here
export const IdeaSchema = z.object({
  text: z
    .string()
    .min(1, "Idea is required")
    .max(1000, "Idea is too long (max 1000 characters)"),
  user_id: z.string().uuid().optional(),
  author_name: z.string().optional(),
  author_avatar_url: z.string().url().optional().nullable(),
});

export type IdeaFormData = z.infer<typeof IdeaSchema>;

export async function action({ request }: { request: Request }) {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const data = await request.json();
    const parsed = IdeaSchema.parse(data);

    // ────────────────────────────────────────────────────────────────────────────
    // UNIFIED RATE LIMITING - Server-side enforcement
    // ────────────────────────────────────────────────────────────────────────────
    
    let rateLimitResult;
    let extraHeaders: Record<string, string> = {};
    
    if (parsed.user_id) {
      // Authenticated user
      rateLimitResult = await checkAuthIdeaLimit(parsed.user_id);
    } else {
      // Anonymous: use signed cookie, issue if missing
      const headersToSet: Record<string, string> = {};
      const rawCookie = request.headers.get("cookie") ?? "";
      const cookieMap = Object.fromEntries(
        rawCookie.split(";").map((c) => {
          const [k, v] = c.trim().split("=");
          return [k, v];
        })
      );

      const clientIp = getClientIdentifier(request);
      let anonId = verifyAnonToken(cookieMap["anon_id"]);

      if (!anonId) {
        // limit token issuance per IP
        const tokenIssueLimit = await checkRateLimit(clientIp, RATE_LIMITS.ANON_TOKEN_ISSUE);
        if (!tokenIssueLimit.allowed) {
          const error = createRateLimitError(tokenIssueLimit);
          return new Response(
            JSON.stringify({ error: error.message, code: error.code, success: false }),
            { status: 429, headers: { "Content-Type": "application/json" } }
          );
        }

        const { id, cookie } = generateSignedToken();
        anonId = id;
        headersToSet["Set-Cookie"] = `anon_id=${cookie}; Path=/; Max-Age=2592000; HttpOnly; SameSite=Lax`;
      }

      rateLimitResult = await checkAnonIdeaLimit(anonId);

      if (!rateLimitResult.allowed) {
        const error = createRateLimitError(rateLimitResult);
        return new Response(
          JSON.stringify({ error: error.message, code: error.code, success: false }),
          { status: 429, headers: { "Content-Type": "application/json", ...headersToSet } }
        );
      }

      extraHeaders = headersToSet;
    }

    // ────────────────────────────────────────────────────────────────────────────
    // Create the idea if rate limit allows
    // ────────────────────────────────────────────────────────────────────────────

    const created = await createIdea({
      text: parsed.text,
      user_id: parsed.user_id ?? null,
      author_name: parsed.author_name ?? null,
      author_avatar_url: parsed.author_avatar_url ?? (parsed.user_id ? null : DEFAULT_AVATAR_URL),
    });

    const ideaResponse = {
      ...created,
      author: {
        name: created.author_name ?? "Anon",
        avatar_url: created.author_avatar_url ?? DEFAULT_AVATAR_URL,
      },
    };

    return new Response(
      JSON.stringify({ 
        success: true, 
        idea: ideaResponse,
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
          "X-RateLimit-Reset": rateLimitResult.resetTime.toString(),
          ...extraHeaders,
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

    // Handle other errors (validation, database, etc.)
    return new Response(
      JSON.stringify({ error: (error as Error).message, success: false }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function loader({ request }: { request: Request }): Promise<Response> {
  const url = new URL(request.url);
  const userId = url.searchParams.get("user_id");
  try {
    const ideasRaw = await listIdeas();
    const ideas = await Promise.all(
      ideasRaw.map(async (i) => {
        const userVote = userId ? await getUserVote(i.id, userId) : 0;
        return {
          ...i,
          author: {
            name: i.author_name ?? "Anon",
            avatar_url: i.author_avatar_url ?? null,
          },
          userVote,
        };
      })
    );

    return new Response(JSON.stringify({ success: true, ideas }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: (error as Error).message, success: false }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
} 