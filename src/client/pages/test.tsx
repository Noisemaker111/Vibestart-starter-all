import { useState, useEffect } from "react";
import type { Route } from "./+types/test";
import { supabase } from "@shared/supabase";
import { SquareUploadButton } from "@client/components/SquareUploadButton";
import { SignInButton } from "@client/components/SignInButton";
import { CreateOrganizationButton } from "@client/components/CreateOrganizationButton";
import { useAuth } from "@client/context/AuthContext";
import { processIdea } from "@client/utils/integrationTool";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Integration Test Utilities - VibeStart" },
    {
      name: "description",
      content: "Interactive tools to verify each integration in VibeStart.",
    },
  ];
}

export default function TestUtilities() {
  // Animals table test state
  const [animalInput, setAnimalInput] = useState("");
  const [animals, setAnimals] = useState<string[]>([]);
  const [animalError, setAnimalError] = useState<string | null>(null);
  const [animalsStatus, setAnimalsStatus] = useState<"idle" | "ok" | "error">("idle");

  // API health check states (animals & images endpoints)
  const [animalsApiStatus, setAnimalsApiStatus] = useState<"idle" | "ok" | "error">(
    "idle"
  );
  const [imagesApiStatus, setImagesApiStatus] = useState<"idle" | "ok" | "error">(
    "idle"
  );
  const [apiError, setApiError] = useState<string | null>(null);

  // Auth state (from context)
  const { session } = useAuth();

  // File upload state
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [uploadedImages, setUploadedImages] = useState<{id:number,url:string}[]>([]);

  // Add after other state definitions
  const [uploadthingApiStatus, setUploadthingApiStatus] = useState<"idle" | "ok" | "error">("idle");

  // ────────────────────────────────────────────────────────────────────────
  // LLM Chat test state & helpers
  // ────────────────────────────────────────────────────────────────────────
  const [llmIdea, setLlmIdea] = useState("");
  const availableModels = [
    "mistralai/mistral-7b-instruct",

    "openai/gpt-3.5-turbo",
    "openai/gpt-4o-mini",
    "openai/gpt-3.5-turbo-0613",
    "openai/gpt-4o-mini-2024-07-18",
    
    "google/gemini-2.0-flash-001",
    "google/gemini-2.5-flash-lite-preview-06-17",
    "google/gemini-2.5-flash-preview-05-20",
    "google/gemma-2-9b-it",
    "deepinfra/bf16",
    "google/gemini-2.0-flash-exp:free",
    "google/gemini-flash-1.5-8b"
    
  ];
  const [selectedModel, setSelectedModel] = useState<string>(availableModels[0]);
  const [llmOutput, setLlmOutput] = useState("");

  // ────────────────────────────────────────────────────────────────────────
  /* Animals helpers                                                         */
  /* ──────────────────────────────────────────────────────────────────────── */

  async function refreshAnimals() {
    setAnimalError(null);
    try {
      const res = await fetch("/api/animals");
      if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
      const data = (await res.json()) as { name: string }[];
      setAnimals(data?.map((d) => d.name) ?? []);
      // Set API status based on returned data count
      if (data && data.length > 0) {
        setAnimalsApiStatus("ok");
      } else {
        setAnimalsApiStatus("idle");
      }
    } catch (err: any) {
      setAnimalsApiStatus("error");
      setAnimalError(err.message || String(err));
    }
  }

  async function addAnimal(name: string) {
    if (!name) return;
    setAnimalError(null);
    try {
      const res = await fetch("/api/animals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) {
        const errorPayload = await res.json().catch(() => ({}));
        throw new Error(errorPayload?.error || `HTTP ${res.status}`);
      }
      setAnimalInput("");
      // Mark database test as successful only after insert works
      setAnimalsStatus("ok");
      await refreshAnimals();
    } catch (err: any) {
      setAnimalsStatus("error");
      setAnimalError(err.message || String(err));
    }
  }

  // Fetch initial animal list on mount
  useEffect(() => {
    if (import.meta.env.DEV) {
      refreshAnimals();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ──────────────────────────────────────────────────────────────────────── */
  /* API health check                                                        */
  /* ──────────────────────────────────────────────────────────────────────── */

  async function checkApi() {
    setApiError(null);

    // Check /api/animals
    try {
      const res = await fetch("/api/animals");
      if (!res.ok) throw new Error(`animals HTTP ${res.status}`);
      const animalsData = (await res.json()) as unknown[];
      if (Array.isArray(animalsData) && animalsData.length > 0) {
        setAnimalsApiStatus("ok");
      } else {
        setAnimalsApiStatus("idle");
      }
    } catch (err: any) {
      setAnimalsApiStatus("error");
      setApiError(err.message || String(err));
    }

    // Check /api/images
    try {
      const res = await fetch("/api/images");
      if (!res.ok) throw new Error(`images HTTP ${res.status}`);
      const imagesData = (await res.json()) as unknown[];
      if (Array.isArray(imagesData) && imagesData.length > 0) {
        setImagesApiStatus("ok");
      } else {
        setImagesApiStatus("idle");
      }
    } catch (err: any) {
      setImagesApiStatus("error");
      setApiError((prev) => prev ?? (err.message || String(err)));
    }

    // Check /api/uploadthing (HEAD)
    try {
      const res = await fetch("/api/uploadthing", { method: "GET" });
      if (!res.ok) throw new Error(`uploadthing HTTP ${res.status}`);
      setUploadthingApiStatus("ok");
    } catch (err: any) {
      setUploadthingApiStatus("error");
      setApiError((prev) => prev ?? (err.message || String(err)));
    }
  }

  // Run API check on mount
  useEffect(() => {
    if (import.meta.env.DEV) {
      checkApi();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-check API after upload completes
  useEffect(() => {
    if (uploadResult && import.meta.env.DEV) checkApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadResult]);

  async function fetchImages() {
    if (!import.meta.env.DEV) return;
    try {
      const res = await fetch("/api/images");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setUploadedImages(data);
    } catch (err) {
      console.error("Failed to fetch images", err);
    }
  }

  useEffect(() => {
    fetchImages();
  }, []);

  useEffect(() => {
    if (uploadResult) {
      fetchImages();
    }
  }, [uploadResult]);

  // helper renderStatusIcon
  function StatusIcon({ status }: { status: "idle" | "ok" | "error" }) {
    if (status === "ok") return <span className="text-green-500 ml-2">✔</span>;
    if (status === "error") return <span className="text-red-500 ml-2">✖</span>;
    return <span className="text-yellow-500 ml-2">⚠</span>; // caution symbol
  }

  async function clearAll() {
    // sign out user (if any)
    await supabase.auth.signOut();

    // Delete animals & images for this anon token or user token
    if (import.meta.env.DEV) {
      await Promise.all([
        fetch("/api/animals", { method: "DELETE" }).catch(() => {}),
        fetch("/api/images", { method: "DELETE" }).catch(() => {}),
      ]);
    }

    // Reset local states
    setAnimals([]);
    setAnimalsStatus("idle");
    setAnimalError(null);
    setAnimalsApiStatus("idle");
    setImagesApiStatus("idle");
    setUploadthingApiStatus("idle");
    setUploadedImages([]);
    setUploadResult(null);
    setApiError(null);
  }

  async function runLlmChat() {
    if (!llmIdea.trim()) return;
    try {
      const res = await processIdea(llmIdea.trim(), selectedModel);
      const { platform, integrations, error } = res;
      setLlmOutput(
        JSON.stringify(
          {
            platform,
            integrations,
            ...(error ? { error } : {}),
          },
          null,
          2
        )
      );
    } catch (err: any) {
      setLlmOutput(`Error: ${err.message || String(err)}`);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4 container mx-auto max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Connection Tests
        </h1>
        <div className="flex items-center gap-3">
          <button onClick={clearAll} className="btn-primary px-4 py-2 text-sm">Clear</button>
        </div>
      </div>

      {/* Database Test */}
      <details className="mb-10 bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
        <summary className="cursor-pointer select-none px-6 py-4 font-semibold text-lg bg-blue-50 dark:bg-blue-900/20">
          Database Test
          <StatusIcon status={animalsStatus} />
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
        <summary className="cursor-pointer select-none px-6 py-4 font-semibold text-lg bg-green-50 dark:bg-green-900/20 flex items-center gap-2">
          <span>File Upload Test</span>
          <StatusIcon status={uploadResult ? "ok" : "idle"} />
        </summary>
        <div className="p-6">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <SquareUploadButton
              onUploadComplete={(res: any) => {
                setUploadResult(res);
              }}
            />
          </div>
          {uploadedImages.length > 0 && (
            <div className="mt-6 grid grid-cols-3 sm:grid-cols-4 gap-4">
              {uploadedImages.map((img) => (
                <img
                  key={img.id}
                  src={img.url}
                  alt="Uploaded"
                  className="w-24 h-24 object-cover rounded-lg"
                />
              ))}
            </div>
          )}
        </div>
      </details>

      {/* API Test (placed after uploads) */}
      <details className="mb-10 bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
        <summary className="cursor-pointer select-none px-6 py-4 font-semibold text-lg bg-teal-50 dark:bg-teal-900/20">
          API Test
          <span className="ml-2">Animals</span>
          <StatusIcon status={animalsApiStatus} />
          <span className="ml-4">Images</span>
          <StatusIcon status={imagesApiStatus} />
          <span className="ml-4">Uploads</span>
          <StatusIcon status={uploadthingApiStatus} />
        </summary>
        <div className="p-6 space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            This verifies both the Animals and Images API endpoints return data for this browser session.
          </p>
          <button onClick={checkApi} className="btn-primary max-w-xs">
            Re-check API
          </button>
          {apiError && (
            <p className="text-sm text-red-600 dark:text-red-400 break-all">
              Error: {apiError}
            </p>
          )}
        </div>
      </details>

      {/* Authentication Section */}
      <details className="mb-10 bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
        <summary className="cursor-pointer select-none px-6 py-4 font-semibold text-lg bg-purple-50 dark:bg-purple-900/20 flex items-center gap-2">
          <span>Auth Test</span>
          <StatusIcon status={session ? "ok" : "idle"} />
        </summary>
        <div className="p-6 space-y-4">
          {session && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Logged in as <strong>{session.user.email}</strong>
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-4">
            <SignInButton />
            {session && <CreateOrganizationButton />}
          </div>
        </div>
      </details>

      {/* LLM Chat */}
      {/* The full interactive section is only rendered during development. In
         production we output a minimal placeholder so the system prompt and other
         internals never reach the DOM. */}
      {import.meta.env.DEV ? (
        <details className="mb-10 bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
          <summary className="cursor-pointer select-none px-6 py-4 font-semibold text-lg bg-indigo-50 dark:bg-indigo-900/20 flex items-center gap-2">
            <span>LLM Chat</span>
          </summary>
          <div className="p-6 space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Enter an idea to generate an integration specification via OpenRouter. The generated system prompt and raw output are shown for debugging.
            </p>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium" htmlFor="model-select">Model:</label>
                <select
                  id="model-select"
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="input max-w-xs py-1 px-2 text-sm"
                >
                  {availableModels.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
              <textarea
                value={llmIdea}
                onChange={(e) => setLlmIdea(e.target.value)}
                placeholder="Your idea…"
                rows={3}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg"
              />

              <div className="flex flex-wrap gap-3">
                <button onClick={runLlmChat} className="btn-primary">Run LLM Chat</button>
              </div>

              <pre className="bg-gray-900 text-gray-100 text-xs p-4 rounded-lg overflow-x-auto min-h-[160px]">
                {llmOutput || "Output will appear here…"}
              </pre>
            </div>
          </div>
        </details>
      ) : (
        <details className="mb-10 bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
          <summary className="cursor-pointer select-none px-6 py-4 font-semibold text-lg bg-indigo-50 dark:bg-indigo-900/20 flex items-center gap-2">
            <span>LLM Chat</span>
            <span className="ml-2 bg-yellow-900/30 text-yellow-300 text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded-md">soon</span>
          </summary>
          <div className="p-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">Feature coming soon.</p>
          </div>
        </details>
      )}

      {/* Maps / Address Autocomplete (Placeholder) */}
      <details className="mb-10 bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
        <summary className="cursor-pointer select-none px-6 py-4 font-semibold text-lg bg-orange-50 dark:bg-orange-900/20 flex items-center gap-2">
          <span>Maps / Address Autocomplete</span>
          <span className="ml-2 bg-yellow-900/30 text-yellow-300 text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded-md">soon</span>
        </summary>
        <div className="p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Maps & address autocomplete tests will be added here.
          </p>
        </div>
      </details>

      {/* Realtime Chat (Placeholder) */}
      <details className="mb-10 bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
        <summary className="cursor-pointer select-none px-6 py-4 font-semibold text-lg bg-teal-50 dark:bg-teal-900/20 flex items-center gap-2">
          <span>Realtime Chat</span>
          <span className="ml-2 bg-yellow-900/30 text-yellow-300 text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded-md">soon</span>
        </summary>
        <div className="p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Realtime chat integration tests will be added here.
          </p>
        </div>
      </details>

      {/* Deployment Section Placeholder */}
      <details className="mb-10 bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
        <summary className="cursor-pointer select-none px-6 py-4 font-semibold text-lg bg-yellow-50 dark:bg-yellow-900/20 flex items-center gap-2">
          <span>Deployment</span>
          <span className="ml-2 bg-yellow-900/30 text-yellow-300 text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded-md">soon</span>
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
        <summary className="cursor-pointer select-none px-6 py-4 font-semibold text-lg bg-gray-50 dark:bg-gray-900/20 flex items-center gap-2">
          <span>Analytics</span>
          <span className="ml-2 bg-yellow-900/30 text-yellow-300 text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded-md">soon</span>
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