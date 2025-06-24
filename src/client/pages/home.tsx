import { Link, useNavigate } from "react-router";
import { useState } from "react";
import type { Route } from "./+types/home";
import { createPortal } from "react-dom";

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
  const [target, setTarget] = useState<"web" | "app" | "desktop" | "game">("web");

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

  const ideaExamples = [
    "A tool that syncs Notion with GitHub issues",
    "An AI writing assistant for technical docs",
    "A marketplace for indie game assets",
    "A habit tracker that gamifies productivity",
    "A platform for async video interviews"
  ];

  function handleIdeaKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (idea.trim()) {
        setShowNameModal(true);
      }
    }
  }

  /* Helper to determine if a target option should be disabled based on OS */
  function isTargetDisabled(t: "web" | "app" | "desktop" | "game", currentOs: "windows" | "mac" | "linux") {
    // Currently only web target is available universally; others marked soon
    if (t !== "web") {
      return true;
    }
    // Feature roadmap: allow others later
    return false;
  }

  return (
    <>
      <main className="min-h-screen bg-black text-white overflow-hidden">
        {/* Animated Background */}
        <div className="fixed inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-blue-600/20 to-teal-600/20"></div>
        </div>

        {/* Hero Section - Completely New Design */}
        <section className="relative min-h-screen flex items-center justify-center px-4">
          <div className="max-w-6xl mx-auto w-full">
            <div className="text-center mb-12">
              {/* Floating Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/30 text-green-400 rounded-full text-sm mb-8 backdrop-blur-sm">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                156 projects shipped this week
              </div>

              {/* Main Headline */}
              <h1 className="text-6xl lg:text-8xl font-black mb-6 leading-tight">
                <span className="bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                  Production-ready starter kit
                </span>
                <br />
                <span className="text-3xl lg:text-5xl text-gray-400 font-light">
                  Stop configuring. Start building.
                </span>
              </h1>

              <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12">
                Skip the four-year grind of mastering HTML, CSS and JavaScript just to see your idea on-screen—JonStack ships auth, database, uploads and a gorgeous UI already wired up so you can jump straight to prototyping.
              </p>
            </div>

            {/* Interactive Idea Input */}
            <div className="max-w-3xl mx-auto mb-16">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
                <div className="relative bg-gray-900/90 backdrop-blur-xl rounded-2xl p-8 border border-gray-800">
                  <label className="block text-sm font-medium text-gray-400 mb-3">
                    What are you building?
                  </label>
                  <textarea
                    value={idea}
                    onChange={(e) => {
                      setIdea(e.target.value);
                    }}
                    onKeyDown={handleIdeaKeyDown}
                    placeholder="Describe your app idea..."
                    className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-all duration-300 resize-none"
                    rows={3}
                  />
                  
                  {/* Idea Suggestions */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="text-xs text-gray-500">Try:</span>
                    {ideaExamples.slice(0, 3).map((example, i) => (
                      <button
                        key={i}
                        onClick={() => setIdea(example)}
                        className="text-xs px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded-full text-gray-400 hover:text-white transition-all duration-200"
                      >
                        {example}
                      </button>
                    ))}
                  </div>

                  {/* Dynamic Response */}
                  {idea && (
                    <div className="mt-6 p-4 bg-purple-900/20 border border-purple-500/30 rounded-lg animate-in fade-in duration-300">
                      <p className="text-sm text-purple-300">
                        Perfect! With JonStack, you'll have {idea.toLowerCase()} running in under 10 minutes.
                        Everything you need is already set up.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* OS & Target selectors */}
              <div className="mt-8 flex flex-col sm:flex-row gap-6 justify-center">
                {/* OS Selector */}
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-400">OS:</span>
                  {([
                    { id: "windows", label: "Windows" },
                    { id: "mac", label: "macOS" },
                    { id: "linux", label: "Linux" },
                  ] as const).map(({ id, label }) => (
                    <button
                      key={id}
                      onClick={() => setOs(id)}
                      className={`px-4 py-1 rounded-full text-sm font-medium transition-colors ${
                        os === id
                          ? "bg-blue-600 text-white"
                          : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                {/* Target Selector */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4 sm:mt-0 items-start sm:items-center">
                  <span className="text-sm text-gray-400">Target:</span>
                  <div className="flex items-center gap-2">
                    {([
                      { id: "web", label: "Web" },
                      { id: "app", label: "Mobile" },
                      { id: "desktop", label: "Desktop" },
                      { id: "game", label: "Game" },
                    ] as const).map(({ id, label }) => {
                      const disabled = isTargetDisabled(id, os);
                      const selected = target === id;
                      return (
                        <div key={id} className="relative">
                          <button
                            onClick={() => !disabled && setTarget(id)}
                            disabled={disabled}
                            className={`px-4 py-1 rounded-full text-sm font-medium transition-colors ${
                              selected ? "bg-purple-600 text-white" : "bg-gray-800 text-gray-400"}
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
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <a
                  href="https://github.com/Noisemaker111/jonstack"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-black bg-white rounded-xl hover:bg-gray-100 transition-all duration-200"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Let's Go Build
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </a>
                <Link
                  to="/docs"
                  className="inline-flex items-center justify-center px-8 py-4 font-semibold text-white border border-gray-700 rounded-xl hover:bg-white/5 transition-all duration-200"
                >
                  See How It Works
                </Link>
              </div>
            </div>

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
                  <a
                    href="https://github.com/Noisemaker111/jonstack"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
                  >
                    Get JonStack Free
                    <span className="text-sm opacity-75">(MIT License)</span>
                  </a>
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