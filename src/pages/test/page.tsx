import React from "react";
import type { Route } from "./+types/page";
import TestIntegrations from "@pages/test/components";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Test Integrations - VibeStart" },
    { name: "description", content: "Integration tests for VibeStart" },
  ];
}

export default function TestIntegrationsPage() {
  return (
    <main className="min-h-screen pt-16 container mx-auto px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Here are the tests</h1>
        <h1 className="text-3xl font-bold">Here are the tests</h1>
      </div>
      <TestIntegrations />
    </main>
  );
} 