import { Link, useNavigate } from "react-router";
import React, { useState, useEffect, Suspense } from "react";
import type { Route } from "./+types/home";
import { availablePlatforms } from "@shared/availablePlatforms";
import IntegrationChips from "@client/components/integrations/IntegrationChip";
import IdeaTextBox from "@client/components/IdeaTextBox";
import PlatformChip from "@client/components/PlatformChip";
import type { AvailablePlatform } from "@shared/availablePlatforms";
import { processIdea } from "@client/utils/integrationLLM";
import { DEFAULT_MODEL } from "@client/utils/integrationLLM";
import type { AvailableIntegration } from "@shared/availableIntegrations";
import type { AvailablePlatformKey } from "@shared/availablePlatforms";
import { consumeLocalToken } from "@client/utils/rateLimit";
import { HOME_PLACEHOLDER_ROTATE_MS } from "@shared/constants";
import { usePostHog } from "posthog-js/react";

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
        const result = await processIdea(ideaString, [], DEFAULT_MODEL, "structured");
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

  // Centralized idea change handler for the idea input
  const handleIdeaChange = (value: string) => {
    setIdea(value);
    const trimmed = value.trim();

    // Record the start of a fresh typing session
    if (trimmed.length > 0 && typingStartRef.current === null) {
      typingStartRef.current = Date.now();
      initialAiTriggeredRef.current = false;
    }

    // Show "Analyzing…" placeholder once the user types ≥3 characters
    if (trimmed.length >= 3) {
      setAiLoading(true);
    } else if (trimmed.length === 0) {
      // Reset when input cleared
      setAiLoading(false);
      typingStartRef.current = null;
    }

    if (!ideaStarted && value.trim().length > 0) {
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

  // ---------------------------------------------------------------------------
  // If all integration chips are removed manually, re-run AI once to repopulate.
  // This runs ONLY on the transition from >0 → 0 chips to avoid loops.
  // ---------------------------------------------------------------------------
  const prevActiveCountRef = React.useRef<number>(activeKeys.length);

  React.useEffect(() => {
    const prev = prevActiveCountRef.current;
    if (prev > 0 && activeKeys.length === 0 && idea.trim().length >= 3) {
      runAiGeneration(idea.trim());
    }
    prevActiveCountRef.current = activeKeys.length;
  }, [activeKeys.length, idea, runAiGeneration]);

  return (
    <>
      <main className="min-h-screen bg-gray-50 text-gray-900 overflow-hidden">
        {/* Hero Section - Completely New Design */}
        <section className="relative min-h-screen flex items-center justify-center px-4 pt-8 sm:pt-14 md:pt-14">
          <div className="max-w-6xl mx-auto w-full">
            {/* Consolidated version badge + hero content */}
            <div className="text-center mb-12">
              <VibeStartMainInfo />
            </div>

            {/* Interactive Idea Input */}
            <div className="max-w-3xl mx-auto">
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
                  className="inline-flex items-center justify-center px-8 py-4 font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl shadow-lg hover:from-purple-500 hover:to-indigo-500 transition-all duration-200"
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

// ─────────────────────────────────────────────────────────────
// Local one-off components (inlined from former home/ components)
// ─────────────────────────────────────────────────────────────

function VibeStartMainInfo() {
  return (
    <>
      <h1 className="text-5xl lg:text-7xl font-black mb-6 leading-tight">
        <span className="bg-gradient-to-r from-purple-700 via-blue-700 to-teal-700 bg-clip-text text-transparent">
          Vibe-Ready Tech Stack
        </span>
        <br />
      </h1>

    </>
  );
}

interface IdeaCardProps {
  idea: string;
  placeholder: string;
  onIdeaChange: (value: string) => void;
  onIdeaKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  selectedPlatform?: AvailablePlatform;
  activeKeys: string[];
  loading: boolean;
}

function HomeIdeaCard({
  idea,
  placeholder,
  onIdeaChange,
  onIdeaKeyDown,
  selectedPlatform,
  activeKeys,
  loading,
}: IdeaCardProps) {
  return (
    <div className="relative group">
      <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl p-8 border border-gray-200 shadow-lg">
        {/* Internal glow overlay */}
        <div className="pointer-events-none absolute -inset-1 -z-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
        {/* Top bar – only shows selected platform chip (label removed per design update) */}
        {selectedPlatform && (
          <div className="flex justify-end mb-3">
            <PlatformChip platform={selectedPlatform} className="text-xs sm:text-sm" />
          </div>
        )}
        <div>
          <IdeaTextBox
            value={idea}
            onChange={onIdeaChange}
            onKeyDown={onIdeaKeyDown}
            placeholder={placeholder}
            className="w-full"
          />
        </div>

        {/* Integration list – displays a placeholder chip while analyzing */}
        <div className="mt-4 flex justify-center">
          <IntegrationChips
            activeKeys={activeKeys}
            showAllIfEmpty={false}
            loading={loading}
            rowPattern={[3, 2, 3, 2]}
            chipWidthClass="w-[240px]"
          />
        </div>
      </div>
    </div>
  );
}

interface RealProject {
  name: string;
  description: string;
  time: string;
  revenue: string;
}

function VibeStartOtherInfo({ realProjects }: { realProjects: RealProject[] }) {
  return (
    <>
      {/* Real Projects Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Real Apps. Real Revenue. Real Fast.</h2>
            <p className="text-gray-500">These were all someone's "weekend project" with VibeStart</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {realProjects.map((project, index) => (
              <div key={index} className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl opacity-0 group-hover:opacity-30 blur transition duration-300"></div>
                <div className="relative bg-gray-900 rounded-2xl p-8 border border-gray-800">
                  <h3 className="text-2xl font-bold mb-2">{project.name}</h3>
                  <p className="text-gray-300 mb-4">{project.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">{project.time}</span>
                    <span className="text-green-400 font-semibold">{project.revenue}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Problem Section */}
      <section className="relative py-20 px-4 bg-gradient-to-b from-transparent to-gray-900/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8">Stop Learning. Start Vibing</h2>

          <div className="space-y-6 text-lg text-gray-600 dark:text-gray-300">
            <p>You don't need another JavaScript course. You don't need to master React hooks. You don't need to understand webpack.</p>
            <p className="text-xl text-white font-medium">You need your idea live, getting feedback, making money.</p>
            <p>VibeStart + AI = Your personal senior developer who already knows the entire codebase. Just describe what you want to build.</p>
          </div>

          <div className="mt-12 grid md:grid-cols-2 gap-8 text-left">
            <div className="bg-red-900/10 border border-red-900/30 rounded-xl p-6">
              <h3 className="text-red-400 font-semibold mb-3">Without VibeStart</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li>• 2 weeks setting up auth</li>
                <li>• 1 week configuring database</li>
                <li>• 3 days on file uploads</li>
                <li>• Endless debugging sessions</li>
                <li>• Ship in 2-3 months (maybe)</li>
              </ul>
            </div>
            <div className="bg-green-900/10 border border-green-900/30 rounded-xl p-6">
              <h3 className="text-green-400 font-semibold mb-3">With VibeStart</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li>• Auth works instantly</li>
                <li>• Database ready to go</li>
                <li>• Uploads pre-configured</li>
                <li>• AI writes the boilerplate</li>
                <li>• Ship today, iterate tomorrow</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Ownership & Differentiator Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Own&nbsp;Your&nbsp;Stack—No Black&nbsp;Boxes</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-10">
            Tools like Replit, Vercel&nbsp;v0, Convex or Lovable are fantastic for rapid tinkering—but their databases, auth layers and hosting stay locked behind closed dashboards. VibeStart flips the script by <strong>open-sourcing the entire production starter</strong>—database, auth, uploads, UI and tests—into <em>your</em> GitHub repository from the very first commit.
          </p>

          <div className="grid md:grid-cols-2 gap-8 text-left">
            <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800 shadow-lg">
              <h3 className="text-xl font-semibold mb-3">Traditional AI Builders</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300 text-sm list-disc pl-4">
                <li>Private DB tables you can't export</li>
                <li>Usage-based billing on every message/API call</li>
                <li>No direct access to infra—migration is painful</li>
                <li>Proprietary components &amp; closed-source code</li>
              </ul>
            </div>
            <div className="bg-purple-900/20 rounded-2xl p-8 border border-purple-700 shadow-lg">
              <h3 className="text-xl font-semibold mb-3">VibeStart Approach</h3>
              <ul className="space-y-2 text-purple-200 text-sm list-disc pl-4">
                <li>PostgreSQL schema lives in <code>src/server/db/schema.ts</code></li>
                <li>Supabase auth—bring your own keys, zero vendor lock-in</li>
                <li>All source in a public MIT-licensed repo <em>you</em> control</li>
                <li>Scale anywhere—Vercel, Fly.io, bare metal—no rewrite</li>
              </ul>
            </div>
          </div>

          <p className="text-gray-700 dark:text-gray-400 mt-10 text-sm max-w-3xl mx-auto">
            Build on a stack you fully understand today and can scale tomorrow—without paying per-message fees or reverse-engineering someone else's infrastructure.
          </p>
        </div>
      </section>
    </>
  );
}

function HomeOtherCTA({ buildLink, onClick }: { buildLink: string; onClick?: () => void }) {
  return (
    <section className="relative py-20 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 backdrop-blur-sm rounded-3xl p-12 border border-gray-800">
          <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-100">Your competitors are shipping. Are you?</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">Every day you spend learning is a day someone else is building your idea.</p>
          <Link
            to={buildLink}
            onClick={onClick}
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
          >
            Start Building
          </Link>
        </div>
      </div>
    </section>
  );
}
// ─────────────────────────────────────────────────────────────
// End local component inlines
// ─────────────────────────────────────────────────────────────
