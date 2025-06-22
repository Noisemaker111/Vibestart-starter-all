import IdeaCard from "@client/components/IdeaCard";

interface Idea {
  id: number;
  text: string;
  created_at: string;
  score?: number;
  userVote?: 1 | 0 | -1;
  author?: {
    name: string;
    avatar_url?: string | null;
  };
}

interface TopVotedAreaProps {
  ideas: Idea[];
  onVote?: (ideaId: number, value: 1 | 0 | -1) => void | Promise<void>;
}

export default function TopVotedArea({ ideas, onVote }: TopVotedAreaProps) {
  // Calculate the top 3 ideas by score
  const topIdeas = [...ideas]
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
    .slice(0, 3);

  if (topIdeas.length === 0) return null;

  return (
    <div className="lg:col-span-8 space-y-4 flex flex-col h-full">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        Top Voted
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {topIdeas.map((idea) => (
          <IdeaCard
            key={idea.id}
            id={idea.id}
            text={idea.text}
            created_at={idea.created_at}
            score={idea.score}
            author={idea.author}
            tall
            userVote={(idea as any).userVote}
            onVote={onVote}
          />
        ))}
      </div>
    </div>
  );
} 