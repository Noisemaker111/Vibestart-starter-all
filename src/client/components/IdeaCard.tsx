import { useState } from "react";

interface IdeaCardProps {
  id: number;
  text: string;
  created_at: string;
  author?: {
    name: string;
    avatar_url?: string | null;
  };
  score?: number;
  // Optional vote handler – returns the new vote value (1 | 0 | -1)
  onVote?: (ideaId: number, value: 1 | 0 | -1) => void | Promise<void>;
  userVote?: 1 | 0 | -1;
  tall?: boolean;
}

export default function IdeaCard({
  id,
  text,
  created_at,
  author,
  score: initialScore = 0,
  onVote,
  userVote: initialUserVote = 0,
  tall = false,
}: IdeaCardProps) {
  const [score, setScore] = useState(initialScore);
  const [userVote, setUserVote] = useState<1 | 0 | -1>(initialUserVote);
  const [submitting, setSubmitting] = useState(false);

  const heightClass = tall ? "h-80" : "h-60";
  const clampClass = tall ? "line-clamp-[10]" : "line-clamp-6";

  async function handleVote(value: 1 | -1) {
    if (submitting) return;

    const newVote = userVote === value ? 0 : value; // toggle if same vote clicked
    const diff = newVote - userVote; // -1, 0, or 1 adjustment to score
    setUserVote(newVote);
    setScore((s) => s + diff);

    if (onVote) {
      setSubmitting(true);
      try {
        await onVote(id, newVote);
      } catch (e) {
        // revert on error
        setUserVote(userVote);
        setScore((s) => s - diff);
      } finally {
        setSubmitting(false);
      }
    }
  }

  const dateString = new Intl.DateTimeFormat("en-US", {
    month: "numeric",
    day: "numeric",
    year: "2-digit",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(created_at));

  return (
    <div
      className={`${heightClass} flex flex-col rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow overflow-hidden`}
    >
      {/* Idea text */}
      <p
        className={`p-6 whitespace-pre-wrap text-gray-900 dark:text-white text-sm sm:text-base leading-relaxed flex-1 overflow-hidden ${clampClass}`}
      >
        {text}
      </p>

      {/* Bottom meta row */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 dark:border-gray-700 text-xs sm:text-sm shrink-0">
        {/* Date & time */}
        <span className="text-gray-500 dark:text-gray-400 select-none">
          {dateString}
        </span>

        {/* Voting */}
        <div className="flex items-center gap-2 select-none">
          <button
            onClick={() => handleVote(-1)}
            disabled={submitting}
            className={`w-6 h-6 flex items-center justify-center rounded-full transition-colors ${
              userVote === -1 ? "text-red-600" : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
            aria-label="Down vote"
          >
            {submitting ? (
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 7l7 7 7-7" />
              </svg>
            )}
          </button>
          <span className="font-medium text-gray-700 dark:text-gray-300 w-8 text-center">
            {score}
          </span>
          <button
            onClick={() => handleVote(1)}
            disabled={submitting}
            className={`w-6 h-6 flex items-center justify-center rounded-full transition-colors ${
              userVote === 1 ? "text-blue-600" : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
            aria-label="Up vote"
          >
            {submitting ? (
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17 13l-7-7-7 7" />
              </svg>
            )}
          </button>
        </div>

        {/* Author */}
        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 truncate max-w-[120px] sm:max-w-none">
          {author?.avatar_url ? (
            <img
              src={author.avatar_url}
              alt={author.name}
              className="w-5 h-5 rounded-full object-cover"
            />
          ) : null}
          <span className="font-medium truncate">{author?.name ?? "Anon"}</span>
        </div>
      </div>
    </div>
  );
} 