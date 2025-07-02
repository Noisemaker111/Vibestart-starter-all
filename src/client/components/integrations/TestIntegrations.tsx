import React, { useState, useEffect, useRef } from "react";
import { SignInButton } from "@client/components/integrations/auth/SignInButton";
import { useAuth } from "@client/context/AuthContext";
import { supabase } from "@shared/supabase";
import { useClearTests } from "@client/utils/testIntegrationEvents";
import { useUploadThing } from "@client/utils/uploadthing";
import type { UploadResponse } from "@client/utils/uploadthing";
import ChatBox from "@client/components/integrations/LLM/ChatBox";

// Icons
import { Loader2 } from "lucide-react";

// ---------------------------------------------------------------------------
// Reusable UI primitives (defined locally to avoid external imports)
// ---------------------------------------------------------------------------

interface TestCardProps {
  title: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

function TestCard({ title, children, className = "" }: TestCardProps) {
  return (
    <div
      className={
        `mb-10 w-full max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-xl border border-gray-300 dark:border-gray-700 overflow-hidden ${className}`.trim()
      }
    >
      <div className="p-6 space-y-4">
        <div className="font-semibold text-lg flex items-center gap-2">{title}</div>
        {children}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Upload Photo Button (inlined here to stay self-contained)
// ---------------------------------------------------------------------------

function UploadPhotoButton({ onComplete }: { onComplete?: (files: UploadResponse) => void }) {
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
    onClientUploadComplete: (res) => {
      setProgress(0);
      onComplete?.(res as UploadResponse);
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
    <div className="flex items-center gap-2 cursor-pointer" onClick={triggerFileDialog}>
      <button
        type="button"
        className="btn-primary px-4 py-2 text-base"
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

// ---------------------------------------------------------------------------
// Individual Test Widgets (all local)
// ---------------------------------------------------------------------------

// Utility for basic status icons
function StatusIcon({ status }: { status: "idle" | "ok" | "error" | "pending" }) {
  if (status === "ok") return <span className="text-green-500 ml-2">✔</span>;
  if (status === "error") return <span className="text-red-500 ml-2">✖</span>;
  if (status === "pending") return <span className="text-gray-400 ml-2">…</span>;
  return <span className="text-yellow-500 ml-2">⚠</span>;
}

// ----------------------------- Auth Test ----------------------------------
function AuthTest() {
  const { session } = useAuth();

  useClearTests(() => {
    supabase.auth.signOut().catch(() => {});
  });

  return (
    <TestCard
      title={
        <div className="flex items-center gap-3 flex-wrap">
          <span>Auth Test</span>
          <StatusIcon status={session ? "ok" : "idle"} />
          {session && (
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Logged in as <strong>{session.user.email}</strong>
            </span>
          )}
          <SignInButton />
        </div>
      }
    >
      {/* No body content */}
    </TestCard>
  );
}

// -------------------------- Database Test ---------------------------------
const ANIMALS = [
  "Cat",
  "Dog",
  "Fox",
  "Dolphin",
  "Elephant",
  "Lion",
  "Tiger",
  "Panda",
  "Rabbit",
  "Koala",
];

function DatabaseTest() {
  const [animalInput, setAnimalInput] = useState(ANIMALS[0]);
  const [animals, setAnimals] = useState<string[]>([]);
  const [animalError, setAnimalError] = useState<string | null>(null);
  const [animalsStatus, setAnimalsStatus] = useState<"idle" | "ok" | "error">("idle");
  const [animalsApiStatus, setAnimalsApiStatus] = useState<"idle" | "ok" | "error">("idle");

  async function refreshAnimals() {
    setAnimalError(null);
    try {
      const res = await fetch("/api/animals");
      if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
      const data = (await res.json()) as { name: string }[];
      const names = data?.map((d) => d.name) ?? [];
      setAnimals(names);
      setAnimalsApiStatus(names.length > 0 ? "ok" : "idle");
      setAnimalsStatus(names.length > 0 ? "ok" : "idle");
    } catch (err: any) {
      setAnimalsApiStatus("error");
      setAnimalError(err.message || String(err));
    }
  }

  async function addAnimal(name: string) {
    if (!name) return;
    setAnimalError(null);
    try {
      const res = await fetch("/api/animals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) {
        const errorPayload = await res.json().catch(() => ({}));
        throw new Error(errorPayload?.error || `HTTP ${res.status}`);
      }
      setAnimalInput(ANIMALS[0]);
      setAnimalsStatus("ok");
      await refreshAnimals();
    } catch (err: any) {
      setAnimalsStatus("error");
      setAnimalError(err.message || String(err));
    }
  }

  useEffect(() => {
    if (import.meta.env.DEV) refreshAnimals();
  }, []);

  useClearTests(() => {
    setAnimalInput(ANIMALS[0]);
    setAnimals([]);
    setAnimalError(null);
    setAnimalsStatus("idle");
    setAnimalsApiStatus("idle");
    fetch("/api/animals", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: "{}" })
      .then(() => refreshAnimals())
      .catch(() => {});
  });

  return (
    <TestCard
      title={
        <div className="flex items-center gap-3 flex-wrap w-full">
          <span>Database Test</span>
          <StatusIcon status={animalsStatus} />
          <select
            value={animalInput}
            onChange={(e) => setAnimalInput(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm"
          >
            {ANIMALS.map((a) => (
              <option key={a}>{a}</option>
            ))}
          </select>
          <button
            onClick={() => addAnimal(animalInput)}
            className="btn-primary px-3 py-1 text-sm"
            disabled={animalsStatus === "error"}
          >
            Send
          </button>
          {animals.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap ml-4 max-w-xs overflow-x-auto">
              {animals.map((a) => (
                <span
                  key={a}
                  className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-2 py-0.5 rounded-full"
                >
                  {a}
                </span>
              ))}
            </div>
          )}
          {animals.length === 0 && (
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-4">No animals yet.</span>
          )}
        </div>
      }
    >
      {animalError && (
        <p className="text-sm text-red-600 dark:text-red-400 break-all mt-2">Error: {animalError}</p>
      )}
    </TestCard>
  );
}

// ---------------------------- Uploads Test --------------------------------
function UploadsTest() {
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [uploadedImages, setUploadedImages] = useState<{ id: number; url: string }[]>([]);
  const [uploadthingApiStatus, setUploadthingApiStatus] = useState<"idle" | "ok" | "error">("idle");
  const [apiError, setApiError] = useState<string | null>(null);

  useClearTests(() => {
    setUploadResult(null);
    setUploadedImages([]);
    setUploadthingApiStatus("idle");
    setApiError(null);
    fetch("/api/images", { method: "DELETE" })
      .then(() => checkUploadthingApi())
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

  useEffect(() => {
    if (import.meta.env.DEV) {
      fetchImages();
      checkUploadthingApi();
    }
  }, []);

  useEffect(() => {
    if (uploadResult && import.meta.env.DEV) {
      fetchImages();
      checkUploadthingApi();
    }
  }, [uploadResult]);

  const iconStatus: "idle" | "ok" | "error" = ((): any => {
    const hasUploaded =
      (uploadResult && Array.isArray(uploadResult) && uploadResult.length > 0) || uploadedImages.length > 0;
    return hasUploaded ? "ok" : uploadthingApiStatus === "error" ? "error" : "idle";
  })();

  return (
    <TestCard
      title={
        <div className="flex items-center gap-3 flex-wrap">
          <span>File Upload Test</span>
          <StatusIcon status={iconStatus} />
          <UploadPhotoButton onComplete={(res) => setUploadResult(res)} />
          {uploadedImages.slice(-4).map((img) => (
            <img
              key={img.id}
              src={img.url}
              alt="Uploaded"
              className="w-10 h-10 object-cover rounded-lg border border-gray-300"
            />
          ))}
        </div>
      }
    >
      {apiError && (
        <p className="text-sm text-red-600 dark:text-red-400 mt-4 break-all">Error: {apiError}</p>
      )}
    </TestCard>
  );
}

// ----------------------------- LLM Test -----------------------------------
function LLMTest() {
  const [widgetKey, setWidgetKey] = useState(0);
  useClearTests(() => setWidgetKey((k) => k + 1));
  // ChatBox now auto-detects whether the prompt should generate text, JSON or an image
  return <ChatBox key={widgetKey} />;
}

// -------------------------- Analytics Test --------------------------------
function AnalyticsTest() {
  const [status, setStatus] = useState<"idle" | "ok" | "error" | "pending">("idle");

  useClearTests(() => setStatus("idle"));

  async function sendTestEvent() {
    try {
      setStatus("pending");
      // @ts-ignore – posthog global may exist
      if (window.posthog) {
        window.posthog.capture("docs_test_event", { ts: Date.now() });
        setStatus("ok");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <TestCard
      title={
        <div className="flex items-center gap-3 flex-wrap">
          <span>Analytics (PostHog)</span>
          <StatusIcon status={status} />
          <button
            onClick={sendTestEvent}
            className="btn-primary px-3 py-1 text-sm"
            disabled={status === "pending"}
          >
            Send Test Event
          </button>
        </div>
      }
    >
      {status === "ok" && (
        <p className="text-sm text-green-600 dark:text-green-400">Event sent! Check PostHog.</p>
      )}
      {status === "error" && (
        <p className="text-sm text-red-600 dark:text-red-400">Failed to send event. Is PostHog initialised?</p>
      )}
    </TestCard>
  );
}

// -------------------------- Billing (Polar) Test ------------------------
function BillingTest() {
  const [status, setStatus] = useState<"idle" | "ok" | "error" | "pending">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [products, setProducts] = useState<any[]>([]);

  useClearTests(() => {
    setStatus("idle");
    setErrorMsg(null);
    setProducts([]);
  });

  async function pingPolar() {
    try {
      setStatus("pending");
      const res = await fetch("/api/polar?mode=ping");
      const data = await res.json().catch(() => ({}));
      if (res.ok && data?.ok) {
        setStatus("ok");
      } else {
        setStatus("error");
        setErrorMsg(data?.error || `HTTP ${res.status}`);
      }
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err?.message || String(err));
    }
  }

  async function fetchProducts() {
    try {
      setStatus("pending");
      const res = await fetch("/api/polar?mode=products");
      const data = await res.json().catch(() => ({}));
      if (res.ok && Array.isArray(data?.products)) {
        setProducts(data.products);
        setStatus("ok");
      } else {
        setStatus("error");
        setErrorMsg(data?.error || `HTTP ${res.status}`);
      }
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err?.message || String(err));
    }
  }

  return (
    <TestCard
      title={
        <div className="flex items-center gap-3 flex-wrap">
          <span>Billing (Polar)</span>
          <StatusIcon status={status === "pending" ? "pending" : status === "ok" ? "ok" : status === "error" ? "error" : "idle"} />
          <button
            onClick={pingPolar}
            className="btn-primary px-3 py-1 text-sm"
            disabled={status === "pending"}
          >
            Ping API
          </button>
          <button
            onClick={fetchProducts}
            className="btn-secondary px-3 py-1 text-sm"
            disabled={status === "pending"}
          >
            List Products
          </button>
        </div>
      }
    >
      {status === "error" && (
        <p className="text-sm text-red-600 dark:text-red-400 break-all">{errorMsg}</p>
      )}
      {status === "ok" && products.length === 0 && (
        <p className="text-sm text-green-600 dark:text-green-400">Polar API reachable!</p>
      )}
      {products.length > 0 && (
        <ul className="mt-2 space-y-1">
          {products.slice(0,5).map((p:any)=> (
            <li key={p.id} className="text-xs text-gray-700 dark:text-gray-300">
              {p.name} – {p.id}
            </li>
          ))}
          {products.length > 5 && (
            <li className="text-xs text-gray-500">and {products.length - 5} more…</li>
          )}
        </ul>
      )}
    </TestCard>
  );
}

// ------------------------ Bot Detection Test ------------------------------
function BotDetectionTest() {
  const [status, setStatus] = useState<"pending" | "success" | "error">("pending");

  useEffect(() => {
    fetch("/api/botid")
      .then(async (res) => {
        if (!res.ok) throw new Error("Network error");
        const data = (await res.json()) as { isBot?: boolean };
        setStatus(data?.isBot ? "error" : "success");
      })
      .catch(() => setStatus("error"));
  }, []);

  useClearTests(() => {
    setStatus("pending");
    fetch("/api/botid")
      .then(async (res) => {
        if (!res.ok) throw new Error("Network error");
        const data = (await res.json()) as { isBot?: boolean };
        setStatus(data?.isBot ? "error" : "success");
      })
      .catch(() => setStatus("error"));
  });

  const renderStatusIcon = () => {
    switch (status) {
      case "success":
        return <span className="text-green-500">✓</span>;
      case "error":
        return <span className="text-red-500">✕</span>;
      default:
        return null;
    }
  };

  return (
    <TestCard
      title={
        <>
          <span>Bot Detection (Vercel BotID)</span>
          {status === "pending" ? (
            <span className="ml-2 text-gray-400 text-xs">pending...</span>
          ) : (
            <span className="ml-2">{renderStatusIcon()}</span>
          )}
        </>
      }
    >
      {status === "error" && (
        <p className="text-sm text-red-500">
          Your request was flagged as a bot or the verification failed.
        </p>
      )}
    </TestCard>
  );
}

// ---------------------------- Placeholder Tests ---------------------------
function SoonBadge() {
  return (
    <span className="ml-2 bg-yellow-900/30 text-yellow-300 text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded-md">
      soon
    </span>
  );
}

function PlaceholderDetails({ title }: { title: string }) {
  return (
    <details className="mb-10 bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
      <summary className="cursor-pointer select-none px-6 py-4 font-semibold text-lg bg-amber-50 dark:bg-amber-900/20 flex items-center gap-2">
        <span>{title}</span>
        <SoonBadge />
      </summary>
      <div className="p-6">
        <p className="text-sm text-gray-600 dark:text-gray-400">{title} integration tests will be added here.</p>
      </div>
    </details>
  );
}

// ---------------------------------------------------------------------------
// Main Export
// ---------------------------------------------------------------------------

export default function TestIntegrations() {
  return (
    <div className="space-y-10 text-base w-full max-w-3xl mx-auto">
      {/* Core tests with real functionality */}
      <AuthTest />
      <DatabaseTest />
      <UploadsTest />
      <LLMTest />
      <AnalyticsTest />
      <BillingTest />
      <BotDetectionTest />

      {/* Placeholder tests */}
      <PlaceholderDetails title="External API" />
      <PlaceholderDetails title="Email" />
      <PlaceholderDetails title="Files" />
      <PlaceholderDetails title="Maps / Address Autocomplete" />
      <PlaceholderDetails title="Notifications" />
      <PlaceholderDetails title="Organisations" />
      <PlaceholderDetails title="Realtime Chat" />
      <PlaceholderDetails title="SMS" />
      <PlaceholderDetails title="Whiteboard" />
    </div>
  );
} 