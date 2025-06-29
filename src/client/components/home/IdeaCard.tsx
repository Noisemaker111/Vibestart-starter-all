import React from "react";
import IntegrationChips from "@client/components/IntegrationChips";
import type { AvailablePlatform } from "@shared/availablePlatforms";

interface Props {
  idea: string;
  placeholder: string;
  onIdeaChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
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
      <div className="relative bg-gray-900/90 backdrop-blur-xl rounded-2xl p-8 border border-gray-800">
        {/* Internal glow overlay */}
        <div className="pointer-events-none absolute -inset-1 -z-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
          <label className="text-lg sm:text-xl font-semibold text-gray-300">
            Give me your idea
          </label>
          <div className="flex items-center gap-2">
            {selectedPlatform && (
              <div className="relative">
                <span className="px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg flex items-center gap-1">
                  {selectedPlatform.icon && (
                    <selectedPlatform.icon className="inline-block w-4 h-4" />
                  )}
                  {selectedPlatform.label}
                </span>
              </div>
            )}
          </div>
        </div>
        <div>
          <textarea
            value={idea}
            onChange={onIdeaChange}
            onKeyDown={onIdeaKeyDown}
            placeholder={placeholder}
            className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-all duration-300 resize-none"
            rows={3}
          />
        </div>

        {/* Integration list – displays a placeholder chip while analyzing */}
        <IntegrationChips className="mt-4" activeKeys={activeKeys} showAllIfEmpty={false} loading={loading} />
      </div>
    </div>
  );
} 