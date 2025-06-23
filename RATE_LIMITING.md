# Unified Rate Limiting System

This document explains the comprehensive rate limiting system that replaces the old client-side-only approach with a secure, unified system that works both client and server-side.

## Overview

The new rate limiting system provides:

- ✅ **Server-side enforcement** - Cannot be bypassed by clearing localStorage or disabling JavaScript
- ✅ **Database persistence** - Rate limits survive server restarts and scale across multiple instances
- ✅ **Client-side sync** - Real-time UI feedback with optimistic updates
- ✅ **Proper error handling** - HTTP 429 responses with standard headers
- ✅ **Type safety** - Full TypeScript support throughout
- ✅ **Easy integration** - Drop-in replacement for existing rate limiting code

## Architecture

### Server-Side (`src/server/utils/rateLimit.ts`)

The core rate limiting logic runs on the server and stores data in PostgreSQL:

```typescript
// Rate limit configurations
export const RATE_LIMITS = {
  ANON_IDEAS: { windowMs: 24 * 60 * 60 * 1000, maxRequests: 1 },     // 1 per day
  AUTH_IDEAS: { windowMs: 60 * 60 * 1000, maxRequests: 5 },          // 5 per hour
  AUTH_VOTES: { windowMs: 60 * 1000, maxRequests: 100 },             // 100 per minute
};

// Check if action is allowed
const result = await checkAuthIdeaLimit(userId);
if (!result.allowed) {
  throw createRateLimitError(result);
}
```

### Client-Side (`src/client/utils/rateLimit.ts`)

The client syncs with server rate limits and provides UI feedback:

```typescript
// Enhanced fetch that handles rate limiting
const response = await rateLimitedFetch("/api/ideas", {
  method: "POST",
  body: JSON.stringify(data),
  rateLimitType: 'auth_ideas',
  rateLimitIdentifier: userId,
});

// Real-time rate limit status
const { canPerform, remaining, timeUntilNext } = useRateLimit('auth_ideas', userId);
```

### Database Schema

```sql
CREATE TABLE rate_limits (
  key text PRIMARY KEY NOT NULL,
  requests integer DEFAULT 0 NOT NULL,
  reset_time bigint NOT NULL,
  updated_at timestamp DEFAULT now() NOT NULL
);
```

## Implementation

### 1. Server API Endpoints

All API endpoints now enforce rate limits before processing requests:

**Ideas API (`src/server/ideas.ts`)**:
```typescript
// Check rate limit based on user type
let rateLimitResult;
if (parsed.user_id) {
  rateLimitResult = await checkAuthIdeaLimit(parsed.user_id);
} else {
  const clientIp = getClientIdentifier(request);
  rateLimitResult = await checkAnonIdeaLimit(clientIp);
}

if (!rateLimitResult.allowed) {
  return new Response(JSON.stringify({
    error: "Rate limit exceeded",
    code: "RATE_LIMIT_EXCEEDED",
    retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)
  }), { 
    status: 429,
    headers: {
      "Retry-After": retryAfter.toString(),
      "X-RateLimit-Limit": rateLimitResult.total.toString(),
      "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
    }
  });
}
```

**Voting API (`src/server/vote.ts`)**:
```typescript
const rateLimitResult = await checkAuthVoteLimit(user_id);
if (!rateLimitResult.allowed) {
  // Return 429 with proper headers
}
```

### 2. Client Components

Components now handle rate limit errors gracefully and show real-time feedback:

**AddIdeaCard (`src/client/components/AddIdeaCard.tsx`)**:
```typescript
try {
  const response = await rateLimitedFetch("/api/ideas", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    rateLimitType: userId ? 'auth_ideas' : 'anon_ideas',
    rateLimitIdentifier: userId || 'browser',
  });
} catch (error) {
  if (error.code === 'RATE_LIMIT_EXCEEDED') {
    setRateLimitError(error.message);
    setTimeUntilNext(error.retryAfter * 1000);
  }
}
```

**Ideas Page (`src/client/pages/ideas.tsx`)**:
```typescript
const response = await rateLimitedFetch(`/api/ideas/${ideaId}/vote`, {
  method: "POST",
  rateLimitType: 'auth_votes',
  rateLimitIdentifier: session.user.id,
});
```

## Rate Limit Types

