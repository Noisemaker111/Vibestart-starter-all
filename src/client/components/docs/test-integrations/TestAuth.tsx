import { SignInButton } from "@client/components/integrations/auth/SignInButton";
import { CreateOrganizationButton } from "@client/components/integrations/auth/CreateOrganizationButton";
import { useAuth } from "@client/context/AuthContext";
import { useClearTests } from "@client/utils/testIntegrationEvents";
import { supabase } from "@shared/supabase";
import { TestCard } from "@client/components/docs/test-integrations/TestCard";

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

  // Sign out when global clear invoked
  useClearTests(() => {
    supabase.auth.signOut().catch(() => {});
  });

  return (
    <TestCard
      headerClassName="bg-purple-50 dark:bg-purple-900/20"
      title={
        <div className="flex items-center gap-3 flex-wrap">
          <span>Auth Test</span>
          <StatusIcon status={session ? "ok" : "idle"} />
          <SignInButton />
          {session && <CreateOrganizationButton />}
        </div>
      }
    >
      {session && (
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Logged in as <strong>{session.user.email}</strong>
        </p>
      )}
    </TestCard>
  );
}
