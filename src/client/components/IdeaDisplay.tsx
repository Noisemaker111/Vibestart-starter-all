"use client";

import React from "react";
import IntegrationChips from "@client/components/IntegrationChips";
import PlatformChip from "@client/components/PlatformChip";
import type { AvailablePlatform } from "@shared/availablePlatforms";

interface IdeaDisplayProps {
  /** Current idea text (controlled) */
  idea?: string;
  /** Keys of active integrations (maps directly to IntegrationChips.activeKeys) */
  activeIntegrations?: string[];
  /** Platform object – forwarded to PlatformChip */
  platform?: AvailablePlatform;
  /** Handler when the user types in the textarea. When provided, IdeaDisplay switches to editable mode */
  onIdeaChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  /** KeyDown handler for the textarea – passed through */
  onIdeaKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  /** Placeholder text shown when idea is empty in editable mode */
  placeholder?: string;
  /** When true, IntegrationChips renders an "Analyzing…" placeholder */
  loading?: boolean;
  /** Handler to remove an integration key (forwarded) */
  onRemove?: (key: string) => void;
  /** Handler when user clicks the + chip */
  onAdd?: () => void;
  /** Optional extra Tailwind classes */
  className?: string;
}

/**
 * Visual summary block that shows the user's idea, selected platform and active integrations.
 * Designed for re-use across docs/marketing pages.
 */
export default function IdeaDisplay({
  idea,
  activeIntegrations = [],
  platform,
  onIdeaChange,
  onIdeaKeyDown,
  placeholder = "Enter your idea here…",
  loading = false,
  onRemove,
  onAdd,
  className = "",
}: IdeaDisplayProps) {
  // Determine if we're in editable mode – simply when onIdeaChange is provided
  const editable = typeof onIdeaChange === "function";

  return (
    <div className={`relative w-full max-w-4xl mx-auto p-4 not-prose ${className}`.trim()}>
      {/* Container styles differ between editable vs display modes */}
      <div
        className={[
          "rounded-xl overflow-hidden",
          editable
            ? "bg-gray-900/80 border border-gray-700/60 p-6"
            : "relative bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 pt-8 px-8 md:pt-12 md:px-12",
        ].join(" ")}
      >
        {/* Decorative gradients only in display mode */}
        {!editable && (
          <div className="absolute inset-0 pointer-events-none rounded-xl">
            {/* Primary rotating gradient */}
            <div className="absolute inset-0 rounded-xl animate-rotate-slow opacity-40">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-cyan-400/20 via-transparent to-purple-400/20 blur-sm" />
            </div>

            {/* Secondary counter-rotating gradient */}
            <div className="absolute inset-0 rounded-xl animate-rotate-reverse opacity-30">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-l from-transparent via-pink-400/15 via-transparent to-blue-400/15 blur-sm" />
            </div>

            {/* Traveling accent dots (clockwise) */}
            <div className="absolute inset-0 animate-rotate-slow">
              <div className="absolute -top-0.5 left-1/4 w-1.5 h-1.5 bg-cyan-400/60 rounded-full shadow-sm shadow-cyan-400/30" />
              <div className="absolute -bottom-0.5 right-1/3 w-1.5 h-1.5 bg-purple-400/60 rounded-full shadow-sm shadow-purple-400/30" />
            </div>

            {/* Traveling accent dots (counter-clockwise) */}
            <div className="absolute inset-0 animate-rotate-reverse">
              <div className="absolute -right-0.5 top-1/3 w-1.5 h-1.5 bg-pink-400/60 rounded-full shadow-sm shadow-pink-400/30" />
              <div className="absolute -left-0.5 bottom-1/4 w-1.5 h-1.5 bg-blue-400/60 rounded-full shadow-sm shadow-blue-400/30" />
            </div>
          </div>
        )}

        {/* Top bar: label (editable mode) and optional platform chip share the same line */}
        {(editable || platform) && (
          <div
            className={`relative z-10 flex items-center mb-4 w-full px-2 ${
              editable ? "justify-between" : "justify-end"
            }`}
          >
            {editable && (
              <label className="text-left text-gray-400 text-sm">Enter your idea</label>
            )}
            {platform && <PlatformChip platform={platform} />}
          </div>
        )}

        {/* Main content */}
        <div className={`relative z-10 flex flex-col items-center justify-center gap-8 w-full`}>
          {/* Idea text or editable textarea */}
          <div className="text-center max-w-2xl px-4 w-full">
            {editable ? (
              <textarea
                value={idea ?? ""}
                onChange={onIdeaChange}
                onKeyDown={onIdeaKeyDown}
                placeholder={placeholder}
                rows={3}
                className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-all duration-300 resize-none"
              />
            ) : (
              <p className="text-lg md:text-xl lg:text-2xl text-gray-100 leading-relaxed font-medium whitespace-pre-wrap break-words capitalize">
                {idea}
              </p>
            )}
          </div>

          {/* Integration chips */}
          <div className="flex justify-center w-full">
            <IntegrationChips
              activeKeys={activeIntegrations}
              showAllIfEmpty={false}
              className="justify-center"
              loading={loading}
              onRemove={onRemove}
              onAdd={onAdd}
            />
          </div>
        </div>

        {/* Corner glows only in display mode */}
        {!editable && (
          <>
            <div className="absolute top-0 left-0 w-16 h-16 md:w-24 md:h-24 bg-gradient-to-br from-cyan-400/10 to-transparent rounded-br-full" />
            <div className="absolute bottom-0 right-0 w-16 h-16 md:w-24 md:h-24 bg-gradient-to-tl from-purple-400/10 to-transparent rounded-tl-full" />
          </>
        )}
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes rotate-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes rotate-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .animate-rotate-slow {
          animation: rotate-slow 25s linear infinite;
        }
        .animate-rotate-reverse {
          animation: rotate-reverse 20s linear infinite;
        }
      `}</style>
    </div>
  );
} 