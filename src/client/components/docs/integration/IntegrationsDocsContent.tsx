import React from "react";

interface IntegrationDocsContentProps {
  /** Integration key (see availableIntegrations.ts) */
  integrationKey: string;
}

/**
 * Centralised documentation renderer for all integration pages.
 * This keeps `docs.tsx` lean and avoids dozens of near-identical if-blocks.
 */
export default function IntegrationsDocsContent({ integrationKey }: IntegrationDocsContentProps) {
  switch (integrationKey) {
    case "database":
      return (
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <h1 className="text-3xl font-bold mb-6">Database Setup</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            JonStack uses PostgreSQL with Drizzle ORM for type-safe database operations.
          </p>
          <h2 className="text-2xl font-semibold mt-8 mb-4">Schema Definition</h2>
          <div className="bg-gray-900 text-gray-300 p-4 rounded-lg mb-6 text-sm">
            <code>{`// src/server/db/schema.ts
export const projectsTable = pgTable('projects', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  user_id: uuid('user_id').notNull(),
  created_at: timestamp('created_at').defaultNow()
});`}</code>
          </div>
          <h2 className="text-2xl font-semibold mt-8 mb-4">Database Commands</h2>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Generate migrations</h4>
              <div className="bg-gray-900 text-gray-300 p-3 rounded-lg">
                <code>npm run db:generate</code>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Run migrations</h4>
              <div className="bg-gray-900 text-gray-300 p-3 rounded-lg">
                <code>npm run db:migrate</code>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Open Drizzle Studio</h4>
              <div className="bg-gray-900 text-gray-300 p-3 rounded-lg">
                <code>npm run db:studio</code>
              </div>
            </div>
          </div>
        </div>
      );

    case "uploads":
    case "file-uploads":
      return (
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <h1 className="text-3xl font-bold mb-6">File Uploads</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            UploadThing integration provides simple, secure file uploads with automatic optimisation.
          </p>
          <h2 className="text-2xl font-semibold mt-8 mb-4">Using the Upload Component</h2>
          <div className="bg-gray-900 text-gray-300 p-4 rounded-lg mb-6 text-sm">
            <code>{`import { UploadButton } from "@client/utils/uploadthing";

<UploadButton
  endpoint="imageUploader"
  onClientUploadComplete={(res) => {
    console.log("Files: ", res);
  }}
  onUploadError={(error) => {
    alert("Upload failed: " + error.message);
  }}
/>`}</code>
          </div>
          <h2 className="text-2xl font-semibold mt-8 mb-4">Features</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <h4 className="font-medium mb-2">✓ Included</h4>
              <ul className="text-sm space-y-1">
                <li>• Drag &amp; drop support</li>
                <li>• Progress indicators</li>
                <li>• Image optimisation</li>
                <li>• Secure file storage</li>
              </ul>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h4 className="font-medium mb-2">File Types</h4>
              <ul className="text-sm space-y-1">
                <li>• Images (JPG, PNG, GIF)</li>
                <li>• Documents (PDF, DOCX)</li>
                <li>• Videos (MP4, MOV)</li>
                <li>• Custom types supported</li>
              </ul>
            </div>
          </div>
        </div>
      );

    case "analytics":
      return (
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <h1 className="text-3xl font-bold mb-6">Analytics (Boilerplate)</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Analytics integration docs will live here.
          </p>
          <ul className="list-disc pl-6 space-y-2 text-sm">
            <li>Pick a provider (e.g. Plausible, PostHog, Google Analytics).</li>
            <li>Add the provider's script tag in <code>root.tsx</code>.</li>
            <li>Send custom events from client-side interactions.</li>
          </ul>
        </div>
      );

    // Sign-in providers are funnelled to the Auth docs section externally.

    default:
      return (
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <h1 className="text-3xl font-bold mb-6">Coming soon</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Documentation for <code>{integrationKey}</code> isn't available yet.
          </p>
        </div>
      );
  }
} 