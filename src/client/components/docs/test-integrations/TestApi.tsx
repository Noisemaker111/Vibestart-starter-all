import { TestCard } from "@client/components/docs/test-integrations/TestCard";

export default function DocsTestApi() {
  return (
    <TestCard
      headerClassName="bg-sky-50 dark:bg-sky-900/20"
      title={
        <>
          <span>External API</span>
          <span className="ml-2 bg-yellow-900/30 text-yellow-300 text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded-md">soon</span>
        </>
      }
    >
      <p className="text-sm text-gray-600 dark:text-gray-400">
        External API integration tests will be added here.
      </p>
    </TestCard>
  );
} 