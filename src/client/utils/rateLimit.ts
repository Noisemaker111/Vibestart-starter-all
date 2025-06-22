/*
Utility functions for simple client-side rate-limiting.
The rules implemented here mirror backend requirements:

Anonymous users:
  • 1 idea every 24 h (tracked per-browser via localStorage)

Authenticated users (by userId):
  • Ideas: 5 token bucket. 1 token refills every hour.
  • Votes: 100 token bucket. 1 token refills every minute.

All timestamps are stored in ms since epoch.  No server clock trust – purely best-effort UX guidance.
*/

const MS = {
  minute: 60_000,
  hour: 3_600_000,
  day: 86_400_000,
};

// ────────────────────────────────────────────────────────────────────────────────
// Anonymous idea submission (per-browser)
// ────────────────────────────────────────────────────────────────────────────────
const ANON_IDEA_KEY = "anonIdeaLastTs"; // last submit timestamp (ms)

export function getAnonIdeaCooldownMs(): number {
  const last = Number(localStorage.getItem(ANON_IDEA_KEY) ?? 0);
  const diff = Date.now() - last;
  return diff >= MS.day ? 0 : MS.day - diff;
}

export function recordAnonIdeaSubmit(): void {
  localStorage.setItem(ANON_IDEA_KEY, String(Date.now()));
}

// ────────────────────────────────────────────────────────────────────────────────
// Token-bucket helpers
// ────────────────────────────────────────────────────────────────────────────────
function keyTokens(type: "idea" | "vote", userId: string) {
  return `${type}Tokens_${userId}`;
}
function keyRefill(type: "idea" | "vote", userId: string) {
  return `${type}LastRefill_${userId}`;
}

interface BucketCfg {
  max: number;
  refillMs: number; // time between token refills
}

const BUCKETS: Record<"idea" | "vote", BucketCfg> = {
  idea: { max: 5, refillMs: MS.hour },
  vote: { max: 100, refillMs: MS.minute },
};

function getTokens(type: "idea" | "vote", userId: string): number {
  const { max, refillMs } = BUCKETS[type];
  const tKey = keyTokens(type, userId);
  const rKey = keyRefill(type, userId);

  let tokens = Number(localStorage.getItem(tKey));
  if (Number.isNaN(tokens) || tokens === 0 && localStorage.getItem(tKey) === null) {
    tokens = max; // first sign-in => full bucket
  }

  let lastRefill = Number(localStorage.getItem(rKey));
  if (Number.isNaN(lastRefill) || lastRefill === 0) {
    lastRefill = Date.now();
  }

  // Apply refills based on elapsed time
  const elapsed = Date.now() - lastRefill;
  if (elapsed >= refillMs) {
    const add = Math.floor(elapsed / refillMs);
    tokens = Math.min(max, tokens + add);
    lastRefill += add * refillMs;
    localStorage.setItem(tKey, String(tokens));
    localStorage.setItem(rKey, String(lastRefill));
  }
  return tokens;
}

function setTokens(type: "idea" | "vote", userId: string, tokens: number) {
  localStorage.setItem(keyTokens(type, userId), String(tokens));
  localStorage.setItem(keyRefill(type, userId), String(Date.now()));
}

export function getIdeaTokens(userId: string): number {
  return getTokens("idea", userId);
}
export function getVoteTokens(userId: string): number {
  return getTokens("vote", userId);
}

export function consumeIdeaToken(userId: string): boolean {
  const tokens = getTokens("idea", userId);
  if (tokens <= 0) return false;
  setTokens("idea", userId, tokens - 1);
  return true;
}
export function consumeVoteToken(userId: string): boolean {
  const tokens = getTokens("vote", userId);
  if (tokens <= 0) return false;
  setTokens("vote", userId, tokens - 1);
  return true;
}

export function timeUntilNextToken(type: "idea" | "vote", userId: string): number {
  const { refillMs } = BUCKETS[type];
  const lastRefill = Number(localStorage.getItem(keyRefill(type, userId)) ?? Date.now());
  const elapsed = Date.now() - lastRefill;
  return elapsed >= refillMs ? 0 : refillMs - elapsed;
} 