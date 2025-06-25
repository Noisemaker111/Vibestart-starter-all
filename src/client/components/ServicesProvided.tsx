import React from "react";
import { Code2, Server, Database, Shield, Zap, Cloud, Smartphone, Globe } from "lucide-react";

/**
 * ServicesProvided lists every out-of-the-box integration that ships with JonStack
 * so users instantly understand which moving parts are already wired up and ready
 * for AI-driven customisation. Shown on the homepage below the hero section.
 */
export default function ServicesProvided() {
  /*
   * Enhanced service overview using coloured icons & cards. Mirrors the reference
   * "Technology Stack" timeline style while keeping our original category data.
   */
  const techStack = [
    {
      key: "frontend",
      title: "Front-end & UI",
      icon: <Code2 className="w-5 h-5" />,
      color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      technologies: ["React 19", "Tailwind CSS 4", "React Router 7"],
    },
    {
      key: "backend",
      title: "Backend & API",
      icon: <Server className="w-5 h-5" />,
      color: "bg-green-500/20 text-green-400 border-green-500/30",
      technologies: ["Node.js 18", "Vite 6"],
    },
    {
      key: "database",
      title: "Database & Storage",
      icon: <Database className="w-5 h-5" />,
      color: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      technologies: ["PostgreSQL", "Drizzle ORM", "Supabase"],
    },
    {
      key: "auth",
      title: "Authentication & Security",
      icon: <Shield className="w-5 h-5" />,
      color: "bg-red-500/20 text-red-400 border-red-500/30",
      technologies: ["Supabase Auth", "OAuth (Google, GitHub)", "Zod validation"],
    },
    {
      key: "ai",
      title: "AI & Machine Learning",
      icon: <Zap className="w-5 h-5" />,
      color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      technologies: ["OpenAI GPT-4 API", "T3Chat (roadmap)"] ,
    },
    {
      key: "devops",
      title: "DevOps & Deployment",
      icon: <Cloud className="w-5 h-5" />,
      color: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
      technologies: ["Vercel", "GitHub Actions"],
    },
    {
      key: "mobile",
      title: "Mobile & Cross-Platform",
      icon: <Smartphone className="w-5 h-5" />,
      color: "bg-pink-500/20 text-pink-400 border-pink-500/30",
      technologies: ["React Native (roadmap)"] ,
    },
    {
      key: "integrations",
      title: "Integrations & Services",
      icon: <Globe className="w-5 h-5" />,
      color: "bg-orange-500/20 text-orange-400 border-orange-500/30",
      technologies: ["Stripe", "UploadThing"],
    },
  ];

  return (
    <section className="relative py-20 px-4 bg-gradient-to-b from-gray-900/0 via-gray-900/10 to-gray-900/20">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold text-white">
            Production-Ready Stack
          </h2>
          {/* Primary language logo */}
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
           Everything you need to build modern, scalable applications—already wired-up. One language. Everything runs on&nbsp;
            <span className="inline-flex items-center gap-1 align-baseline">
              <span className="text-white font-medium">TypeScript</span>
              <img
                src="https://jm6qi1k67z.ufs.sh/f/xjiCC72FKQkxHAGHxoL1E21nUvL8WDXqxyCl4QguTVKRPAsJ"
                alt="TypeScript logo"
                className="w-6 h-6 inline-block"
              />
            </span>
            —from database to UI.
          </p>
        </div>

        {/* Timeline / Card layout */}
        <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
          {techStack.map((category) => (
            <div
              key={category.key}
              className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 backdrop-blur-sm shadow-lg"
            >
              {/* Header */}
              <div className="flex items-center gap-4 mb-4">
                <div
                  className={`flex items-center justify-center p-3 rounded-lg shrink-0 ${category.color}`}
                >
                  {category.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    {category.title}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {category.technologies.join(", ")}
                  </p>
                </div>
              </div>

              {/* Content intentionally removed to avoid duplication */}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 