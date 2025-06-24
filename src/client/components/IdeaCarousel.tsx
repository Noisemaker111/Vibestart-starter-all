import { useEffect, useState, useRef } from "react";

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
  const [fadeOut, setFadeOut] = useState(false);
  const fadeMs = 400; // duration of fade animation

  // Keep reference to latest props to avoid stale closures inside timeouts
  const ideasRef = useRef(ideas);
  useEffect(() => {
    ideasRef.current = ideas;
  }, [ideas]);

  useEffect(() => {
    const cycleTimer = setTimeout(() => {
      // Start fade-out
      setFadeOut(true);

      // After fade duration, switch idea & fade back in
      const switchTimer = setTimeout(() => {
        setCurrentIndex((idx) => (idx + 1) % ideasRef.current.length);
        setFadeOut(false);
      }, fadeMs);

      return () => clearTimeout(switchTimer);
    }, intervalMs);

    return () => clearTimeout(cycleTimer);
  }, [currentIndex, intervalMs]);

  if (currentIndex >= ideas.length) return null; // carousel finished

  const currentIdea = ideas[currentIndex];

  return (
    <button
      onClick={() => onIdeaClick?.(currentIdea)}
      className={`text-sm px-4 py-2 bg-gray-800/80 hover:bg-purple-700 text-white rounded-lg border border-gray-600 transition-all duration-300 cursor-pointer ${fadeOut ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
      title="Click to use this idea"
    >
      {currentIdea}
    </button>
  );
} 