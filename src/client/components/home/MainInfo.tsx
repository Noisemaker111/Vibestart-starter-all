import React from "react";

export default function VibeStartMainInfo() {
  return (
    <>
      <h1 className="text-5xl lg:text-7xl font-black mb-6 leading-tight">
        <span className="bg-gradient-to-r from-purple-700 via-blue-700 to-teal-700 bg-clip-text text-transparent">
          Vibe-Ready Tech Stack
        </span>
        <br />
        <span className="text-2xl lg:text-4xl text-gray-700 dark:text-gray-300 font-light">
          Start your idea in minutes.
        </span>
      </h1>

      <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
        VibeStart is a standardized, all-in-one starter for AI IDEs. Launch production-ready apps—web, mobile, desktop or games—without drowning in expert-only docs. Auth, database, uploads and tests come pre-wired so you can focus on ideas, not integrations.
      </p>
    </>
  );
} 