// Debug utilities shared across client
import posthog from "posthog-js";

/**
 * Whether PostHog console logging is enabled. Controlled via VITE_POSTHOG_CONSOLE=true in .env.
 */
export let analyticsDebug =
  import.meta.env.DEV && import.meta.env.VITE_POSTHOG_CONSOLE === "true";

/**
 * Enable or disable PostHog debug logs at runtime. Exposed globally in dev as window.toggleAnalyticsDebug().
 */
export function setAnalyticsDebug(enabled: boolean) {
  analyticsDebug = enabled;
  posthog.debug(enabled);
  if (import.meta.env.DEV) {
    console.info(`[PostHog] Debug ${enabled ? "enabled" : "disabled"}`);
  }
}

// Expose a global toggle helper during development for quick switching
if (import.meta.env.DEV && typeof window !== "undefined") {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  window.toggleAnalyticsDebug = () => setAnalyticsDebug(!analyticsDebug);
  // Initialise with current state
  posthog.debug(analyticsDebug);
} 