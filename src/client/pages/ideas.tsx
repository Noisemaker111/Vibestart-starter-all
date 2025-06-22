import { useEffect, useState } from "react";
import AddIdeaCard from "@client/components/AddIdeaCard";
import IdeaCard from "@client/components/IdeaCard";
import TopVotedArea from "@client/components/TopVotedArea";
import { useAuth } from "@client/context/AuthContext";
import {
  consumeVoteToken,
  timeUntilNextToken,
} from "@client/utils/rateLimit";
import { LoginModal } from "@client/components/LoginModal";

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
  score?: number;
  author?: {
    name: string;
    avatar_url?: string | null;
  };
  userVote?: 1 | 0 | -1;
}

export default function Ideas() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { session } = useAuth();

  const [loginOpen, setLoginOpen] = useState(false);

  // Load ideas on mount
  useEffect(() => {
    async function fetchIdeas() {
      try {
        const url = session ? `/api/ideas?user_id=${session.user.id}` : "/api/ideas";
        const res = await fetch(url);
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
  }, [session]);

  async function handleAddIdea(data: { text: string; user_id?: string; author_name?: string; author_avatar_url?: string | null }) {
    try {
      const res = await fetch("/api/ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
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

  // Sorting state { key: "time" | "rating", dir: "asc" | "desc" }
  const [sort, setSort] = useState<{ key: "time" | "rating"; dir: "asc" | "desc" }>({
    key: "time",
    dir: "desc", // newest first by default
  });

  const sortedIdeas = [...ideas].sort((a, b) => {
    if (sort.key === "time") {
      const diff = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      return sort.dir === "asc" ? diff : -diff;
    }
    // rating
    const diff = (a.score ?? 0) - (b.score ?? 0);
    return sort.dir === "asc" ? diff : -diff;
  });

  async function handleVote(ideaId: number, value: 1 | 0 | -1) {
    if (!session) {
      // Prompt login modal instead of alert
      setLoginOpen(true);
      return;
    }

    if (!consumeVoteToken(session.user.id)) {
      const remainingMs = timeUntilNextToken("vote", session.user.id);
      const secs = Math.ceil(remainingMs / 1000);
      alert(`Out of votes. Wait ${secs}s for next vote.`);
      throw new Error("Rate limited");
    }

    try {
      await fetch(`/api/ideas/${ideaId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value, user_id: session.user.id }),
      });
      // no need to update score list because IdeaCard already adjusted locally
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full px-6 py-12 max-w-none mx-auto">
        {/* Page header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-300 dark:to-purple-300 bg-clip-text text-transparent mb-4">
            Share Your ideas
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Got an idea for a feature, app, or anything else? Type it in and watch it appear!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Input */}
          <div className="lg:col-span-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Share an Idea</h2>
            <AddIdeaCard onSubmit={handleAddIdea} hideTitle />
          </div>

          {/* Top voted */}
          <TopVotedArea ideas={ideas} onVote={handleVote} />
        </div>

        {/* Filter bar */}
        <div className="flex flex-wrap items-center gap-3 sticky top-16 z-10 bg-gray-50 dark:bg-gray-900 py-2 my-6">
          {[
            { key: "time", label: "Time" },
            { key: "rating", label: "Rating" },
          ].map((btn) => {
            const isActive = sort.key === btn.key;
            const arrow = isActive && sort.dir === "asc" ? "↑" : "↓";
            return (
              <button
                key={btn.key}
                onClick={() =>
                  setSort((prev) => {
                    if (prev.key === btn.key) {
                      return { ...prev, dir: prev.dir === "asc" ? "desc" : "asc" };
                    }
                    return { key: btn.key as any, dir: "desc" };
                  })
                }
                className={`px-4 py-1 rounded-full border text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-600 text-white border-blue-600"
                    : "border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                {btn.label} {arrow}
              </button>
            );
          })}
        </div>

        {/* Ideas grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-6">
          {sortedIdeas.map((idea) => (
            <IdeaCard
              key={idea.id}
              id={idea.id}
              text={idea.text}
              created_at={idea.created_at}
              score={idea.score}
              author={idea.author}
              userVote={(idea as any).userVote}
              onVote={handleVote}
            />
          ))}
        </div>

        {/* Loading / error handling */}
        {loading ? (
          <p className="text-gray-600 dark:text-gray-400">Loading ideas…</p>
        ) : error ? (
          <p className="text-red-600 dark:text-red-400">{error}</p>
        ) : null}

        <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
      </div>
    </main>
  );
} 