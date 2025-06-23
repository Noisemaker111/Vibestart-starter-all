import { useState } from "react";
import type { Route } from "./+types/test";
import { supabase } from "@shared/supabase";
import { UploadButton } from "@client/utils/uploadthing";
import { SignInForm } from "@client/components/SignInForm";
import { useAuth } from "@client/context/AuthContext";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Tech Stack Test Utilities - JonStack" },
    {
      name: "description",
      content: "Interactive tools to verify each integration in JonStack.",
    },
  ];
}

export default function TestUtilities() {
  // Animals table test state
  const [animalInput, setAnimalInput] = useState("");
  const [animals, setAnimals] = useState<string[]>([]);
  const [animalError, setAnimalError] = useState<string | null>(null);
  const [animalsStatus, setAnimalsStatus] = useState<"idle" | "ok" | "error">("idle");

  const sampleAnimals = [
    "Dog",
    "Cat",
    "Elephant",
    "Lion",
    "Tiger",
    "Zebra",
    "Giraffe",
    "Koala",
    "Panda",
    "Hippo",
  ];

  // Auth state (from context)
  const { session } = useAuth();

  // File upload state
  const [uploadResult, setUploadResult] = useState<any>(null);

  /* ──────────────────────────────────────────────────────────────────────── */
  /* Animals helpers                                                         */
  /* ──────────────────────────────────────────────────────────────────────── */

  async function refreshAnimals() {
    setAnimalError(null);
    try {
      const res = await fetch("/api/animals");
      if (!res.ok) throw new Error(await res.text());
      const data: { name: string }[] = await res.json();
      setAnimals(data.map((d) => d.name));
      setAnimalsStatus("ok");
    } catch (err: any) {
      setAnimalsStatus("error");
      setAnimalError(err.message || String(err));
    }
  }

  async function addAnimal(name: string) {
    if (!name) return;
    setAnimalError(null);
    try {
      const { error } = await supabase.from("animals").insert({ name });
      if (error) throw error;
      setAnimalInput("");
      await refreshAnimals();
    } catch (err: any) {
      setAnimalsStatus("error");
      setAnimalError(err.message || String(err));
    }
  }

  async function addRandomAnimals() {
    const random = [...sampleAnimals].sort(() => 0.5 - Math.random()).slice(0, 5);
    try {
      const insertPayload = random.map((r) => ({ name: r }));
      const { error } = await supabase.from("animals").insert(insertPayload);
      if (error) throw error;
      await refreshAnimals();
    } catch (err: any) {
      setAnimalError(err.message || String(err));
      setAnimalsStatus("error");
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4 container mx-auto max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
        Integration Test Utilities
      </h1>

      {/* Database Test */}
      <details className="mb-10 bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden" open>
        <summary className="cursor-pointer select-none px-6 py-4 font-semibold text-lg bg-blue-50 dark:bg-blue-900/20 flex items-center gap-3">
          Database Test
          {animalsStatus === "ok" && <span className="text-green-500">✔</span>}
          {animalsStatus === "error" && <span className="text-red-500">✖</span>}
        </summary>
        <div className="p-6 space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Ensure your Supabase project has a table named <code>animals</code> with
            a <code>name</code> <em>text</em> column. Add animals individually or
            insert 5 random entries.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 max-w-md">
            <input
              type="text"
              value={animalInput}
              onChange={(e) => setAnimalInput(e.target.value)}
              placeholder="e.g. Dolphin"
              className="input flex-1"
            />
            <button
              onClick={() => addAnimal(animalInput.trim())}
              className="btn-primary flex-shrink-0"
            >
              Send
            </button>
          </div>
          <button
            onClick={addRandomAnimals}
            className="btn-primary max-w-xs"
          >
            Send 5 Random Animals
          </button>

          {animalError && (
            <p className="text-sm text-red-600 dark:text-red-400 break-all">
              Error: {animalError}
            </p>
          )}

          <div className="space-y-1">
            {animals.map((a) => (
              <div key={a} className="text-sm text-gray-700 dark:text-gray-300">
                • {a}
              </div>
            ))}
            {animals.length === 0 && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                No animals yet.
              </p>
            )}
          </div>
        </div>
      </details>

      {/* File Upload Test */}
      <details className="mb-10 bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
        <summary className="cursor-pointer select-none px-6 py-4 font-semibold text-lg bg-green-50 dark:bg-green-900/20">
          File Upload Test
        </summary>
        <div className="p-6">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <UploadButton
              endpoint="imageUploader"
              onClientUploadComplete={(res) => {
                setUploadResult(res);
              }}
              onUploadError={(error) => {
                alert("Upload failed: " + error.message);
              }}
              appearance={{
                button({ ready }) {
                  return `btn-primary ${ready ? "" : "opacity-50 cursor-not-allowed"}`;
                },
              }}
            />
            {uploadResult && (
              <span className="text-green-500 text-sm">✔ Uploaded</span>
            )}
          </div>
        </div>
      </details>

      {/* Authentication Section */}
      <details className="mb-10 bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
        <summary className="cursor-pointer select-none px-6 py-4 font-semibold text-lg bg-purple-50 dark:bg-purple-900/20">
          Auth Test
        </summary>
        <div className="p-6 space-y-4">
          {session ? (
            <>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Logged in as <strong>{session.user.email}</strong>
              </p>
              <button
                onClick={() => supabase.auth.signOut()}
                className="btn-primary"
              >
                Sign Out
              </button>
            </>
          ) : (
            <SignInForm />
          )}
        </div>
      </details>

      {/* Deployment Section Placeholder */}
      <details className="mb-10 bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
        <summary className="cursor-pointer select-none px-6 py-4 font-semibold text-lg bg-yellow-50 dark:bg-yellow-900/20">
          Deployment
        </summary>
        <div className="p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Deployment tests are not automated yet. Deploy to Vercel and verify
            that environment variables are set correctly. If your page displays
            network errors, double-check <code>.env</code> values in the Vercel
            dashboard.
          </p>
        </div>
      </details>

      {/* Analytics Section Placeholder */}
      <details className="mb-10 bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
        <summary className="cursor-pointer select-none px-6 py-4 font-semibold text-lg bg-gray-50 dark:bg-gray-900/20">
          Analytics
        </summary>
        <div className="p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Analytics integration is coming soon. Keep an eye on future updates!
          </p>
        </div>
      </details>
    </main>
  );
} 