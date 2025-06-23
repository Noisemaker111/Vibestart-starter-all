import { useEffect, useState } from "react";
import AddIdeaArea from "@client/components/AddIdeaArea";
import IdeaCard from "@client/components/IdeaCard";
import TopVotedArea from "@client/components/TopVotedArea";
import { useAuth } from "@client/context/AuthContext";
import {
  rateLimitedFetch,
  syncRateLimitFromResponse,
  getTimeUntilNextAction,
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
  score: number;
  created_at: string;
  author: {
    name: string;
    avatar_url: string | null;
  };
  userVote?: 1 | 0 | -1;
}

export default function Ideas() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<{ key: "time" | "rating"; dir: "asc" | "desc" }>({
    key: "time",
    dir: "desc",
  });
  const [loginOpen, setLoginOpen] = useState(false);
  const [voteError, setVoteError] = useState<string | null>(null);
  // Pagination for ideas grid – show 50 ideas (10 rows × 5 cols) per "page"
  const PAGE_SIZE = 50;
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const { session } = useAuth();

  useEffect(() => {
    async function fetchIdeas() {
      try {
        const url = new URL("/api/ideas", window.location.origin);
        if (session?.user?.id) {
          url.searchParams.set("user_id", session.user.id);
        }
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.success) {
          setIdeas(data.ideas);
        }
      } catch (error) {
        console.error("Failed to fetch ideas:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchIdeas();
  }, [session]);

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
      setLoginOpen(true);
      return;
    }

    setVoteError(null);

    // Capture current vote for potential rollback
    let previousVote: 1 | 0 | -1 = 0;
    setIdeas((prev) =>
      prev.map((idea) => {
        if (idea.id !== ideaId) return idea;
        previousVote = (idea as any).userVote ?? 0;
        const diff = value - previousVote;
        return {
          ...idea,
          userVote: value,
          score: (idea.score ?? 0) + diff,
        } as Idea;
      })
    );

    try {
      // Use unified rate limited fetch
      const response = await rateLimitedFetch(`/api/ideas/${ideaId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value, user_id: session.user.id }),
        rateLimitType: 'auth_votes',
        rateLimitIdentifier: session.user.id,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        // Update with actual server score
        setIdeas((prev) =>
          prev.map((idea) => {
            if (idea.id !== ideaId) return idea;
            return {
              ...idea,
              userVote: value,
              score: result.score,
            } as Idea;
          })
        );
        
        // Sync rate limit info from server response
        await syncRateLimitFromResponse(response, 'auth_votes', session.user.id);
      } else {
        throw new Error(result.error || "Failed to vote");
      }
    } catch (error: any) {
      console.error("Failed to vote:", error);
      
      // Revert optimistic update on error
      setIdeas((prev) =>
        prev.map((idea) => {
          if (idea.id !== ideaId) return idea;
          const diff = previousVote - value;
          return {
            ...idea,
            userVote: previousVote,
            score: (idea.score ?? 0) + diff,
          } as Idea;
        })
      );

      // Handle rate limit errors specifically
      if (error.code === 'RATE_LIMIT_EXCEEDED') {
        const timeUntil = Math.ceil(error.retryAfter);
        setVoteError(`Out of votes. Next vote in ${timeUntil}s.`);
        
        // Clear error after the timeout
        setTimeout(() => setVoteError(null), error.retryAfter * 1000);
      } else {
        setVoteError(error.message || "Failed to vote. Please try again.");
        setTimeout(() => setVoteError(null), 5000);
      }
    }
  }

  async function addIdea(ideaPayload: any) {
    // Optimistically add the idea to the UI
    const tempIdea: Idea = {
      id: Date.now(), // Temporary ID
      text: ideaPayload.text,
      score: 0,
      created_at: new Date().toISOString(),
      author: {
        name: ideaPayload.author_name || "Anon",
        avatar_url: ideaPayload.author_avatar_url || null,
      },
      userVote: 0,
    };

    setIdeas((prev) => [tempIdea, ...prev]);

    try {
      // The AddIdeaCard component now handles the server submission
      // This function is just for updating the local state
      // Replace the temp idea with the real one from the server
      setIdeas((prev) =>
        prev.map((idea) =>
          idea.id === tempIdea.id ? { ...ideaPayload, userVote: 0 } : idea
        )
      );
    } catch (error) {
      // Remove the temp idea if submission failed
      setIdeas((prev) => prev.filter((idea) => idea.id !== tempIdea.id));
      throw error;
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center">Loading ideas...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Ideas</h1>
        <p className="text-gray-600">Share your ideas and vote on others</p>
      </div>

      {/* Add Idea and Top Voted section */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1 h-full">
          <AddIdeaArea onSubmit={addIdea} />
        </div>
        <div className="lg:col-span-2">
          <TopVotedArea ideas={sortedIdeas} onVote={handleVote} />
        </div>
      </div>

      {voteError && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{voteError}</p>
        </div>
      )}

      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">All Ideas</h2>
        <div className="flex gap-2">
          <select
            value={`${sort.key}-${sort.dir}`}
            onChange={(e) => {
              const [key, dir] = e.target.value.split("-") as [
                "time" | "rating",
                "asc" | "desc"
              ];
              setSort({ key, dir });
            }}
            className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="time-desc">Newest first</option>
            <option value="time-asc">Oldest first</option>
            <option value="rating-desc">Highest rated</option>
            <option value="rating-asc">Lowest rated</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {sortedIdeas.slice(0, visibleCount).map((idea) => (
          <IdeaCard 
            key={idea.id} 
            id={idea.id}
            text={idea.text}
            created_at={idea.created_at}
            author={idea.author}
            score={idea.score}
            userVote={idea.userVote}
            onVote={handleVote}
          />
        ))}
      </div>

      {visibleCount < sortedIdeas.length && (
        <div className="mt-8 text-center">
          <button
            onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
            className="btn-primary"
          >
            Load More
          </button>
        </div>
      )}

      {sortedIdeas.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No ideas yet. Be the first to share one!</p>
        </div>
      )}

      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </div>
  );
} 