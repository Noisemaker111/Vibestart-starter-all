import { useState, useEffect } from "react";
import { SquareUploadButton } from "@client/components/SquareUploadButton";

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
    <details className="mb-10 bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
      <summary className="cursor-pointer select-none px-6 py-4 font-semibold text-lg bg-green-50 dark:bg-green-900/20 flex items-center gap-2">
        <span>File Upload Test</span>
        <StatusIcon status={uploadResult ? "ok" : uploadthingApiStatus} />
      </summary>
      <div className="p-6">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <SquareUploadButton onUploadComplete={(res: any) => setUploadResult(res)} />
        </div>

        {apiError && (
          <p className="text-sm text-red-600 dark:text-red-400 mt-4 break-all">Error: {apiError}</p>
        )}

        {uploadedImages.length > 0 && (
          <div className="mt-6 grid grid-cols-3 sm:grid-cols-4 gap-4">
            {uploadedImages.map((img) => (
              <img
                key={img.id}
                src={img.url}
                alt="Uploaded"
                className="w-24 h-24 object-cover rounded-lg"
              />
            ))}
          </div>
        )}
      </div>
    </details>
  );
}
