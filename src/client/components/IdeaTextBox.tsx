import React from "react";

interface IdeaTextBoxProps {
  value: string;
  onChange: (value: string) => void;
  onKeyDown?: React.KeyboardEventHandler<HTMLTextAreaElement>;
  /** Placeholder text when empty */
  placeholder?: string;
  /** Extra Tailwind classes applied to the root wrapper */
  className?: string;
}

/**
 * Fancy liquid-glass styled controlled textarea used for the Build-Idea flow.
 */
export default function IdeaTextBox({
  value,
  onChange,
  onKeyDown,
  placeholder = "Enter your text…",
  className = "",
}: IdeaTextBoxProps) {
  return (
    <div className={`relative group ${className}`.trim()} style={{ perspective: '1000px' }}>
      {/* Liquid background waves */}
      <div className="absolute -inset-16 opacity-35 pointer-events-none select-none -z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-300/30 to-pink-300/30 rounded-full blur-3xl animate-wave" />
        <div className="absolute inset-0 bg-gradient-to-l from-blue-300/20 to-purple-300/20 rounded-full blur-3xl animate-wave-reverse" />
      </div>

      {/* Main liquid glass container */}
      <div
        className="relative backdrop-blur-xl bg-gradient-to-br from-white/10 via-white/5 to-white/10 rounded-[2.5rem] border border-white/20 shadow-[0_12px_60px_rgba(147,51,234,0.25),inset_0_1px_0_rgba(255,255,255,0.15)] hover:shadow-[0_16px_72px_rgba(147,51,234,0.35)] transition-all duration-700 ease-out overflow-hidden ring-1 ring-purple-300/30"
      >
        {/* Liquid flow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/8 to-transparent rounded-[2.5rem] translate-y-full group-hover:translate-y-[-100%] transition-transform duration-[1500ms] ease-in-out pointer-events-none" />

        {/* Ripple effect – single layer for subtlety */}
        <div className="absolute inset-4 rounded-[2rem] border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {/* Input field */}
        <textarea
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          className="relative w-full h-36 px-8 py-6 bg-transparent rounded-[2.5rem] border-0 outline-none resize-none text-gray-800 placeholder-gray-600/80 dark:text-gray-100 dark:placeholder-gray-400 text-lg leading-relaxed font-medium selection:bg-purple-200/30 z-10 backdrop-blur-sm"
        />

        {/* Liquid droplet highlights */}
        <div className="absolute top-6 left-6 w-4 h-4 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-sm pointer-events-none" />
        <div className="absolute bottom-8 right-8 w-3 h-3 bg-gradient-to-br from-white/15 to-transparent rounded-full blur-sm pointer-events-none" />
      </div>

      {/* Floating liquid bubbles */}
      <div className="absolute top-8 right-12 w-2 h-2 bg-purple-200/50 rounded-full animate-bubble pointer-events-none" />
      <div className="absolute bottom-12 left-16 w-1.5 h-1.5 bg-pink-200/50 rounded-full animate-bubble animation-delay-1000 pointer-events-none" />
      <div className="absolute top-16 left-8 w-1 h-1 bg-blue-200/50 rounded-full animate-bubble animation-delay-2000 pointer-events-none" />
    </div>
  );
} 