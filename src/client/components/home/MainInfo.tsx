import React from "react";

export default function VibeStartMainInfo() {
  return (
    <>
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
        VibeStart is a standardized, all-in-one starter for AI IDEs. Launch production-ready apps—web, mobile, desktop or games—without drowning in expert-only docs. Auth, database, uploads and tests come pre-wired so you can focus on ideas, not integrations.
      </p>
    </>
  );
} 