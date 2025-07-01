import { useState } from "react";
import { useClearTests } from "@client/utils/testIntegrationEvents";
import { TestCard } from "@client/components/docs/test-integrations/TestCard";

function StatusIcon({ status }: { status: "idle" | "ok" | "error" | "pending" }) {
  if (status === "ok") return <span className="text-green-500 ml-2">✔</span>;
  if (status === "error") return <span className="text-red-500 ml-2">✖</span>;
  if (status === "pending") return <span className="text-gray-400 ml-2">…</span>;
  return <span className="text-yellow-500 ml-2">⚠</span>;
}

export default function DocsTestAnalytics() {
  const [status, setStatus] = useState<"idle" | "ok" | "error" | "pending">("idle");

  useClearTests(() => {
    setStatus("idle");
  });

  async function sendTestEvent() {
    try {
      setStatus("pending");
      // Send event via PostHog JS if available
      // @ts-ignore – posthog global may exist
      if (window.posthog) {
        // capture returns void, but we treat as success immediately
        window.posthog.capture("docs_test_event", { ts: Date.now() });
        setStatus("ok");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <TestCard
      headerClassName="bg-rose-50 dark:bg-rose-900/20"
      title={
        <div className="flex items-center gap-3 flex-wrap">
          <span>Analytics (PostHog)</span>
          <StatusIcon status={status} />
          <button
            onClick={sendTestEvent}
            className="btn-primary px-3 py-1 text-sm"
            disabled={status === "pending"}
          >
            Send Test Event
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        {status === "ok" && (
          <p className="text-sm text-green-600 dark:text-green-400">Event sent! Check PostHog.</p>
        )}
        {status === "error" && (
          <p className="text-sm text-red-600 dark:text-red-400">Failed to send event. Is PostHog initialised?</p>
        )}
      </div>
    </TestCard>
  );
} 