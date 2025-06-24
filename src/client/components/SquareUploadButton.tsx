import { UploadButton } from "@client/utils/uploadthing";
import type { UploadResponse } from "@client/utils/uploadthing";
import type { ClientUploadedFileData } from "uploadthing/types";

interface Props {
  /** Optional callback fired when upload completes */
  onUploadComplete?: (files: UploadResponse) => void;
  /** Optional additional Tailwind classes for the wrapper */
  className?: string;
}

/**
 * SquareUploadButton renders a 96×96px upload trigger that forwards the
 * upload response to the caller. The component no longer shows an inline
 * preview thumbnail; instead, callers should render their own image feed or
 * gallery once they receive the upload response.
 */
export function SquareUploadButton({ onUploadComplete, className }: Props) {
  return (
    <div className={`flex items-center gap-4 ${className ?? ""}`.trim()}>
      <UploadButton
        endpoint="imageUploader"
        onClientUploadComplete={(res: ClientUploadedFileData<null>[]) => {
          // Forward the upload response to parent components.
          onUploadComplete?.(res as unknown as UploadResponse);
        }}
        onUploadError={(error) => {
          alert("Upload failed: " + error.message);
        }}
        appearance={{
          button({ ready }) {
            // Purple gradient background similar to previous btn-primary, square shape
            return `relative w-24 h-24 rounded-xl flex items-center justify-center text-white shadow-lg transition-all duration-200 bg-gradient-to-br from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-transparent ${
              ready ? "" : "opacity-50 cursor-not-allowed"
            }`;
          },
        }}
        content={{
          button({ ready }) {
            return ready ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-10 h-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
                  fill="currentColor"
                />
              </svg>
            );
          },
        }}
      />

      {/* Inline preview removed to avoid duplication with global image feed */}
    </div>
  );
} 