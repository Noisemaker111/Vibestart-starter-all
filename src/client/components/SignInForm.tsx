import { useState } from "react";
import { supabase } from "@shared/supabase";

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
            options: { redirectTo: window.location.origin },
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

      <button
        type="button"
        onClick={() =>
          supabase.auth.signInWithOAuth({
            provider: "github",
            options: { redirectTo: window.location.origin },
          })
        }
        className="inline-flex items-center justify-center gap-3 w-full px-6 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0C5.37 0 0 5.37 0 12C0 17.303 3.438 21.8 8.205 23.385C8.805 23.498 9.025 23.15 9.025 22.845C9.025 22.571 9.015 21.744 9.009 20.708C5.672 21.399 4.968 19.182 4.968 19.182C4.422 17.827 3.633 17.459 3.633 17.459C2.546 16.709 3.714 16.724 3.714 16.724C4.922 16.813 5.554 17.994 5.554 17.994C6.636 19.845 8.346 19.348 9.051 19.066C9.156 18.287 9.467 17.761 9.81 17.46C7.145 17.157 4.344 16.112 4.344 11.475C4.344 10.163 4.799 9.083 5.579 8.237C5.456 7.932 5.05 6.69 5.69 5.025C5.69 5.025 6.703 4.697 9.009 6.262C9.965 5.991 10.985 5.856 12 5.851C13.015 5.856 14.035 5.991 14.991 6.262C17.297 4.697 18.309 5.025 18.309 5.025C18.95 6.69 18.543 7.932 18.421 8.237C19.203 9.083 19.654 10.163 19.654 11.475C19.654 16.125 16.848 17.152 14.175 17.449C14.6 17.836 14.982 18.589 14.982 19.754C14.982 21.364 14.968 22.529 14.968 22.845C14.968 23.155 15.185 23.506 15.795 23.385C20.565 21.796 24 17.298 24 12C24 5.37 18.63 0 12 0Z" />
        </svg>
        Continue with GitHub
      </button>
    </form>
  );
} 