import React, { useState } from "react";
import type { Route } from "./+types/page";
import TestIntegrationsModal from "@pages/home/components/TestIntegrationsModal";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Vibestack Starter" },
    { name: "description", content: "Vibestack starter demo with integration tests" },
  ];
}

export default function HomePage() {
  const [open, setOpen] = useState(false);

  const docsUrl = "https://vibestart.dev/";

  return (
    <main className="min-h-screen pt-16 container mx-auto px-4 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-4 text-center">Vibestack Starter</h1>
      <h2 className="text-lg mb-6 text-center">Click this button to test the integrations</h2>

      <div className="flex items-center gap-1 mb-10">
        <button
          onClick={() => setOpen(true)}
          className="btn-primary px-6 py-3 text-base"
        >
          Open Test Modal
        </button>
        <a
          href={docsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-purple-600 hover:underline whitespace-nowrap"
        >
          Docs ↗
        </a>
      </div>

      {/* Modal */}
      <TestIntegrationsModal open={open} onClose={() => setOpen(false)} />
    </main>
  );
} 