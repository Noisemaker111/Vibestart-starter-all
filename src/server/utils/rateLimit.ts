import { db, rateLimitsTable } from "../integrations/database";
import { eq, lt } from "drizzle-orm";

// ────────────────────────────────────────────────────────────────────────────────
// Unified Rate Limiting Configuration
// ────────────────────────────────────────────────────────────────────────────────

export interface RateLimitConfig {
  windowMs: number;  // Time window in milliseconds
  maxRequests: number;  // Max requests in window
  keyPrefix: string;  // Prefix for storage key
}

export const RATE_LIMITS = {
  // Anonymous users: 1 idea per day
  ANON_IDEAS: {
    windowMs: 24 * 60 * 60 * 1000, // 24 hours
    maxRequests: 1,
    keyPrefix: "anon_idea",
  },
  // Authenticated users: 5 ideas per hour (token bucket style)
  AUTH_IDEAS: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 5,
    keyPrefix: "auth_idea",
  },
  // Authenticated users: 100 votes per minute (token bucket style)  
  AUTH_VOTES: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 100,
    keyPrefix: "auth_vote",
  },
  // Anonymous token issuance: limit new anon tokens per IP
  ANON_TOKEN_ISSUE: {
    windowMs: 24 * 60 * 60 * 1000, // 24 hours
    maxRequests: 3,
    keyPrefix: "anon_token_issue",
  },
} as const;

// ────────────────────────────────────────────────────────────────────────────────
// Rate Limit Storage (using Drizzle ORM)
// ────────────────────────────────────────────────────────────────────────────────

interface RateLimitRecord {
  key: string;
  requests: number;
  resetTime: number;
}

// Clean up old records periodically
export async function cleanupExpiredRecords() {
  const now = Date.now();
  await db.delete(rateLimitsTable).where(lt(rateLimitsTable.reset_time, now));
}

async function getRateLimitRecord(key: string): Promise<RateLimitRecord | null> {
  const result = await db
    .select()
    .from(rateLimitsTable)
    .where(eq(rateLimitsTable.key, key))
    .limit(1);
  
  const row = result[0];
  if (!row) return null;
  
  return {
    key: row.key,
    requests: row.requests,
    resetTime: row.reset_time,
  };
}

async function setRateLimitRecord(record: RateLimitRecord) {
  await db
    .insert(rateLimitsTable)
    .values({
      key: record.key,
      requests: record.requests,
      reset_time: record.resetTime,
    })
    .onConflictDoUpdate({
      target: rateLimitsTable.key,
      set: {
        requests: record.requests,
        reset_time: record.resetTime,
        updated_at: new Date(),
      },
    });
}

// ────────────────────────────────────────────────────────────────────────────────
// Core Rate Limiting Logic
// ────────────────────────────────────────────────────────────────────────────────

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  total: number;
}

export interface RateLimitError extends Error {
  code: 'RATE_LIMIT_EXCEEDED';
  remaining: number;
  resetTime: number;
  retryAfter: number;
}

// Helper to format seconds as "#h #m #s"
function formatSeconds(totalSeconds: number): string {
  const seconds = totalSeconds % 60;
  const minutesTotal = Math.floor(totalSeconds / 60);
  const minutes = minutesTotal % 60;
  const hours = Math.floor(minutesTotal / 60);
  const parts: string[] = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0 || hours > 0) parts.push(`${minutes}m`);
  parts.push(`${seconds}s`);
  return parts.join(" ");
}

export function createRateLimitError(result: RateLimitResult): RateLimitError {
  const retryAfter = Math.ceil((result.resetTime - Date.now()) / 1000);
  const error = new Error(`Rate limit exceeded. Try again in ${formatSeconds(retryAfter)}.`) as RateLimitError;
  error.code = 'RATE_LIMIT_EXCEEDED';
  error.remaining = result.remaining;
  error.resetTime = result.resetTime;
  error.retryAfter = retryAfter;
  return error;
}

