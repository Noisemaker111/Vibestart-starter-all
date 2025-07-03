import React from "react";
import IntegrationChips from "@client/components/integrations/IntegrationChip";
import IdeaTextBox from "@client/components/IdeaTextBox";
import type { AvailablePlatform } from "@shared/availablePlatforms";
import PlatformChip from "@client/components/PlatformChip";

interface Props {
  idea: string;
  placeholder: string;
  onIdeaChange: (value: string) => void;
  onIdeaKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  selectedPlatform?: AvailablePlatform;
  activeKeys: string[];
  loading: boolean;
}

export default function HomeIdeaCard({
  idea,
  placeholder,
  onIdeaChange,
  onIdeaKeyDown,
  selectedPlatform,
  activeKeys,
  loading,
}: Props) {
  return (
    <div className="relative group">
      <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl p-8 border border-gray-200 shadow-lg">
        {/* Internal glow overlay */}
        <div className="pointer-events-none absolute -inset-1 -z-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
        {/* Top bar – only shows selected platform chip (label removed per design update) */}
        {selectedPlatform && (
          <div className="flex justify-end mb-3">
            <PlatformChip platform={selectedPlatform} className="text-xs sm:text-sm" />
          </div>
        )}
        <div>
          <IdeaTextBox
            value={idea}
            onChange={onIdeaChange}
            onKeyDown={onIdeaKeyDown}
            placeholder={placeholder}
            className="w-full"
          />
        </div>

        {/* Integration list – displays a placeholder chip while analyzing */}
        <div className="mt-4 flex justify-center">
          <IntegrationChips
            activeKeys={activeKeys}
            showAllIfEmpty={false}
            loading={loading}
            rowPattern={[3,2,3,2]}
            chipWidthClass="w-[240px]"
          />
        </div>
      </div>
    </div>
  );
} 