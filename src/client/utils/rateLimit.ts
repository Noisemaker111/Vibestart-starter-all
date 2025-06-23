/*
Unified Rate Limiting System - Client Side
Syncs with server-side rate limits and provides optimistic UI updates.

This replaces the old localStorage-only system with one that:
- Syncs with server rate limits
- Handles server 429 responses
- Provides real-time UI feedback
- Falls back gracefully when server is unavailable
*/

// ────────────────────────────────────────────────────────────────────────────────
// Types (matching server-side)
// ────────────────────────────────────────────────────────────────────────────────

export interface RateLimitInfo {
  remaining: number;
  resetTime: number;
  total: number;
  retryAfter?: number; // Only present when rate limited
}

export interface RateLimitError {
  code: 'RATE_LIMIT_EXCEEDED';
  message: string;
  remaining: number;
  resetTime: number;
  retryAfter: number;
}

export type RateLimitType = 'anon_ideas' | 'auth_ideas' | 'auth_votes';

// ────────────────────────────────────────────────────────────────────────────────
// Local Storage Helpers (for offline fallback)
// ────────────────────────────────────────────────────────────────────────────────

const hasStorage = typeof localStorage !== "undefined";

function lsGet(key: string): string | null {
  return hasStorage ? localStorage.getItem(key) : null;
}

function lsSet(key: string, value: string): void {
  if (hasStorage) {
    localStorage.setItem(key, value);
  }
}

// ────────────────────────────────────────────────────────────────────────────────
// Rate Limit State Management
// ────────────────────────────────────────────────────────────────────────────────

const rateLimitCache = new Map<string, RateLimitInfo & { lastUpdated: number }>();

function getCacheKey(type: RateLimitType, identifier: string): string {
  return `${type}:${identifier}`;
}

function getCachedRateLimit(type: RateLimitType, identifier: string): RateLimitInfo | null {
  const key = getCacheKey(type, identifier);
  const cached = rateLimitCache.get(key);
  
  if (!cached) return null;
  
  // Cache expires after 30 seconds or when reset time is reached
  const now = Date.now();
  if (now - cached.lastUpdated > 30_000 || now >= cached.resetTime) {
    rateLimitCache.delete(key);
    return null;
  }
  
  return {
    remaining: cached.remaining,
    resetTime: cached.resetTime,
    total: cached.total,
    retryAfter: cached.retryAfter,
  };
}

function setCachedRateLimit(type: RateLimitType, identifier: string, info: RateLimitInfo): void {
  const key = getCacheKey(type, identifier);
  rateLimitCache.set(key, {
    ...info,
    lastUpdated: Date.now(),
  });
}

// ────────────────────────────────────────────────────────────────────────────────
// Server Communication
// ────────────────────────────────────────────────────────────────────────────────

function extractRateLimitFromResponse(response: Response): RateLimitInfo | null {
  const remaining = response.headers.get('X-RateLimit-Remaining');
  const limit = response.headers.get('X-RateLimit-Limit');
  const reset = response.headers.get('X-RateLimit-Reset');
  const retryAfter = response.headers.get('Retry-After');
  
  if (remaining && limit && reset) {
    return {
      remaining: parseInt(remaining, 10),
      total: parseInt(limit, 10),
      resetTime: parseInt(reset, 10),
      retryAfter: retryAfter ? parseInt(retryAfter, 10) : undefined,
    };
  }
  
  return null;
}

export async function syncRateLimitFromResponse(
  response: Response,
  type: RateLimitType,
  identifier: string
): Promise<RateLimitInfo | null> {
  const rateLimitInfo = extractRateLimitFromResponse(response);
  
  if (rateLimitInfo) {
    setCachedRateLimit(type, identifier, rateLimitInfo);
  }
  
  // Also check response body for rate limit info
  if (response.status === 429) {
    try {
      const body = await response.clone().json();
      if (body.code === 'RATE_LIMIT_EXCEEDED') {
        const errorInfo: RateLimitInfo = {
          remaining: body.remaining ?? 0,
          resetTime: body.resetTime ?? Date.now() + 60000,
          total: rateLimitInfo?.total ?? 1,
          retryAfter: body.retryAfter,
        };
        setCachedRateLimit(type, identifier, errorInfo);
        return errorInfo;
      }
    } catch {
      // Ignore JSON parse errors
    }
  }
  
  return rateLimitInfo;
}

// ────────────────────────────────────────────────────────────────────────────────
// Public API
// ────────────────────────────────────────────────────────────────────────────────

export function getRateLimitInfo(type: RateLimitType, identifier: string): RateLimitInfo | null {
  return getCachedRateLimit(type, identifier);
}