### Anonymous Users
- **Ideas**: 1 per 24 hours (tracked by IP address)
- **Votes**: Not allowed (must sign in)

### Authenticated Users  
- **Ideas**: 5 per hour (token bucket refill)
- **Votes**: 100 per minute (token bucket refill)

## Error Handling

### HTTP 429 Response Format
```json
{
  "error": "Rate limit exceeded. Try again in 3600 seconds.",
  "code": "RATE_LIMIT_EXCEEDED", 
  "remaining": 0,
  "resetTime": 1699123456789,
  "retryAfter": 3600,
  "success": false
}
```

### Response Headers
```
HTTP/1.1 429 Too Many Requests
Retry-After: 3600
X-RateLimit-Limit: 5
X-RateLimit-Remaining: 0  
X-RateLimit-Reset: 1699123456789
```

### Client Error Handling
```typescript
catch (error) {
  if (error.code === 'RATE_LIMIT_EXCEEDED') {
    showError(`Rate limited. Try again in ${error.retryAfter} seconds.`);
  } else {
    showError('Something went wrong. Please try again.');
  }
}
```

## UI Feedback

### Real-time Updates
```typescript
// Show remaining actions and time until reset
const { canPerform, remaining, timeUntilNext } = useRateLimit('auth_ideas', userId);

return (
  <div>
    {remaining > 0 ? (
      <span>{remaining} ideas remaining</span>
    ) : (
      <span>Next idea in {formatTime(timeUntilNext)}</span>
    )}
    <button disabled={!canPerform}>Share Idea</button>
  </div>
);
```

### User Education
```typescript
{!userId && (
  <div className="info-banner">
    💡 <strong>Sign in</strong> to submit up to 5 ideas per hour instead of 1 per day
  </div>
)}
```

## Migration from Old System

### Before (Client-only)
```typescript
// ❌ Could be bypassed by clearing localStorage
if (!consumeIdeaToken(userId)) {
  alert("Out of ideas. Wait 1 hour.");
  return;
}
```

### After (Unified)
```typescript
// ✅ Server enforces, client syncs
try {
  await rateLimitedFetch("/api/ideas", {
    rateLimitType: 'auth_ideas',
    rateLimitIdentifier: userId,
  });
} catch (error) {
  if (error.code === 'RATE_LIMIT_EXCEEDED') {
    setError(`Rate limited. Try again in ${error.retryAfter}s.`);
  }
}
```

## Backward Compatibility

For existing components that haven't been migrated yet, the client-side utility provides backward-compatible functions:

```typescript
// These still work but now sync with server data
export function getIdeaTokens(userId: string): number;
export function consumeIdeaToken(userId: string): boolean;
export function timeUntilNextToken(type: "idea" | "vote", userId: string): number;
```

## Database Operations

### Automatic Cleanup
```typescript
// Runs periodically to remove expired records
await cleanupExpiredRecords();
```

### Manual Rate Limit Check
```typescript
// Get current status without consuming
const info = await getClientRateLimitInfo('auth_ideas', userId);
console.log(`${info.remaining} remaining until ${new Date(info.resetTime)}`);
```

## Testing

Run the test suite to verify the system:

```bash
npx tsx src/server/utils/test-rate-limit.ts
```

## Setup Requirements

1. **Database Table**: Ensure the `rate_limits` table exists:
   ```sql
   CREATE TABLE rate_limits (
     key text PRIMARY KEY NOT NULL,
     requests integer DEFAULT 0 NOT NULL,
     reset_time bigint NOT NULL,
     updated_at timestamp DEFAULT now() NOT NULL
   );
   ```

2. **Environment**: PostgreSQL database with proper connection string

3. **Dependencies**: Drizzle ORM for database operations

## Benefits

### Security
- Server-side enforcement prevents bypassing
- IP-based tracking for anonymous users
- Database persistence across server restarts

### User Experience  
- Real-time feedback on remaining actions
- Graceful error messages with retry times
- Progressive enhancement (works without JS)

### Developer Experience
- Type-safe throughout
- Easy to test and debug
- Consistent error handling
- Standard HTTP status codes and headers

### Performance
- Efficient database operations
- Automatic cleanup of old records
- Cached client-side state

## Future Enhancements

- Redis backend for high-scale deployments
- Configurable rate limits per user tier
- Rate limit analytics and monitoring
- Distributed rate limiting across regions 