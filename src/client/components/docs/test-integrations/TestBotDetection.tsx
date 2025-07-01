import { useEffect, useState } from "react";
import { useClearTests } from "@client/utils/testIntegrationEvents";
import { TestCard } from "@client/components/docs/test-integrations/TestCard";

/**
 * Simple client-side test component for Vercel BotID.
 * It calls our `/api/botid` endpoint which proxies `checkBotId()` on the server.
 * When the verification passes we display a green check-mark ✅, otherwise a red cross ❌.
 *
 * This is purely for demonstration purposes inside the in-app docs section.
 */
export default function DocsTestBotDetection() {
  const [status, setStatus] = useState<"pending" | "success" | "error">("pending");

  // Run verification on mount
  useEffect(() => {
    fetch("/api/botid")
      .then(async (res) => {
        if (!res.ok) throw new Error("Network error");
        const data = (await res.json()) as { isBot?: boolean };
        setStatus(data?.isBot ? "error" : "success");
      })
      .catch(() => setStatus("error"));
  }, []);

  // Listen for global clear – reset to pending and re-verify
  useClearTests(() => {
    setStatus("pending");
    fetch("/api/botid")
      .then(async (res) => {
        if (!res.ok) throw new Error("Network error");
        const data = (await res.json()) as { isBot?: boolean };
        setStatus(data?.isBot ? "error" : "success");
      })
      .catch(() => setStatus("error"));
  });

  const renderStatusIcon = () => {
    switch (status) {
      case "success":
        return <span className="text-green-500">✓</span>;
      case "error":
        return <span className="text-red-500">✕</span>;
      default:
        return null;
    }
  };

  return (
    <TestCard
      headerClassName="bg-emerald-50 dark:bg-emerald-900/20"
      title={
        <>
          <span>Bot Detection (Vercel BotID)</span>
          {status === "pending" ? (
            <span className="ml-2 text-gray-400 text-xs">pending...</span>
          ) : (
            <span className="ml-2">{renderStatusIcon()}</span>
          )}
        </>
      }
    >
      <div className="space-y-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          This check issues a <code>checkBotId()</code> request on the server. A green check
          indicates the current session has been verified as <strong>human</strong> by BotID.
        </p>
        {status === "error" && (
          <p className="text-sm text-red-500">
            Your request was flagged as a bot or the verification failed.
          </p>
        )}
      </div>
    </TestCard>
  );
} 