export function canPerformAction(type: RateLimitType, identifier: string): boolean {
  const info = getCachedRateLimit(type, identifier);
  if (!info) return true; // Optimistically allow if no cached info
  
  const now = Date.now();
  
  // If reset time has passed, we can perform the action
  if (now >= info.resetTime) return true;
  
  // Otherwise check remaining count
  return info.remaining > 0;
}

export function getTimeUntilNextAction(type: RateLimitType, identifier: string): number {
  const info = getCachedRateLimit(type, identifier);
  if (!info) return 0;
  
  const now = Date.now();
  
  // If we have remaining actions, next action is immediate
  if (info.remaining > 0) return 0;
  
  // Otherwise wait until reset
  return Math.max(0, info.resetTime - now);
}

// ────────────────────────────────────────────────────────────────────────────────
// Enhanced Fetch Wrapper with Rate Limiting
// ────────────────────────────────────────────────────────────────────────────────

export interface RateLimitedFetchOptions extends RequestInit {
  rateLimitType?: RateLimitType;
  rateLimitIdentifier?: string;
  skipRateLimitCheck?: boolean;
}

// Helper to format seconds to "#h #m #s" (client-side)
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

export async function rateLimitedFetch(
  url: string,
  options: RateLimitedFetchOptions = {}
): Promise<Response> {
  const {
    rateLimitType,
    rateLimitIdentifier,
    skipRateLimitCheck = false,
    ...fetchOptions
  } = options;
  
  // Pre-flight rate limit check (optimistic)
  if (!skipRateLimitCheck && rateLimitType && rateLimitIdentifier) {
    if (!canPerformAction(rateLimitType, rateLimitIdentifier)) {
      const timeUntil = getTimeUntilNextAction(rateLimitType, rateLimitIdentifier);
      throw new Error(`Rate limited. Try again in ${formatSeconds(Math.ceil(timeUntil / 1000))}.`);
    }
  }
  
  const response = await fetch(url, fetchOptions);
  
  // Sync rate limit info from response
  if (rateLimitType && rateLimitIdentifier) {
    await syncRateLimitFromResponse(response, rateLimitType, rateLimitIdentifier);
  }
  
  // Handle rate limit errors
  if (response.status === 429) {
    const errorData = await response.clone().json().catch(() => ({}));
    if (errorData.code === 'RATE_LIMIT_EXCEEDED') {
      const error = new Error(errorData.error || 'Rate limit exceeded') as any;
      error.code = 'RATE_LIMIT_EXCEEDED';
      error.remaining = errorData.remaining;
      error.resetTime = errorData.resetTime;
      error.retryAfter = errorData.retryAfter;
      throw error;
    }
  }
  
  return response;
}

// ────────────────────────────────────────────────────────────────────────────────
// Backwards Compatibility (for existing components)
// ────────────────────────────────────────────────────────────────────────────────

export function getAnonIdeaCooldownMs(): number {
  const info = getCachedRateLimit('anon_ideas', 'browser');
  if (!info) return 0;
  return Math.max(0, info.resetTime - Date.now());
}

export function getIdeaTokens(userId: string): number {
  const info = getCachedRateLimit('auth_ideas', userId);
  return info?.remaining ?? 5; // Default to full bucket if no cached info
}

export function getVoteTokens(userId: string): number {
  const info = getCachedRateLimit('auth_votes', userId);
  return info?.remaining ?? 100; // Default to full bucket if no cached info
}

export function consumeIdeaToken(userId: string): boolean {
  return canPerformAction('auth_ideas', userId);
}

export function consumeVoteToken(userId: string): boolean {
  return canPerformAction('auth_votes', userId);
}

export function timeUntilNextToken(type: "idea" | "vote", userId: string): number {
  const rateLimitType = type === "idea" ? "auth_ideas" : "auth_votes";
  return getTimeUntilNextAction(rateLimitType, userId);
}

export function recordAnonIdeaSubmit(): void {
  // This is now handled by server response sync
  // But we can optimistically update the cache
  setCachedRateLimit('anon_ideas', 'browser', {
    remaining: 0,
    resetTime: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    total: 1,
  });
}

// ────────────────────────────────────────────────────────────────────────────────
// React Hook for Real-time Rate Limit Updates
// ────────────────────────────────────────────────────────────────────────────────

export function useRateLimit(type: RateLimitType, identifier: string) {
  const [info, setInfo] = React.useState(() => getCachedRateLimit(type, identifier));
  
  React.useEffect(() => {
    const interval = setInterval(() => {
      const updated = getCachedRateLimit(type, identifier);
      setInfo(updated);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [type, identifier]);
  
  return {
    canPerform: info ? (info.remaining > 0 || Date.now() >= info.resetTime) : true,
    remaining: info?.remaining ?? null,
    resetTime: info?.resetTime ?? null,
    timeUntilNext: info ? getTimeUntilNextAction(type, identifier) : 0,
  };
}

// For React import
declare const React: any; 