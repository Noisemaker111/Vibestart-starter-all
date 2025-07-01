import { useEffect } from "react";

export const CLEAR_TESTS_EVENT = "vs-clear-tests" as const;

/**
 * Dispatch a global event telling all test integration widgets to reset their state.
 */
export function dispatchClearTests() {
  window.dispatchEvent(new Event(CLEAR_TESTS_EVENT));
}

/**
 * Hook for integration widgets to listen for the global clear command.
 * Pass a callback that resets local state.
 */
export function useClearTests(handler: () => void) {
  useEffect(() => {
    // Ensure React in scope – import inside hook to avoid SSR issues
    const cb = () => handler();
    window.addEventListener(CLEAR_TESTS_EVENT, cb);
    return () => window.removeEventListener(CLEAR_TESTS_EVENT, cb);
  }, [handler]);
} 