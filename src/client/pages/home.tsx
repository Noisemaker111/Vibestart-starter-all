import { Link, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import type { Route } from "./+types/home";
import { createPortal } from "react-dom";
import ServicesProvided from "@client/components/ServicesProvided";
import appIdeas, { type Platform } from "../../shared/appIdeas";
import IntegrationChips from "@client/components/IntegrationChips";
import CreateJonstackCli from "@client/components/CreateJonstackCli";
import { processIdea } from "@client/utils/integrationTool";
import type { Integration } from "@client/utils/types";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "JonStack - Where Ideas Become Apps in Minutes" },
    { name: "description", content: "Skip the learning curve. Talk to your code. Ship real products." },
  ];
}

export default function Home() {
  const [idea, setIdea] = useState("");
  const [showNameModal, setShowNameModal] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [os, setOs] = useState<"windows" | "mac" | "linux">("windows");
  const platformToTarget = (p: Platform): "web" | "app" | "desktop" | "game" =>
    p === "mobile" ? "app" : p;

  const [target, setTarget] = useState<"web" | "app" | "desktop" | "game">(
    platformToTarget(appIdeas[0].platform)
  );
  const [activeKeys, setActiveKeys] = useState<string[]>(appIdeas[0].integrations);
  const [specification, setSpecification] = useState<string>("");
  const [aiLoading, setAiLoading] = useState(false);
  const [lastCall, setLastCall] = useState(0);

  const navigate = useNavigate();

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

  // State to rotate placeholder suggestions every 4 seconds
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setPlaceholderIndex((idx) => (idx + 1) % carouselIdeas.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [carouselIdeas.length]);

  const currentPlaceholder = carouselIdeas[placeholderIndex]?.idea || "Describe your app idea…";

  // Update displayed integrations & platform when the placeholder rotates and user hasn't started typing
  useEffect(() => {
    if (idea.trim().length === 0) {
      const entry = carouselIdeas[placeholderIndex];
      setActiveKeys(entry.integrations);
      setTarget(platformToTarget(entry.platform));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [placeholderIndex]);

  const platformKeywords: Record<"app"|"desktop"|"game", RegExp[]> = {
    app: [/\bmobile\b/i, /\biphone\b/i, /\bandroid\b/i, /\bapp\b/i],
    desktop: [/\bdesktop\b/i, /\belectron\b/i, /\bwindows\b/i, /\bmac app\b/i, /\bmacos\b/i, /\blinux\b/i],
    game: [/\bgame\b/i, /\bgaming\b/i, /\bvr\b/i, /\bunity\b/i, /\bunreal\b/i],
  };

  function detectPlatform(ideaText: string): "web" | "app" | "desktop" | "game" {
    if (!ideaText) return "web";
    const text = ideaText.toLowerCase();
    if (platformKeywords.game.some((r) => r.test(text))) return "game";
    if (platformKeywords.app.some((r) => r.test(text))) return "app";
    if (platformKeywords.desktop.some((r) => r.test(text))) return "desktop";
    return "web";
  }

  useEffect(() => {
    // Auto-detect platform
    const detected = detectPlatform(idea.trim());
    setTarget(detected);

    // Debounced AI call when idea length >=3
    if (idea.trim().length < 3) {
      setActiveKeys([]);
      setSpecification("");
      return;
    }

    const debounce = setTimeout(async () => {
      const now = Date.now();
      if (now - lastCall < 1000) return; // simple 1-second rate limit
      try {
        setAiLoading(true);
        const result = await processIdea(idea.trim());
        setSpecification(result.specification);
        setActiveKeys(result.integrations.map((i: Integration) => i.key));
        setLastCall(Date.now());
      } catch (err) {
        console.error("AI integration selection failed", err);
      } finally {
        setAiLoading(false);
      }
    }, 700); // 700 ms debounce

    return () => clearTimeout(debounce);
  }, [idea]);

  /* Helper to determine if a target option should be disabled based on OS */
  function isTargetDisabled(t: "web" | "app" | "desktop" | "game", currentOs: "windows" | "mac" | "linux") {
    // Currently only web target is available universally; others marked soon
    if (t !== "web") {
      return true;
    }
    // Feature roadmap: allow others later
    return false;
  }

  function handleIdeaKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (idea.trim()) {
        setShowNameModal(true);
      }
    }
  }

  return (
    <>
      <main className="min-h-screen bg-black text-white overflow-hidden">
        {/* Animated Background */}
        <div className="fixed inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-blue-600/20 to-teal-600/20"></div>
        </div>

        {/* Hero Section - Completely New Design */}
        <section className="relative min-h-screen flex items-center justify-center px-4 pt-8 sm:pt-14 md:pt-14 lg:pt-28">
          <div className="max-w-6xl mx-auto w-full">
            <div className="text-center mb-12">
              {/* Main Headline */}
              <h1 className="text-6xl lg:text-8xl font-black mb-6 leading-tight">
                <span className="bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                  Vibe-Ready Tech Stack
                </span>
                <br />
                <span className="text-3xl lg:text-5xl text-gray-400 font-light">
                  Start building in minutes.
                </span>
              </h1>

              <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-12">
                JonStack is a standardized, all-in-one stack for AI IDEs. Launch production-ready apps—web, mobile, desktop or games—without drowning in expert-only docs. Auth, database, uploads and tests come pre-wired so you can focus on ideas, not integrations.
              </p>
            </div>

            {/* Interactive Idea Input */}
            <div className="max-w-3xl mx-auto mb-16">
              <div className="relative group">
                {/* CLI snippet positioned left of card (desktop) */}
                <CreateJonstackCli className="hidden lg:flex absolute -left-56 top-1/2 -translate-y-1/2" />

                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
                <div className="relative bg-gray-900/90 backdrop-blur-xl rounded-2xl p-8 border border-gray-800">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                    <label className="text-lg sm:text-xl font-semibold text-gray-300">
                      Describe your app idea
                    </label>
                    <div className="flex items-center gap-2">
                      {([
                        { id: "web", label: "🌐 Web" },
                        { id: "app", label: "📱 Mobile" },
                        { id: "desktop", label: "🖥️ Desktop" },
                        { id: "game", label: "🎮 Game" },
                      ] as const)
                        .filter(({ id }) => id === target)
                        .map(({ id, label }) => {
                          const disabled = isTargetDisabled(id, os);
                          const selected = target === id;
                          return (
                            <div key={id} className="relative">
                              <button
                                onClick={() => !disabled && setTarget(id)}
                                disabled={disabled}
                                className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                                  selected ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg" : "bg-gray-800 text-gray-400"}
                                  ${disabled ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-700"}`}
                              >
                                {label}
                              </button>
                              {disabled && (
                                <span className="absolute -top-1 -right-1 bg-gray-700 text-gray-200 text-[10px] px-1 rounded-md select-none">
                                  soon
                                </span>
                              )}
                            </div>
                          );
                        })}
                    </div>
                  </div>
                  <div>
                    <textarea
                      value={idea}
                      onChange={(e) => {
                        setIdea(e.target.value);
                      }}
                      onKeyDown={handleIdeaKeyDown}
                      placeholder={currentPlaceholder}
                      className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-all duration-300 resize-none"
                      rows={3}
                    >
                    </textarea>
                  </div>

                  {/* Integration list */}
                  <IntegrationChips className="mt-4" activeKeys={activeKeys} />

                  {/* Optional spec output */}
                  {specification && (
                    <p className="mt-3 text-xs text-gray-400">{specification}</p>
                  )}

                  {/* Idea suggestions now rotate as placeholder text */}
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <Link
                  to="/docs"
                  className="inline-flex items-center justify-center px-8 py-4 font-bold text-black bg-white rounded-xl hover:bg-gray-100 transition-all duration-200"
                >
                  Get Building
                </Link>
              </div>
            </div>

            {/* Services Provided Section */}
            <ServicesProvided />

            {/* Real Projects Section */}
            <section className="relative py-20 px-4">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold mb-4">
                    Real Apps. Real Revenue. Real Fast.
                  </h2>
                  <p className="text-gray-400">
                    These were all someone's "weekend project" with JonStack
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                  {realProjects.map((project, index) => (
                    <div
                      key={index}
                      className="relative group"
                    >
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl opacity-0 group-hover:opacity-30 blur transition duration-300"></div>
                      <div className="relative bg-gray-900 rounded-2xl p-8 border border-gray-800">
                        <h3 className="text-2xl font-bold mb-2">{project.name}</h3>
                        <p className="text-gray-400 mb-4">{project.description}</p>
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
                <h2 className="text-4xl font-bold mb-8">
                  Stop Learning. Start Shipping.
                </h2>
                
                <div className="space-y-6 text-lg text-gray-400">
                  <p>
                    You don't need another JavaScript course. You don't need to master 
                    React hooks. You don't need to understand webpack.
                  </p>
                  <p className="text-xl text-white font-medium">
                    You need your idea live, getting feedback, making money.
                  </p>
                  <p>
                    JonStack + AI = Your personal senior developer who already knows 
                    the entire codebase. Just describe what you want to build.
                  </p>
                </div>

                <div className="mt-12 grid md:grid-cols-2 gap-8 text-left">
                  <div className="bg-red-900/10 border border-red-900/30 rounded-xl p-6">
                    <h3 className="text-red-400 font-semibold mb-3">Without JonStack</h3>
                    <ul className="space-y-2 text-gray-400">
                      <li>• 2 weeks setting up auth</li>
                      <li>• 1 week configuring database</li>
                      <li>• 3 days on file uploads</li>
                      <li>• Endless debugging sessions</li>
                      <li>• Ship in 2-3 months (maybe)</li>
                    </ul>
                  </div>
                  <div className="bg-green-900/10 border border-green-900/30 rounded-xl p-6">
                    <h3 className="text-green-400 font-semibold mb-3">With JonStack</h3>
                    <ul className="space-y-2 text-gray-400">
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
                <p className="text-gray-400 max-w-3xl mx-auto mb-10">
                  Tools like Replit, Vercel&nbsp;v0, Convex or Lovable are fantastic for rapid tinkering—but their
                  databases, auth layers and hosting stay locked behind closed dashboards.
                  JonStack flips the script by <strong>open-sourcing the entire production stack</strong>—database,
                  auth, uploads, UI and tests—into <em>your</em> GitHub repository from the very first commit.
                </p>

                <div className="grid md:grid-cols-2 gap-8 text-left">
                  <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800 shadow-lg">
                    <h3 className="text-xl font-semibold mb-3">Traditional AI Builders</h3>
                    <ul className="space-y-2 text-gray-400 text-sm list-disc pl-4">
                      <li>Private DB tables you can't export</li>
                      <li>Usage-based billing on every message/API call</li>
                      <li>No direct access to infra—migration is painful</li>
                      <li>Proprietary components &amp; closed-source code</li>
                    </ul>
                  </div>
                  <div className="bg-purple-900/20 rounded-2xl p-8 border border-purple-700 shadow-lg">
                    <h3 className="text-xl font-semibold mb-3">JonStack Approach</h3>
                    <ul className="space-y-2 text-purple-200 text-sm list-disc pl-4">
                      <li>PostgreSQL schema lives in <code>src/server/db/schema.ts</code></li>
                      <li>Supabase auth—bring your own keys, zero vendor lock-in</li>
                      <li>All source in a public MIT-licensed repo <em>you</em> control</li>
                      <li>Scale anywhere—Vercel, Fly.io, bare metal—no rewrite</li>
                    </ul>
                  </div>
                </div>

                <p className="text-gray-500 mt-10 text-sm max-w-3xl mx-auto">
                  Build on a stack you fully understand today and can scale tomorrow—without paying per-message fees or
                  reverse-engineering someone else's infrastructure.
                </p>
              </div>
            </section>

            {/* Simple CTA */}
            <section className="relative py-20 px-4">
              <div className="max-w-3xl mx-auto text-center">
                <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 backdrop-blur-sm rounded-3xl p-12 border border-gray-800">
                  <h2 className="text-3xl font-bold mb-4">
                    Your competitors are shipping. Are you?
                  </h2>
                  <p className="text-gray-400 mb-8">
                    Every day you spend learning is a day someone else is building your idea.
                  </p>
                  <Link
                    to="/docs"
                    className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
                  >
                    Get JonStack
                  </Link>
                </div>
              </div>
            </section>

          </div>
        </section>

      </main>

      {/* Project Name Modal */}
      {showNameModal &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg w-full max-w-sm p-6 relative">
              <button
                onClick={() => setShowNameModal(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-900 dark:hover:text-white"
                aria-label="Close"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <h3 className="text-xl font-semibold mb-4 text-center text-gray-900 dark:text-white">
                Name your project
              </h3>

              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="e.g. BudgetBuddy"
                className="input mb-4"
              />

              <button
                onClick={() => {
                  if (!projectName.trim()) return;
                  navigate(
                    `/docs?idea=${encodeURIComponent(idea.trim())}&project=${encodeURIComponent(
                      projectName.trim()
                    )}&os=${os}&target=${target}#mega-prompt`
                  );
                  setShowNameModal(false);
                }}
                className="btn-primary w-full"
              >
                Continue
              </button>
            </div>
          </div>,
          document.body
        )}
    </>
  );
} 