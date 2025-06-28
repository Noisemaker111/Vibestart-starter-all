import { SignInButton } from "@client/components/SignInButton";
import { CreateOrganizationButton } from "@client/components/CreateOrganizationButton";
import { useAuth } from "@client/context/AuthContext";

// Local status indicator util
function StatusIcon({ status }: { status: "idle" | "ok" }) {
  return status === "ok" ? (
    <span className="text-green-500 ml-2">✔</span>
  ) : (
    <span className="text-yellow-500 ml-2">⚠</span>
  );
}

export default function DocsTestAuth() {
  const { session } = useAuth();

  return (
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
  );
}
