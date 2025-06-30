import { Link, useNavigate } from "react-router";
import React, { useState, useEffect, Suspense } from "react";
import type { Route } from "./+types/home";
import { availablePlatforms } from "@shared/availablePlatforms";
import VersionTag from "@client/components/home/VersionTag";
import VibeStartMainInfo from "@client/components/home/MainInfo";
import HomeIdeaCard from "@client/components/home/IdeaCard";
import { processIdea } from "@client/utils/integrationLLM";
import type { AvailableIntegration } from "@shared/availableIntegrations";
import type { AvailablePlatformKey } from "@shared/availablePlatforms";
import { consumeLocalToken } from "@client/utils/rateLimit";
import Badge from "@client/components/Badge";
import { HOME_PLACEHOLDER_ROTATE_MS } from "@shared/constants";
import { usePostHog } from "posthog-js/react";

// Lazily load below-the-fold sections to reduce JS parsed before LCP
const VibeStartOtherInfo = React.lazy(() => import("@client/components/home/OtherInfo"));
const HomeOtherCTA = React.lazy(() => import("@client/components/home/OtherCTA"));

// Delay loading the large appIdeas dataset until after initial render to improve LCP
type AppIdea = typeof import("@shared/appIdeas").default[number];

export function meta({}: Route.MetaArgs) {
  return [
    { title: "VibeStart - Where Ideas Become Apps in Minutes" },
    { name: "description", content: "Skip the learning curve. Talk to your code. Ship real products with VibeStart." },
  ];
}

