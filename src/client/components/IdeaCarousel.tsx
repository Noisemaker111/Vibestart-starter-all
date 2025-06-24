import { useEffect, useState } from "react";

interface Props {
  /** List of ideas to cycle through */
  ideas: string[];
  /** How long each idea stays visible (ms). Default 3500 */
  intervalMs?: number;
  /** Callback when an idea is clicked */
  onIdeaClick?: (idea: string) => void;
}

/**
 * IdeaCarousel shows 2 clickable suggestion buttons side by side that cycle through ideas.
 * New ideas appear on the right while left ones fade out. After all ideas cycle, it disappears.
 */
export function IdeaCarousel({ ideas, intervalMs = 3500, onIdeaClick }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex >= ideas.length) return; // finished cycling

    const timer = setTimeout(() => {
      setCurrentIndex((i) => i + 1);
    }, intervalMs);

    return () => clearTimeout(timer);
  }, [currentIndex, intervalMs, ideas.length]);

  if (currentIndex >= ideas.length) return null; // carousel finished

  // Show current and next idea (if available)
  const currentIdea = ideas[currentIndex];
  const nextIdea = ideas[currentIndex + 1];

  return (
    <div className="flex gap-2">
      {/* Current idea (left side) */}
      <button
        onClick={() => onIdeaClick?.(currentIdea)}
        className="text-xs px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded-full text-gray-400 hover:text-white transition-all duration-300"
      >
        {currentIdea}
      </button>
      
      {/* Next idea (right side) - only show if it exists */}
      {nextIdea && (
        <button
          onClick={() => onIdeaClick?.(nextIdea)}
          className="text-xs px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded-full text-gray-400 hover:text-white transition-all duration-300 opacity-70"
        >
          {nextIdea}
        </button>
      )}
    </div>
  );
} 