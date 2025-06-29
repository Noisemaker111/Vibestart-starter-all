import { useState } from "react";
import { supabase } from "@shared/supabase";

export const OAUTH_REDIRECT_URL = import.meta.env.VITE_SUPABASE_REDIRECT ?? "";

export function SignInForm({ onSuccess }: { onSuccess?: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      onSuccess?.();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-sm">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
        className="input"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
        className="input"
      />
      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading ? "Signing In…" : "Sign In"}
      </button>

      {/* Divider */}
      <div className="flex items-center gap-2">
        <hr className="flex-1 border-gray-300 dark:border-gray-600" />
        <span className="text-xs text-gray-500 dark:text-gray-400">or</span>
        <hr className="flex-1 border-gray-300 dark:border-gray-600" />
      </div>

      <button
        type="button"
        onClick={() =>
          supabase.auth.signInWithOAuth({
            provider: "google",
            options: { redirectTo: OAUTH_REDIRECT_URL || window.location.origin },
          })
        }
        className="inline-flex items-center justify-center gap-3 w-full px-6 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      >
        <svg className="w-5 h-5" viewBox="0 0 533.5 544.3">
          <path fill="#4285F4" d="M533.5 278.4c0-18.2-1.6-36-4.6-53.2H272v100.9h146.9c-6.3 34.6-25.4 63.4-54 83l87.1 67.6c50.7-46.7 81.5-115.5 81.5-198.3z" />
          <path fill="#34A853" d="M272 544.3c73.6 0 135.5-24.3 180.7-65.9l-87.1-67.6c-24.2 16.3-55.3 25.9-93.6 25.9-71.9 0-132.8-48.5-154.7-113.6l-90.1 69.6C66.8 489.8 162.9 544.3 272 544.3z" />
          <path fill="#FBBC05" d="M117.3 323.1c-10.1-30-10.1-62.2 0-92.2l-90.1-69.6C-12.7 226-12.7 318.4 27.2 378.9l90.1-55.8z" />
          <path fill="#EA4335" d="M272 107.3c39.9 0 75.8 13.8 104.1 40.9l78.1-78.1C387.5 22.4 332-0 272 0 162.9 0 66.8 54.6 27.2 136.7l90.1 69.6C139.2 155.8 200.1 107.3 272 107.3z" />
        </svg>
        Continue with Google
      </button>
    </form>
  );
} 