export default function Home() {
  const [idea, setIdea] = useState("");
  const [target, setTarget] = useState<AvailablePlatformKey>("web");
  const [activeKeys, setActiveKeys] = useState<string[]>([]);
  const [appIdeas, setAppIdeas] = useState<AppIdea[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const navigate = useNavigate();
  const posthog = usePostHog();
  const [ideaStarted, setIdeaStarted] = useState(false);
  // Timestamp (ms) when the current typing session started – resets when input is cleared
  const typingStartRef = React.useRef<number | null>(null);
  // Indicates whether we've already fired the "mid-typing" AI request for the current session
  const initialAiTriggeredRef = React.useRef(false);

  const realProjects = [
    {
      name: "TaskFlow",
      description: "Project management SaaS",
      time: "Built in 3 days",
      revenue: "$2.4k MRR"
    },
    {
      name: "CodeSnip",
      description: "Developer snippet tool",
      time: "Weekend project",
      revenue: "500+ users"
    },
    {
      name: "FormPro",
      description: "Advanced form builder",
      time: "Built in 5 days",
      revenue: "$800 MRR"
    }
  ];

  // Replace old arrays with shared list
  const carouselIdeas = appIdeas; // AppIdea[]

  // State to rotate placeholder suggestions at a configurable interval
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setPlaceholderIndex((idx) => {
        if (carouselIdeas.length <= 1) return idx;
        let next = idx;
        // Pick a random index different from current
        while (next === idx) {
          next = Math.floor(Math.random() * carouselIdeas.length);
        }
        return next;
      });
    }, HOME_PLACEHOLDER_ROTATE_MS);
    return () => clearInterval(timer);
  }, [carouselIdeas.length]);

  const currentPlaceholder = carouselIdeas[placeholderIndex]?.idea || "Describe your app idea…";

  // Update displayed integrations & platform when the placeholder rotates and user hasn't started typing
  useEffect(() => {
    if (idea.trim().length === 0) {
      const entry = carouselIdeas[placeholderIndex];
      if (entry) {
        setActiveKeys(entry.integrations);
        setTarget(entry.platform);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [placeholderIndex]);

  // Currently selected platform details
  const selectedPlatform = React.useMemo(() => {
    return availablePlatforms.find((p) => p.key === target);
  }, [target]);

  // ─────────────────────────────────────────────────────────────
  // Throttled AI generation queue (max 1 queued job, 2 s spacing)
  // ─────────────────────────────────────────────────────────────

  const lastAiCallRef = React.useRef(0); // timestamp ms
  const queuedIdeaRef = React.useRef<string | null>(null);

  // Helper to run OpenRouter call respecting local token bucket
  const runAiGeneration = React.useCallback(
    async (ideaString: string) => {
      // Guard: ensure at least 2 s since last invocation
      const since = Date.now() - lastAiCallRef.current;
      if (since < 2000) {
        queuedIdeaRef.current = ideaString; // queue latest request (queue size 1)
        return;
      }

      // Check token bucket (40 capacity, regen 1/2 min, 20/min burst)
      if (!consumeLocalToken("aiTagGen", 40, 2 * 60 * 1000, 20)) return;

      lastAiCallRef.current = Date.now();
      setAiLoading(true);
      try {
        const result = await processIdea(ideaString);
        setActiveKeys(result.integrations.map((i: AvailableIntegration) => i.key));

        // Automatically update selected platform if the AI suggests one and it's valid
        if (result.platform && availablePlatforms.some((p) => p.key === result.platform)) {
          setTarget(result.platform as AvailablePlatformKey);
        }
        if (result.error) {
          setAiError(result.error);
          posthog.capture("ai_error", { message: result.error });
        } else {
          setAiError(null);
        }
      } catch (err) {
        console.error("AI integration selection failed", err);
        const msg = (err as Error)?.message || String(err);
        setAiError(msg);
        posthog.capture("ai_error", { message: msg });
      } finally {
        setAiLoading(false);
      }

      // After finishing, check if something was queued during processing
      const remaining = 2000 - (Date.now() - lastAiCallRef.current);
      const delay = Math.max(0, remaining);
      if (queuedIdeaRef.current) {
        const nextIdea = queuedIdeaRef.current;
        queuedIdeaRef.current = null; // clear queue slot
        setTimeout(() => runAiGeneration(nextIdea), delay);
      }
    },
    [posthog]
  );

  // Debounced AI trigger – waits for user to stop typing for 800 ms
  useEffect(() => {
    const trimmed = idea.trim();
    if (trimmed.length < 3) return; // need minimum input length

    const handle = setTimeout(() => {
      runAiGeneration(trimmed);
    }, 800); // fire 0.8 s after last keystroke

    return () => clearTimeout(handle);
  }, [idea, runAiGeneration]);

  // Centralized idea change handler for the textarea input
  const handleIdeaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setIdea(e.target.value);
    const trimmed = e.target.value.trim();

    // Record the start of a fresh typing session
    if (trimmed.length > 0 && typingStartRef.current === null) {
      typingStartRef.current = Date.now();
      initialAiTriggeredRef.current = false;
    }

    // Show "Analyzing…" placeholder as soon as the user types ≥3 characters
    if (trimmed.length >= 3) {
      setAiLoading(true);
    } else if (trimmed.length === 0) {
      // Reset when input cleared
      setAiLoading(false);
      typingStartRef.current = null;
    }

    if (!ideaStarted && e.target.value.trim().length > 0) {
      posthog.capture("idea_input_started");
      setIdeaStarted(true);
    }
  };

  function handleIdeaKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (idea.trim()) {
        posthog.capture("idea_submitted");
        navigate(buildLink);
      }
    }
  }

  useEffect(() => {
    const thresholds = [25, 50, 75, 90];
    const fired = new Set<number>();

    function onScroll() {
      const scrollTop = window.scrollY + window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      const percent = (scrollTop / docHeight) * 100;
      thresholds.forEach((t) => {
        if (percent >= t && !fired.has(t)) {
          posthog.capture("home_scroll_depth", { percentage: t });
          fired.add(t);
        }
      });
    }

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [posthog]);

  // Reusable build link for CTAs
  const buildLink = `/docs?section=build-idea&platform=${encodeURIComponent(target)}&integrations=${encodeURIComponent(activeKeys.join(","))}${idea.trim() ? `&idea=${encodeURIComponent(idea.trim())}` : ""}`;

  /*
   * Fire an early AI request 2 s after the user first starts typing, even if they
   * are still typing. This helps surface intermediate results so the UI doesn't
   * feel stuck when users keep typing continuously.
   */
  useEffect(() => {
    const trimmed = idea.trim();
    if (trimmed.length < 3) return; // not enough signal yet

    // If we haven't registered a typing start, bail (shouldn't happen)
    if (typingStartRef.current === null) return;

    // If the early call has already been triggered for this session, nothing to do
    if (initialAiTriggeredRef.current) return;

    const elapsed = Date.now() - typingStartRef.current;
    const remaining = 2000 - elapsed;

    if (remaining <= 0) {
      // We're already ≥2 s into typing – run immediately
      runAiGeneration(trimmed);
      initialAiTriggeredRef.current = true;
      return;
    }

    const timer = setTimeout(() => {
      runAiGeneration(trimmed);
      initialAiTriggeredRef.current = true;
    }, remaining);

    return () => clearTimeout(timer);
  }, [idea, runAiGeneration]);

  // Load appIdeas lazily after first render to keep initial JS bundle small
  useEffect(() => {
    import("@shared/appIdeas").then((mod) => {
      setAppIdeas(mod.default as unknown as AppIdea[]);
      // If no user input yet, seed initial platform/key state from first idea
      if (mod.default.length > 0 && idea.trim().length === 0) {
        setTarget(mod.default[0].platform as AvailablePlatformKey);
        setActiveKeys(mod.default[0].integrations);
      }
    });
  }, []);

  return (
    <>
      <main className="min-h-screen bg-black text-white overflow-hidden">
        {/* Animated Background */}
        <div className="fixed inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-blue-600/20 to-teal-600/20"></div>
        </div>

        {/* Hero Section - Completely New Design */}
        <section className="relative min-h-screen flex items-center justify-center px-4 pt-8 sm:pt-14 md:pt-14">
          <div className="max-w-6xl mx-auto w-full">
            {/* Consolidated version badge + hero content */}
            <div className="text-center mb-12">
              <VersionTag />
              <VibeStartMainInfo />
            </div>

            {/* Interactive Idea Input */}
            <div className="max-w-3xl mx-auto">
              {/* VibeStart CLI command badge */}
              <div
                className="relative flex items-center gap-2 px-4 py-2 mb-6 mx-auto rounded-md bg-gray-950/90 border border-gray-700 text-gray-100 text-sm sm:text-base whitespace-nowrap shadow-sm opacity-90 w-max"
                aria-label="vibestartcommand coming soon"
              >
                <code className="select-none font-mono">npx create-vibestart</code>
                <Badge label="soon" />
              </div>
              <HomeIdeaCard
                idea={idea}
                placeholder={currentPlaceholder}
                onIdeaChange={handleIdeaChange}
                onIdeaKeyDown={handleIdeaKeyDown}
                selectedPlatform={selectedPlatform}
                activeKeys={activeKeys}
                loading={aiLoading}
              />

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <Link
                  to={buildLink}
                  onClick={() => posthog.capture("home_get_building_click")}
                  className="inline-flex items-center justify-center px-8 py-4 font-bold text-black bg-white rounded-xl hover:bg-gray-100 transition-all duration-200"
                >
                  Start Building
                </Link>

                {/* Docs button – minimal styling so only text is visible */}
                <Link
                  to={buildLink}
                  onClick={() => posthog.capture("home_docs_click")}
                  className="inline-flex items-center justify-center px-8 py-4 font-semibold text-purple-500 drop-shadow-sm hover:text-purple-400 transition-colors duration-200"
                >
                  Docs
                </Link>
              </div>
            </div>


            {/* Other info sections consolidated */}
            <Suspense fallback={<div>Loading...</div>}>
              <VibeStartOtherInfo realProjects={realProjects} />
            </Suspense>

            {/* Final CTA */}
            <Suspense fallback={<div>Loading...</div>}>
              <HomeOtherCTA buildLink={buildLink} onClick={() => posthog.capture("home_get_building_click")} />
            </Suspense>

          </div>
        </section>

      </main>

      {/* Project name modal removed */}
    </>
  );
} 