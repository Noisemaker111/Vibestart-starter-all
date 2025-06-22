import { useEffect, useState } from "react";
import AddIdeaCard from "@client/components/AddIdeaCard";

// NOTE: Route helper types will be generated automatically by React Router dev.
import type { Route } from "./+types/ideas";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ideas - jonstack" },
    { name: "description", content: "Share and view ideas submitted by anyone." },
  ];
}

interface Idea {
  id: number;
  text: string;
  created_at: string;
}

export default function Ideas() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load ideas on mount
  useEffect(() => {
    async function fetchIdeas() {
      try {
        const res = await fetch("/api/ideas");
        const json = await res.json();
        if (!json.success) throw new Error(json.error || "Failed to load ideas");
        setIdeas(json.ideas as Idea[]);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }
    fetchIdeas();
  }, []);

  async function handleAddIdea(text: string) {
    try {
      const res = await fetch("/api/ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Failed to submit idea");
      const created: Idea = json.idea;
      // Prepend new idea for freshness
      setIdeas((prev) => [created, ...prev]);
    } catch (err) {
      alert((err as Error).message);
    }
  }

  function handleDeleteIdea(id: number) {
    setIdeas((prev) => prev.filter((idea) => idea.id !== id));
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Page header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-300 dark:to-purple-300 bg-clip-text text-transparent mb-4">
            Share Your ideas
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Got an idea for a feature, app, or anything else? Type it in and watch it appear!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Input on the left */}
          <AddIdeaCard onSubmit={handleAddIdea} />

          {/* Ideas list on the right */}
          <div className="space-y-4">
            {loading ? (
              <p className="text-gray-600 dark:text-gray-400">Loading ideas…</p>
            ) : error ? (
              <p className="text-red-600 dark:text-red-400">{error}</p>
            ) : ideas.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-inner">
                <p className="text-gray-600 dark:text-gray-400">No ideas yet. Be the first to add one!</p>
              </div>
            ) : (
              <ul className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                {ideas.map((idea) => (
                  <li key={idea.id} className="relative group bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
                    <p className="text-gray-900 dark:text-white whitespace-pre-wrap mb-2">{idea.text}</p>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(idea.created_at).toLocaleString()}
                    </span>
                    <button
                      onClick={() => handleDeleteIdea(idea.id)}
                      className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500"
                      aria-label="Delete idea"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </main>
  );
} 