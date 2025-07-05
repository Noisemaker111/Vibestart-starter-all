import React from "react";
import IdeaTextBox from "@pages/components/IdeaTextBox";
import PlatformChip from "@pages/components/PlatformChip";
import IntegrationChips from "@pages/components/IntegrationChip";
import type { AvailablePlatform } from "@shared/availablePlatforms";

interface IdeaCardProps {
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
}: IdeaCardProps) {
  return (
    <div className="relative group">
      <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl p-8 border border-gray-200 shadow-lg">
        {/* Internal glow overlay */}
        <div className="pointer-events-none absolute -inset-1 -z-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300" />
        {/* Top bar – only shows selected platform chip */}
        {selectedPlatform && (
          <div className="flex justify-end mb-3">
            <PlatformChip platform={selectedPlatform} className="text-xs sm:text-sm" />
          </div>
        )}
        <IdeaTextBox
          value={idea}
          onChange={onIdeaChange}
          onKeyDown={onIdeaKeyDown}
          placeholder={placeholder}
          className="w-full"
        />
        <div className="mt-4 flex justify-center">
          <IntegrationChips
            activeKeys={activeKeys}
            showAllIfEmpty={false}
            loading={loading}
            rowPattern={[3, 2, 3, 2]}
            chipWidthClass="w-[240px]"
          />
        </div>
      </div>
    </div>
  );
} 