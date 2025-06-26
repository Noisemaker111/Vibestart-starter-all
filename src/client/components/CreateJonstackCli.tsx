import SoonBadge from "@client/components/SoonBadge";

export default function CreateJonstackCli({ className = "" }: { className?: string }) {
  // This component is now purely presentational (no copy-to-clipboard)

  return (
    <div
      className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-950 border border-gray-700 text-gray-100 text-sm whitespace-nowrap shadow-md ${className}`.trim()}
      aria-label="create-jonstack coming soon"
    >
      <code className="select-none">npx create-jonstack</code>
      <SoonBadge />
    </div>
  );
} 