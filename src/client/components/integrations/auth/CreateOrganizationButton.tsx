import { useState } from "react";
import { useAuth } from "@client/context/AuthContext";
import { supabase } from "@shared/supabase";

interface Props {
  className?: string;
}

export function CreateOrganizationButton({ className }: Props) {
  const { session } = useAuth();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!session) return null; // Only render for signed-in users

  async function handleCreate() {
    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    setLoading(true);
    setError(null);

    const { error } = await supabase
      .from("organizations")
      .insert({ name: name.trim(), owner_id: session!.user.id });

    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      setName("");
      setOpen(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`btn-primary ${className ?? ""}`.trim()}
      >
        Create Organization
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg w-full max-w-sm p-6 relative">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-900 dark:hover:text-white"
              aria-label="Close"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white text-center">
              New Organization
            </h3>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Organization name"
              className="input mb-4"
            />

            {error && <p className="text-sm text-red-600 dark:text-red-400 mb-2">{error}</p>}

            <button
              onClick={handleCreate}
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? "Creating…" : "Create"}
            </button>
          </div>
        </div>
      )}
    </>
  );
} 