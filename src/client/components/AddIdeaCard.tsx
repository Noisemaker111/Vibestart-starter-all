import { useState } from "react";

interface AddIdeaCardProps {
  onSubmit: (idea: string) => Promise<void> | void;
  hideTitle?: boolean;
}

export default function AddIdeaCard({ onSubmit, hideTitle = false }: AddIdeaCardProps) {
  const [ideaText, setIdeaText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    if (!ideaText.trim()) return;
    setIsSubmitting(true);
    try {
      await onSubmit(ideaText.trim());
      setIdeaText("");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 lg:p-8 border border-gray-100 dark:border-gray-700">
      {!hideTitle && (
        <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
          Share an Idea
        </h2>
      )}
      <textarea
        value={ideaText}
        onChange={(e) => setIdeaText(e.target.value)}
        rows={5}
        placeholder="Type your next big idea here…"
        className="flex-1 min-h-0 w-full px-4 py-3 text-base bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all duration-200 placeholder-gray-500 dark:placeholder-gray-500 resize-none"
        disabled={isSubmitting}
      />
      <button
        onClick={handleSubmit}
        disabled={!ideaText.trim() || isSubmitting}
        className="mt-4 w-full sm:w-auto relative group overflow-hidden rounded-xl px-6 py-4 font-semibold text-white transition-all duration-300 disabled:cursor-not-allowed"
      >
        <div
          className={`absolute inset-0 transition-all duration-300 ${
            !ideaText.trim() || isSubmitting
              ? "bg-gray-400 dark:bg-gray-600"
              : "bg-gradient-to-r from-blue-600 to-purple-600 group-hover:from-blue-700 group-hover:to-purple-700"
          }`}
        ></div>
        <div className="relative flex items-center justify-center gap-3">
          {isSubmitting ? (
            <>
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Submitting…</span>
            </>
          ) : (
            <>
              <svg
                className={`w-5 h-5 transition-transform duration-300 ${ideaText.trim() ? "group-hover:rotate-90" : ""}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Submit Idea</span>
            </>
          )}
        </div>
        {!isSubmitting && ideaText.trim() && (
          <div className="absolute inset-0 -top-2 h-[102%] w-full translate-x-[-100%] bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-[100%] transition-transform duration-1000"></div>
        )}
      </button>
    </div>
  );
} 