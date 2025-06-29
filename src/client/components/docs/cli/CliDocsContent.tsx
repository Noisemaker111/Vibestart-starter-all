import React from "react";

const flags: { flag: string; desc: string }[] = [
  { flag: "-web", desc: "Add React + Vite SSR web app." },
  { flag: "-database", desc: "Include Supabase Postgres and Drizzle ORM." },
  { flag: "-uploads", desc: "Enable UploadThing file uploads." },
  { flag: "-llm", desc: "Add OpenRouter AI utilities." },
  { flag: "-billing", desc: "Stripe billing integration." },
  { flag: "-realtime", desc: "Enable realtime messages via Supabase Realtime." },
  { flag: "-maps", desc: "Google Maps integration." },
  { flag: "-analytics", desc: "PostHog event tracking." },
];

export default function CliDocsContent() {
  return (
    <div className="prose prose-gray dark:prose-invert max-w-none">
      <h1 className="text-3xl font-bold mb-6">VibeStart CLI</h1>

      <p className="text-gray-600 dark:text-gray-400 mb-4">
        The VibeStart command-line tool scaffolds a production-ready app in seconds. Run it
        anywhere you have Node&nbsp;18+ installed.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-3">Create a New Project</h2>
      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4">
        <code>{"npx create vibestart my-app -web"}</code>
      </pre>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
        Replace <code>my-app</code> with your folder name. Add extra flags to include
        integrations from the start (see below).
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-3">Available Flags</h2>
      <table className="w-full text-sm">
        <thead>
          <tr>
            <th className="text-left py-1 pr-4">Flag</th>
            <th className="text-left py-1">Description</th>
          </tr>
        </thead>
        <tbody>
          {flags.map(({ flag, desc }) => (
            <tr key={flag} className="align-top">
              <td className="whitespace-nowrap pr-4">
                <code>{flag}</code>
              </td>
              <td>{desc}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="text-xl font-semibold mt-6 mb-3">Useful Commands</h2>
      <ul className="list-disc pl-6 space-y-2 text-sm">
        <li>
          <code>npm run dev</code> – start the local dev server with hot-reload.
        </li>
        <li>
          <code>npm run db:migrate</code> – generate & run database migrations.
        </li>
        <li>
          <code>npm run lint</code> – run ESLint with the project rules.
        </li>
        <li>
          <code>npm run test</code> – execute unit & integration tests.
        </li>
        <li>
          <code>npm run build</code> – produce an optimised production build.
        </li>
      </ul>
    </div>
  );
} 