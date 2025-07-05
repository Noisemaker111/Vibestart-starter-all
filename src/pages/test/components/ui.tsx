import React, { useState, useRef } from "react";
import { Loader2 } from "lucide-react";
import { useUploadThing } from "@pages/utils/uploadthing";

// ---------------------------------------------------------------------------
// Reusable UI primitives (defined locally to avoid external imports)
// ---------------------------------------------------------------------------

interface TestCardProps {
  title: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export function TestCard({ title, children, className = "" }: TestCardProps) {
  return (
    <div
      className={
        `mb-10 w-full max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-xl border border-gray-300 dark:border-gray-700 overflow-hidden ${className}`.trim()
      }
    >
      <div className="p-6 space-y-4">
        <div className="font-semibold text-lg flex items-center gap-2">{title}</div>
        {children !== undefined && children}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Upload Photo Button (inlined here to stay self-contained)
// ---------------------------------------------------------------------------

export function UploadPhotoButton({ onComplete }: { onComplete?: (files: any) => void }) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [progress, setProgress] = useState<number>(0);

  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onUploadBegin: () => setProgress(0),
    onUploadProgress: (p: any) => {
      const value = typeof p === "number" ? p : p?.progress;
      if (typeof value === "number" && !Number.isNaN(value)) {
        setProgress(Math.round(value));
      }
    },
    onClientUploadComplete: (res: any) => {
      setProgress(0);
      onComplete?.(res as any);
    },
  });

  function handleFiles(files: File[]) {
    if (!files || files.length === 0) return;
    startUpload(files);
  }

  function triggerFileDialog() {
    inputRef.current?.click();
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        className="btn-primary w-full min-w-[8rem] px-4 py-2 text-base"
        onClick={triggerFileDialog}
        disabled={isUploading}
      >
        Upload Photo
      </button>
      <input
        type="file"
        accept="image/*"
        multiple={false}
        ref={inputRef}
        className="hidden"
        onChange={(e) => {
          const files = e.target.files ? Array.from(e.target.files) : [];
          handleFiles(files as File[]);
          e.target.value = "";
        }}
      />

      {isUploading && (
        <div className="flex items-center gap-1">
          <Loader2 className="w-4 h-4 animate-spin text-gray-600" />
          <span className="text-xs tabular-nums">{progress}%</span>
        </div>
      )}
    </div>
  );
}

// Utility for basic status icons
export function StatusIcon({ status, className = "" }: { status: "idle" | "ok" | "error" | "pending"; className?: string }) {
  const base = `mr-3`;
  if (status === "ok") return <span className={`text-green-500 ${base} ${className}`.trim()}>✔</span>;
  if (status === "error") return <span className={`text-red-500 ${base} ${className}`.trim()}>✖</span>;
  if (status === "pending") return <span className={`text-gray-400 ${base} ${className}`.trim()}>…</span>;
  return <span className={`text-yellow-500 ${base} ${className}`.trim()}>⚠</span>;
}
