import { useState, useEffect } from "react";
import { useAuth } from "@client/context/AuthContext";
import {
  rateLimitedFetch,
  getTimeUntilNextAction,
  syncRateLimitFromResponse,
  type RateLimitType,
} from "@client/utils/rateLimit";

interface AddIdeaAreaProps {
  onSubmit: (data: any) => Promise<void> | void;
}

export default function AddIdeaArea({ onSubmit }: AddIdeaAreaProps) {
  const [ideaText, setIdeaText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rateLimitError, setRateLimitError] = useState<string | null>(null);
  const [timeUntilNext, setTimeUntilNext] = useState(0);
  const { session } = useAuth();

  // Rate limiting config
  const userId = session?.user?.id;
  const rateLimitType: RateLimitType = userId ? "auth_ideas" : "anon_ideas";
  const rateLimitIdentifier = userId || "browser";

  // Update remaining time every second
  useEffect(() => {
    const updateTimer = () => {
      const remaining = getTimeUntilNextAction(rateLimitType, rateLimitIdentifier);
      setTimeUntilNext(remaining);
      if (remaining === 0 && rateLimitError) {
        setRateLimitError(null);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [rateLimitType, rateLimitIdentifier, rateLimitError]);

  const canSubmit = timeUntilNext === 0 && ideaText.trim().length > 0;

  async function handleSubmit() {
    if (!ideaText.trim() || !canSubmit || isSubmitting) return;

    setIsSubmitting(true);
    setRateLimitError(null);

    try {
      const authorPayload = session
        ? {
            user_id: session.user.id,
            author_name:
              (session.user.user_metadata?.full_name || session.user.email) ?? "Anon",
            author_avatar_url: session.user.user_metadata?.avatar_url ?? null,
          }
        : {};

      const response = await rateLimitedFetch("/api/ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: ideaText.trim(), ...authorPayload }),
        rateLimitType,
        rateLimitIdentifier,
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const result = await response.json();
      if (result.success) {
        setIdeaText("");
        await onSubmit(result.idea);
        await syncRateLimitFromResponse(response, rateLimitType, rateLimitIdentifier);
      } else {
        throw new Error(result.error || "Failed to submit idea");
      }
    } catch (error: any) {
      console.error("Failed to submit idea:", error);
      if (error.code === "RATE_LIMIT_EXCEEDED") {
        setRateLimitError(error.message);
        setTimeUntilNext(error.retryAfter * 1000);
      } else {
        setRateLimitError(error.message || "Failed to submit idea. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  const formatTimeRemaining = (ms: number): string => {
    if (ms <= 0) return "";
    const seconds = Math.ceil(ms / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.ceil(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.ceil(minutes / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.ceil(hours / 24);
    return `${days}d`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col h-full">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
        Share Your Idea
      </h2>

      <div className="space-y-4 flex flex-col flex-1 min-h-0">
        <textarea
          value={ideaText}
          onChange={(e) => setIdeaText(e.target.value)}
          placeholder={
            userId
              ? "What's your idea? Share it with the community..."
              : "Share your idea anonymously (1 per day)..."
          }
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none flex-1 min-h-0"
          maxLength={500}
          disabled={isSubmitting}
        />

        <div className="flex items-center justify-between mt-4">
          <span className="text-sm text-gray-500">{ideaText.length}/500 characters</span>

          <div className="flex items-center gap-3">
            {timeUntilNext > 0 && (
              <span className="text-sm text-orange-600">
                Next idea in {formatTimeRemaining(timeUntilNext)}
              </span>
            )}

            <button
              onClick={handleSubmit}
              disabled={!canSubmit || isSubmitting}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                canSubmit && !isSubmitting
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {isSubmitting ? "Submitting..." : "Share Idea"}
            </button>
          </div>
        </div>

        {rateLimitError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{rateLimitError}</p>
          </div>
        )}

        {!userId && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-600">
              💡 <strong>Sign in</strong> to submit up to 5 ideas per hour instead of 1 per day
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 