export async function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  // Clean up old records periodically (only every 100th request for performance)
  if (Math.random() < 0.01) {
    await cleanupExpiredRecords();
  }
  
  const key = `${config.keyPrefix}:${identifier}`;
  const now = Date.now();
  
  let record = await getRateLimitRecord(key);
  
  // Initialize or reset if window expired
  if (!record || now >= record.resetTime) {
    record = {
      key,
      requests: 0,
      resetTime: now + config.windowMs,
    };
  }
  
  const allowed = record.requests < config.maxRequests;
  
  if (allowed) {
    record.requests += 1;
    await setRateLimitRecord(record);
  }
  
  return {
    allowed,
    remaining: Math.max(0, config.maxRequests - record.requests),
    resetTime: record.resetTime,
    total: config.maxRequests,
  };
}

// ────────────────────────────────────────────────────────────────────────────────
// Public API
// ────────────────────────────────────────────────────────────────────────────────

export async function checkAnonIdeaLimit(identifier: string): Promise<RateLimitResult> {
  return checkRateLimit(identifier, RATE_LIMITS.ANON_IDEAS);
}

export async function checkAuthIdeaLimit(userId: string): Promise<RateLimitResult> {
  return checkRateLimit(userId, RATE_LIMITS.AUTH_IDEAS);
}

export async function checkAuthVoteLimit(userId: string): Promise<RateLimitResult> {
  return checkRateLimit(userId, RATE_LIMITS.AUTH_VOTES);
}

// ────────────────────────────────────────────────────────────────────────────────
// Express-style Middleware (for easy integration)
// ────────────────────────────────────────────────────────────────────────────────

export type RateLimitType = 'anon_ideas' | 'auth_ideas' | 'auth_votes';

export interface RateLimitMiddlewareOptions {
  type: RateLimitType;
  getIdentifier: (request: Request) => string | Promise<string>;
  onLimit?: (error: RateLimitError, request: Request) => Response;
}

export function createRateLimitMiddleware(options: RateLimitMiddlewareOptions) {
  return async function rateLimitMiddleware(request: Request): Promise<RateLimitResult> {
    const identifier = await options.getIdentifier(request);
    
    let result: RateLimitResult;
    switch (options.type) {
      case 'anon_ideas':
        result = await checkAnonIdeaLimit(identifier);
        break;
      case 'auth_ideas':
        result = await checkAuthIdeaLimit(identifier);
        break;
      case 'auth_votes':
        result = await checkAuthVoteLimit(identifier);
        break;
      default:
        throw new Error(`Unknown rate limit type: ${options.type}`);
    }
    
    if (!result.allowed) {
      const error = createRateLimitError(result);
      if (options.onLimit) {
        throw error;
      }
      throw error;
    }
    
    return result;
  };
}

// ────────────────────────────────────────────────────────────────────────────────
// Helper to get client IP for anonymous users
// ────────────────────────────────────────────────────────────────────────────────

export function getClientIdentifier(request: Request): string {
  // Try to get real IP from headers (for production with reverse proxies)
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const clientIp = forwarded?.split(',')[0]?.trim() || realIp || 'unknown';
  
  return clientIp;
}

// ────────────────────────────────────────────────────────────────────────────────
// Client-side compatible functions (for UI feedback)
// ────────────────────────────────────────────────────────────────────────────────

export interface ClientRateLimitInfo {
  remaining: number;
  resetTime: number;
  total: number;
  nextAllowedTime: number;
}

export async function getClientRateLimitInfo(
  type: RateLimitType,
  identifier: string
): Promise<ClientRateLimitInfo> {
  let result: RateLimitResult;
  
  switch (type) {
    case 'anon_ideas':
      result = await checkAnonIdeaLimit(identifier);
      break;
    case 'auth_ideas':
      result = await checkAuthIdeaLimit(identifier);
      break;
    case 'auth_votes':
      result = await checkAuthVoteLimit(identifier);
      break;
    default:
      throw new Error(`Unknown rate limit type: ${type}`);
  }
  
  // Calculate next allowed time
  const nextAllowedTime = result.remaining > 0 ? Date.now() : result.resetTime;
  
  return {
    remaining: result.remaining,
    resetTime: result.resetTime,
    total: result.total,
    nextAllowedTime,
  };
} 