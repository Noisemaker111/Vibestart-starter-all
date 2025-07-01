import { useState, useEffect } from "react";
import { UploadButton } from "@client/utils/uploadthing";
import { useClearTests } from "@client/utils/testIntegrationEvents";
import { TestCard } from "@client/components/docs/test-integrations/TestCard";

// Local status indicator util
function StatusIcon({ status }: { status: "idle" | "ok" | "error" }) {
  if (status === "ok") return <span className="text-green-500 ml-2">✔</span>;
  if (status === "error") return <span className="text-red-500 ml-2">✖</span>;
  return <span className="text-yellow-500 ml-2">⚠</span>;
}

export default function DocsTestUploads() {
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [uploadedImages, setUploadedImages] = useState<{ id: number; url: string }[]>([]);
  const [uploadthingApiStatus, setUploadthingApiStatus] = useState<"idle" | "ok" | "error">("idle");
  const [apiError, setApiError] = useState<string | null>(null);

  // Listen for global clear
  useClearTests(() => {
    setUploadResult(null);
    setUploadedImages([]);
    setUploadthingApiStatus("idle");
    setApiError(null);

    fetch("/api/images", { method: "DELETE" })
      .then(() => {
        // after deletion, recheck health
        checkUploadthingApi();
      })
      .catch(() => {});
  });

  async function fetchImages() {
    if (!import.meta.env.DEV) return;
    try {
      const res = await fetch("/api/images");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setUploadedImages(data);
    } catch (err) {
      console.error("Failed to fetch images", err);
    }
  }

  // Check uploadthing endpoint to verify health
  async function checkUploadthingApi() {
    setApiError(null);
    try {
      const res = await fetch("/api/uploadthing", { method: "GET" });
      if (!res.ok) throw new Error(`uploadthing HTTP ${res.status}`);
      setUploadthingApiStatus("ok");
    } catch (err: any) {
      setUploadthingApiStatus("error");
      setApiError(err.message || String(err));
    }
  }

  // initial fetch on mount
  useEffect(() => {
    if (import.meta.env.DEV) {
      fetchImages();
      checkUploadthingApi();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // re-run health & fetch after new upload
  useEffect(() => {
    if (uploadResult && import.meta.env.DEV) {
      fetchImages();
      checkUploadthingApi();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadResult]);

  return (
    <TestCard
      headerClassName="bg-green-50 dark:bg-green-900/20"
      title={
        <div className="flex items-center gap-3 flex-wrap">
          <span>File Upload Test</span>
          {(() => {
            const hasUploaded =
              (uploadResult && Array.isArray(uploadResult) && uploadResult.length > 0) ||
              uploadedImages.length > 0;
            const iconStatus: "idle" | "ok" | "error" = hasUploaded
              ? "ok"
              : uploadthingApiStatus === "error"
              ? "error"
              : "idle";
            return <StatusIcon status={iconStatus} />;
          })()}
          {/* Inline upload button */}
          <UploadButton
            endpoint="imageUploader"
            onClientUploadComplete={(res) => setUploadResult(res)}
            appearance={{
              button() {
                return "btn-primary px-3 py-1 text-sm";
              },
            }}
            content={{ button: () => "Upload Photo" }}
          />
        </div>
      }
    >
      {apiError && (
        <p className="text-sm text-red-600 dark:text-red-400 mt-4 break-all">Error: {apiError}</p>
      )}

      {uploadedImages.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
          {uploadedImages.map((img) => (
            <img key={img.id} src={img.url} alt="Uploaded" className="w-24 h-24 object-cover rounded-lg" />
          ))}
        </div>
      )}
    </TestCard>
  );
}
