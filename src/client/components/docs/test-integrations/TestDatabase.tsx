import { useState, useEffect } from "react";

// Local util to show coloured status tick / cross / warn
function StatusIcon({ status }: { status: "idle" | "ok" | "error" }) {
  if (status === "ok") return <span className="text-green-500 ml-2">✔</span>;
  if (status === "error") return <span className="text-red-500 ml-2">✖</span>;
  return <span className="text-yellow-500 ml-2">⚠</span>;
}

/**
 * DocsTestDatabase verifies that the `animals` table exists and that the
 * REST endpoints wired up in `/api/animals` work correctly for the current
 * browser session. Shipped as an expandable <details> block for the Docs
 * page.
 */
export default function DocsTestDatabase() {
  const [animalInput, setAnimalInput] = useState("");
  const [animals, setAnimals] = useState<string[]>([]);
  const [animalError, setAnimalError] = useState<string | null>(null);
  const [animalsStatus, setAnimalsStatus] = useState<"idle" | "ok" | "error">("idle");
  const [animalsApiStatus, setAnimalsApiStatus] = useState<"idle" | "ok" | "error">("idle");

  // Helper to fetch the current animals list
  async function refreshAnimals() {
    setAnimalError(null);
    try {
      const res = await fetch("/api/animals");
      if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
      const data = (await res.json()) as { name: string }[];
      setAnimals(data?.map((d) => d.name) ?? []);
      // API health indicator
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

  // Insert new animal
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
      setAnimalsStatus("ok"); // mark DB test as successful on insert
      await refreshAnimals();
    } catch (err: any) {
      setAnimalsStatus("error");
      setAnimalError(err.message || String(err));
    }
  }

  // Load list on mount in development
  useEffect(() => {
    if (import.meta.env.DEV) {
      refreshAnimals();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
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
            <p className="text-xs text-gray-500 dark:text-gray-400">No animals yet.</p>
          )}
        </div>
      </div>
    </details>
  );
}
