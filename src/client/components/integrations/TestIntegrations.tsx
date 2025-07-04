import React, { useState, useEffect, useRef } from "react";
import { SignInButton } from "@client/components/integrations/auth/SignInButton";
import { useAuth } from "@client/context/AuthContext";
import { supabase } from "@shared/supabase";
import { useClearTests } from "@client/utils/testIntegrationEvents";
import { useUploadThing } from "@client/utils/uploadthing";
// Note: loosely typed to avoid TS mismatch between uploadthing client data and internal UploadResponse.
import { availableIntegrations } from "@shared/availableIntegrations";
import { generateImages } from "@client/utils/integrationLLM";
import { DEFAULT_LLM_MODEL, DEFAULT_IMAGE_MODEL } from "@shared/constants";

// Icons
import { Loader2 } from "lucide-react";

// Google Maps
// @ts-ignore – library has no bundled TS types; treated as any
import { APIProvider, useMapsLibrary } from "@vis.gl/react-google-maps";
import { getGoogleMapsApiKey } from "@client/utils/googleMaps";

// ---------------------------------------------------------------------------
// Reusable UI primitives (defined locally to avoid external imports)
// ---------------------------------------------------------------------------

interface TestCardProps {
  title: React.ReactNode;
  children?: React.ReactNode;
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
        {children !== undefined && children}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Upload Photo Button (inlined here to stay self-contained)
// ---------------------------------------------------------------------------

function UploadPhotoButton({ onComplete }: { onComplete?: (files: any) => void }) {
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
    <div className="flex items-center gap-2 cursor-pointer" onClick={triggerFileDialog}>
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

// ---------------------------------------------------------------------------
// Helper – determines if the current visitor is allowed to hit real services.
// In development we always allow. In production, only the hash of the email
// defined in VITE_DEV_EMAIL_HASH is considered authorised.
// ---------------------------------------------------------------------------

// Tiny FNV-1a hash (32-bit) – deterministic & synchronous, adequate for obscurity
function hashString(str: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = (hash * 0x1000193) >>> 0; // unsigned
  }
  return hash.toString(16);
}

function useCanCallIntegrations() {
  const { session } = useAuth();
  const authorisedHash = import.meta.env.VITE_DEV_EMAIL_HASH as string | undefined;
  const sessionEmail = session?.user?.email?.toLowerCase() ?? "";
  const isAuthorisedProdUser = !!(
    authorisedHash &&
    session &&
    hashString(sessionEmail) === authorisedHash.toLowerCase()
  );
  return import.meta.env.DEV || isAuthorisedProdUser;
}

// ---------------------------------------------------------------------------
// Individual Test Widgets (all local)
// ---------------------------------------------------------------------------

// Utility for basic status icons
function StatusIcon({ status, className = "" }: { status: "idle" | "ok" | "error" | "pending"; className?: string }) {
  const base = `mr-3`;
  if (status === "ok") return <span className={`text-green-500 ${base} ${className}`.trim()}>✔</span>;
  if (status === "error") return <span className={`text-red-500 ${base} ${className}`.trim()}>✖</span>;
  if (status === "pending") return <span className={`text-gray-400 ${base} ${className}`.trim()}>…</span>;
  return <span className={`text-yellow-500 ${base} ${className}`.trim()}>⚠</span>;
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
        <div className="grid grid-cols-[20%_25%_45%_10%] items-center gap-2 w-full">
          {/* 1️⃣ Name */}
          <span>Auth Test</span>

          {/* 2️⃣ Controls */}
          <div className="w-full min-w-[10rem]"><SignInButton className="w-full px-4 py-2 text-base" /></div>

          {/* 3️⃣ Output / Info */}
          {session ? (
            <span className="pl-2 text-xs text-gray-600 dark:text-gray-400 truncate min-w-0">
              {session.user.email}
            </span>
          ) : (
            <span className="text-xs text-transparent select-none">—</span>
          )}

          {/* 4️⃣ Status */}
          <StatusIcon className="justify-self-end" status={session ? "ok" : "idle"} />
        </div>
      }
    />
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

  const canCall = useCanCallIntegrations();

  async function refreshAnimals() {
    if (!canCall) {
      setAnimals([]);
      setAnimalsStatus("ok");
      setAnimalsApiStatus("ok");
      return;
    }
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
    if (!canCall) {
      setAnimalsStatus("ok");
      return;
    }
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
        <div className="grid grid-cols-[20%_25%_45%_10%] items-center gap-2 w-full">
          {/* 1️⃣ Name */}
          <span>Database Test</span>

          {/* 2️⃣ Controls */}
          <button
            onClick={() => addAnimal(ANIMALS[Math.floor(Math.random() * ANIMALS.length)])}
            className="btn-primary w-full min-w-[10rem] px-4 py-2 text-base"
            disabled={animalsStatus === "error"}
          >
            Send
          </button>

          {/* 3️⃣ Output */}
          {animals.length > 0 ? (
            <div className="flex items-center gap-1 flex-wrap max-w-xs overflow-x-auto">
              {animals.map((a) => (
                <span
                  key={a}
                  className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-1.5 py-0.5 rounded-full"
                >
                  {a}
                </span>
              ))}
            </div>
          ) : (
            <span className="text-xs text-gray-500 dark:text-gray-400">No animals yet.</span>
          )}

          {/* 4️⃣ Status */}
          <StatusIcon className="justify-self-end" status={animalsStatus} />
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

  const canCall = useCanCallIntegrations();

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
    if (!canCall) return;
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
    if (!canCall) {
      setUploadthingApiStatus("ok");
      return;
    }
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
        <div className="grid grid-cols-[20%_25%_45%_10%] items-center gap-2 w-full">
          {/* 1️⃣ Name */}
          <span>File Upload Test</span>

          {/* 2️⃣ Control */}
          <UploadPhotoButton onComplete={(res) => setUploadResult(res)} />

          {/* 3️⃣ Output (thumbnails) */}
          <div className="flex items-center gap-1 flex-wrap">
            {uploadedImages.slice(-4).map((img) => (
              <img
                key={img.id}
                src={img.url}
                alt="Uploaded"
                className="w-8 h-8 object-cover rounded border border-gray-300"
              />
            ))}
          </div>

          {/* 4️⃣ Status */}
          <StatusIcon className="justify-self-end" status={iconStatus} />
        </div>
      }
    >
      {apiError && (
        <p className="text-sm text-red-600 dark:text-red-400 mt-4 break-all">Error: {apiError}</p>
      )}
    </TestCard>
  );
}

// ----------------------------- Organizations Test --------------------------------
function OrganizationsTest() {
  type Status = "idle" | "ok" | "error" | "pending";

  const { session } = useAuth();
  const [status, setStatus] = useState<Status>("idle");
  const [org, setOrg] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Only allow calling Supabase if the user is authorised (same rule as other tests)
  const canCall = useCanCallIntegrations();

  useEffect(() => {
    if (!session) {
      setOrg(null);
      setStatus("idle");
      setErrorMsg(null);
      return;
    }
    // Fetch existing organisation for current user on mount
    async function fetchOrg() {
      if (!canCall) {
        setStatus("idle");
        return;
      }
      try {
        const { data, error } = await supabase
          .from("organizations")
          .select("id, name")
          .eq("owner_id", session!.user.id)
          .order("created_at", { ascending: false })
          .limit(1);
        if (error) throw error;
        const firstOrg = (data ?? [])[0] ?? null;
        setOrg(firstOrg);
        setStatus(firstOrg ? "ok" : "idle");
      } catch (err: any) {
        setErrorMsg(err.message || String(err));
        setStatus("error");
      }
    }

    fetchOrg();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  useClearTests(() => {
    setStatus("idle");
    setOrg(null);
    setErrorMsg(null);
  });

  async function handleCreate() {
    if (!session) return;
    if (!canCall) {
      setOrg({ name: "Demo Org" });
      setStatus("ok");
      return;
    }
    try {
      setStatus("pending");
      const { data, error } = await supabase
        .from("organizations")
        .insert({ name: "Acme Co.", owner_id: session.user.id })
        .select("id, name")
        .single();
      if (error) throw error;
      setOrg(data);
      setStatus("ok");
    } catch (err: any) {
      setErrorMsg(err.message || String(err));
      setStatus("error");
    }
  }

  async function handleDelete() {
    if (!session || !org) return;
    if (!canCall) {
      setOrg(null);
      setStatus("idle");
      return;
    }
    try {
      setStatus("pending");
      const { error } = await supabase
        .from("organizations")
        .delete()
        .eq("id", org.id);
      if (error) throw error;
      setOrg(null);
      setStatus("idle");
    } catch (err: any) {
      setErrorMsg(err.message || String(err));
      setStatus("error");
    }
  }

  const buttonLabel = org ? "Delete Organization" : "Create Organization";
  const buttonAction = org ? handleDelete : handleCreate;

  return (
    <TestCard
      title={
        <div className="grid grid-cols-[20%_25%_45%_10%] items-center gap-2 w-full">
          {/* 1️⃣ Name */}
          <span>Organizations</span>

          {/* 2️⃣ Control */}
          <button
            onClick={buttonAction}
            className="btn-primary w-full min-w-[10rem] px-4 py-2 text-base"
            disabled={status === "pending" || !session}
          >
            {status === "pending" ? "Please wait…" : buttonLabel}
          </button>

          {/* 3️⃣ Output */}
          {org ? (
            <span className="pl-2 text-xs text-gray-600 dark:text-gray-400 truncate max-w-xs min-w-0">
              {org.name}
            </span>
          ) : (
            <span className="text-xs text-gray-500 dark:text-gray-400">No org</span>
          )}

          {/* 4️⃣ Status */}
          <StatusIcon className="justify-self-end" status={status === "pending" ? "pending" : status === "ok" ? "ok" : status === "error" ? "error" : "idle"} />
        </div>
      }
    >
      {errorMsg && (
        <p className="text-sm text-red-600 dark:text-red-400 break-all">{errorMsg}</p>
      )}
    </TestCard>
  );
}

// ----------------------------- LLM Test -----------------------------------
function LLMImageTest() {
  type Status = "idle" | "pending" | "ok" | "error";

  const [status, setStatus] = useState<Status>("idle");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const canCallLLM = useCanCallIntegrations();

  useClearTests(() => {
    setStatus("idle");
    setImageUrl(null);
    setErrorMsg(null);
  });

  async function handleGenerateImage() {
    if (!canCallLLM) {
      setStatus("ok");
      setImageUrl(null);
      return;
    }
    setStatus("pending");
    setErrorMsg(null);
    setImageUrl(null);
    try {
      const res = await generateImages(
        "A scenic landscape photograph of mountains overlooking a lake at sunset, high resolution, vibrant colors",
        DEFAULT_IMAGE_MODEL
      );
      if (res.error) throw new Error(res.error);
      if (res.urls.length === 0) throw new Error("No image URLs returned");
      setImageUrl(res.urls[0]);
      setStatus("ok");
    } catch (err: any) {
      setErrorMsg(err?.message || String(err));
      setStatus("error");
    }
  }

  return (
    <TestCard
      title={
        <div className="grid grid-cols-[20%_25%_45%_10%] items-center gap-2 w-full">
          {/* 1️⃣ Name */}
          <span className="font-medium truncate">LLM Image</span>

          {/* 2️⃣ Button */}
          <button
            onClick={handleGenerateImage}
            className="btn-primary w-full min-w-[10rem] px-4 py-2 text-base"
            disabled={status === "pending"}
          >
            Generate Image
          </button>

          {/* 3️⃣ Output */}
          <div className="flex items-center min-h-[4rem]">
            {status === "pending" && (
              <span className="text-xs text-gray-500">Generating…</span>
            )}
            {status === "ok" && imageUrl && (
              <img
                src={imageUrl}
                alt="Generated scenic landscape"
                className="w-24 h-16 object-cover rounded border border-gray-300"
              />
            )}
            {status === "idle" && (
              <span className="text-xs text-transparent select-none">—</span>
            )}
            {status === "error" && (
              <span className="text-xs text-red-500">Error</span>
            )}
          </div>

          {/* 4️⃣ Status */}
          <StatusIcon className="justify-self-end" status={status === "pending" ? "pending" : status === "ok" ? "ok" : status === "error" ? "error" : "idle"} />
        </div>
      }
    >
      {/* Error details only */}
      {status === "error" && (
        <p className="text-sm text-red-600 dark:text-red-400 break-all">{errorMsg}</p>
      )}
    </TestCard>
  );
}

function LLMTextTest() {
  type Status = "idle" | "pending" | "ok" | "error";

  const [status, setStatus] = useState<Status>("idle");
  const [textOutput, setTextOutput] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const canCallLLM = useCanCallIntegrations();

  useClearTests(() => {
    setStatus("idle");
    setTextOutput(null);
    setErrorMsg(null);
  });

  async function handleGenerateStory() {
    if (!canCallLLM) {
      setStatus("ok");
      setTextOutput("Lorem ipsum dolor sit amet.");
      return;
    }
    setStatus("pending");
    setErrorMsg(null);
    setTextOutput(null);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: DEFAULT_LLM_MODEL,
          messages: [
            {
              role: "user",
              content: "In two sentences, write a short story about any topic of your choice.",
            },
          ],
        }),
      });

      if (!res.ok) {
        const errPayload = await res.text();
        throw new Error(`HTTP ${res.status} – ${errPayload}`);
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let story = "";
      if (reader) {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          chunk.split(/\n+/).forEach((line) => {
            const cleaned = line.trim();
            if (!cleaned) return;
            const withoutPrefix = cleaned.replace(/^data:\s*/, "");
            if (withoutPrefix === "[DONE]") return;
            try {
              const json = JSON.parse(withoutPrefix);
              const delta = json?.choices?.[0]?.delta?.content;
              if (delta) story += delta;
            } catch {
              story += withoutPrefix;
            }
          });
        }
      } else {
        const raw = await res.text();
        try {
          const parsed = JSON.parse(raw);
          story = parsed?.choices?.[0]?.message?.content ?? raw;
        } catch {
          story = raw;
        }
      }

      story = story.trim();
      // Fallback cleanup for non-JSON SSE formats like "f:{...}0:\"Hello\"0:\" world\"e:{...}d:{...}"
      // If the accumulated string still contains token prefixes (e.g. `0:"text"`) try to extract the quoted
      // segments and concatenate them so the user only sees the intended story text.
      if (/\d+:\"/.test(story)) {
        const tokenMatches = [...story.matchAll(/\d+:\"([^\"]*)\"/g)];
        if (tokenMatches.length > 0) {
          story = tokenMatches.map((m) => m[1]).join("").trim();
        }
      }
      // Remove possible leading metadata sections (e.g. "f:{...}", "e:{...}", "d:{...}") left over after parsing
      story = story.replace(/^f:\{[^}]*\}/, "").replace(/e:\{[^}]*\}/g, "").replace(/d:\{[^}]*\}/g, "").trim();

      setTextOutput(story);
      setStatus("ok");
    } catch (err: any) {
      setErrorMsg(err?.message || String(err));
      setStatus("error");
    }
  }

  return (
    <TestCard
      title={
        <div className="grid grid-cols-[20%_25%_45%_10%] items-center gap-2 w-full">
          <span className="font-medium truncate">LLM Story</span>

          <button
            onClick={handleGenerateStory}
            className="btn-primary w-full min-w-[10rem] px-4 py-2 text-base"
            disabled={status === "pending"}
          >
            Generate Story
          </button>

          <div className="text-xs whitespace-pre-wrap text-gray-700 dark:text-gray-300 break-words">
            {status === "pending"
              ? "Generating…"
              : textOutput || "—"}
          </div>

          <div className="justify-self-end">
            <StatusIcon status={status === "pending" ? "pending" : status === "ok" ? "ok" : status === "error" ? "error" : "idle"} />
          </div>
        </div>
      }
    >
      {status === "error" && (
        <p className="text-sm text-red-600 dark:text-red-400 break-all">{errorMsg}</p>
      )}
    </TestCard>
  );
}

// -------------------------- Analytics Test --------------------------------
function AnalyticsTest() {
  const [status, setStatus] = useState<"idle" | "ok" | "error" | "pending">("idle");

  const canCall = useCanCallIntegrations();

  useClearTests(() => setStatus("idle"));

  async function sendTestEvent() {
    if (!canCall) {
      setStatus("ok");
      return;
    }
    try {
      setStatus("pending");
      const ph = (window as any).posthog;
      if (ph) {
        ph.capture("docs_test_event", { ts: Date.now() });
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
        <div className="grid grid-cols-[20%_25%_45%_10%] items-center gap-2 w-full">
          {/* 1️⃣ Name */}
          <span>Analytics</span>

          {/* 2️⃣ Control */}
          <button
            onClick={sendTestEvent}
            className="btn-primary w-full min-w-[10rem] px-4 py-2 text-base"
            disabled={status === "pending"}
          >
            Send Test Event
          </button>

          {/* 3️⃣ Output */}
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {status === "ok" ? "Event sent" : ""}
          </span>

          {/* 4️⃣ Status */}
          <StatusIcon className="justify-self-end" status={status} />
        </div>
      }
    >
      <></>
    </TestCard>
  );
}

// -------------------------- Billing (Polar) Test ------------------------
function BillingTest() {
  const [status, setStatus] = useState<"idle" | "ok" | "error" | "pending">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [products, setProducts] = useState<any[]>([]);

  const canCall = useCanCallIntegrations();

  useClearTests(() => {
    setStatus("idle");
    setErrorMsg(null);
    setProducts([]);
  });

  async function pingPolar() {
    if (!canCall) {
      setStatus("ok");
      return;
    }
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
    if (!canCall) return;
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
        <div className="grid grid-cols-[20%_25%_45%_10%] items-center gap-2 w-full">
          {/* 1️⃣ Name */}
          <span>Billing</span>

          {/* 2️⃣ Control */}
          <button
            onClick={async () => {
              await pingPolar();
              if (status !== "error") {
                await fetchProducts();
              }
            }}
            className="btn-primary w-full min-w-[10rem] px-4 py-2 text-base"
            disabled={status === "pending"}
          >
            Check Billing
          </button>

          {/* 3️⃣ Output */}
          {products.length > 0 ? (
            <span className="text-xs text-gray-600 dark:text-gray-400 truncate">
              {products.length} products
            </span>
          ) : (
            <span className="text-xs text-transparent select-none">—</span>
          )}

          {/* 4️⃣ Status */}
          <StatusIcon className="justify-self-end" status={status === "pending" ? "pending" : status === "ok" ? "ok" : status === "error" ? "error" : "idle"} />
        </div>
      }
    >
      {status === "error" && (
        <p className="text-sm text-red-600 dark:text-red-400 break-all">{errorMsg}</p>
      )}
      {status === "ok" && products.length === 0 && <></>}
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

  const canCall = useCanCallIntegrations();

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

  return (
    <TestCard
      title={
        <div className="grid grid-cols-[20%_25%_45%_10%] items-center gap-2 w-full">
          {/* 1️⃣ Name */}
          <span>Bot Detection</span>

          {/* 2️⃣ Control */}
          <button
            onClick={() => setStatus("pending")}
            className="btn-primary w-full min-w-[10rem] px-4 py-2 text-base"
            disabled={status === "pending"}
          >
            Check
          </button>

          {/* 3️⃣ Output */}
          {status === "success" ? (
            <span className="text-xs text-gray-600 dark:text-gray-400 truncate">verified</span>
          ) : (
            <span className="text-xs text-transparent select-none">—</span>
          )}

          {/* 4️⃣ Status */}
          <StatusIcon className="justify-self-end" status={status === "pending" ? "pending" : status === "success" ? "ok" : "error"} />
        </div>
      }
    >
      {status === "error" ? (
        <p className="text-sm text-red-500">
          Your request was flagged as a bot or the verification failed.
        </p>
      ) : <></>}
    </TestCard>
  );
}

// -------------------------- Maps Autocomplete Test ------------------------
function MapsAutocompleteTest() {
  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle");
  const [selected, setSelected] =
    useState<any>(null);

  // Retrieve API key using shared helper (env var or global)
  const API_KEY = getGoogleMapsApiKey();

  function AutocompleteField() {
    const inputRef = useRef<HTMLInputElement>(null);
    const places = useMapsLibrary("places");

    useEffect(() => {
      if (!places || !inputRef.current) return;

      // @ts-ignore – useMapsLibrary returns the correct constructor at runtime
      const ac = new (places as any).Autocomplete(inputRef.current, {
        fields: ["geometry", "name", "formatted_address"],
      });
      ac.addListener("place_changed", () => {
        const place = (ac as any).getPlace();
        setSelected(place);
        setStatus("ok");
      });
    }, [places]);

    return (
      <input
        ref={inputRef}
        placeholder="Search place..."
        className="px-3 py-2 border border-gray-300 rounded w-full"
      />
    );
  }

  return (
    <TestCard
      title={
        <div className="grid grid-cols-[20%_25%_45%_10%] items-center gap-2 w-full">
          {/* 1️⃣ Name */}
          <span>Maps Autocomplete</span>

          {/* 2️⃣ Control (input field spans 2 columns) */}
          <div className="col-span-2 w-full">
            <APIProvider apiKey={API_KEY} libraries={["places"]}>
              <AutocompleteField />
            </APIProvider>
          </div>

          {/* 4️⃣ Status */}
          <StatusIcon className="justify-self-end" status={status} />
        </div>
      }
    >
      {selected && (
        <p className="text-xs text-gray-600 dark:text-gray-400 break-words">
          {selected.formatted_address || selected.name}
        </p>
      )}
    </TestCard>
  );
}

// ---------------------------- Placeholder Tests ---------------------------
function PlaceholderDetails({ title }: { title: string }) {
  return (
    <details className="mb-10 bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
      <summary className="cursor-pointer select-none px-6 py-4 font-semibold text-lg bg-amber-50 dark:bg-amber-900/20 flex items-center gap-2">
        <span>{title}</span>
      </summary>
      <div className="p-6">
        <p className="text-sm text-gray-600 dark:text-gray-400">{title} integration tests will be added here.</p>
      </div>
    </details>
  );
}

// ---------------------------------------------------------------------------
// Email Test (Resend)
// ---------------------------------------------------------------------------

function EmailTest() {
  // Use a neutral placeholder recipient to avoid exposing personal email addresses.
  const to = "owner@example.com"; // Will be replaced locally if needed.
  const subject = "Hello World";
  const html = "<p>Congrats on sending your <strong>first email</strong>!</p>";

  const [status, setStatus] = useState<"idle" | "ok" | "error" | "pending">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const canCall = useCanCallIntegrations();

  useClearTests(() => {
    setStatus("idle");
    setErrorMsg(null);
  });

  async function sendEmail() {
    if (!canCall) {
      setStatus("ok");
      return;
    }
    try {
      setStatus("pending");
      const res = await fetch("/api/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to, subject, html }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
      setStatus("ok");
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err?.message || String(err));
    }
  }

  return (
    <TestCard
      title={
        <div className="grid grid-cols-[20%_25%_45%_10%] items-center gap-2 w-full">
          {/* 1️⃣ Name */}
          <span>Email</span>

          {/* 2️⃣ Control */}
          <button
            onClick={sendEmail}
            className="btn-primary w-full min-w-[10rem] px-4 py-2 text-base flex items-center gap-2"
            disabled={status === "pending"}
          >
            Send Email
          </button>

          {/* 3️⃣ Output – intentionally generic so no personal email is revealed */}
          <span className="text-xs text-gray-600 dark:text-gray-400 truncate">to owner</span>

          {/* 4️⃣ Status */}
          <StatusIcon className="justify-self-end" status={status === "pending" ? "pending" : status === "ok" ? "ok" : status === "error" ? "error" : "idle"} />
        </div>
      }
    >
      {errorMsg && (
        <p className="text-sm text-red-600 dark:text-red-400 break-all">{errorMsg}</p>
      )}
    </TestCard>
  );
}

// ---------------------------------------------------------------------------
// Main Export
// ---------------------------------------------------------------------------

// Add props interface for selected integration keys and update function signature
interface TestIntegrationsProps {
  /**
   * Integration keys that should be displayed. If empty or omitted, all tests are shown.
   */
  selectedKeys?: string[];
}

export default function TestIntegrations({ selectedKeys = [] }: TestIntegrationsProps) {
  // Helper to decide if a given integration test should be rendered
  const shouldShow = (key: string) => selectedKeys.length === 0 || selectedKeys.includes(key);

  return (
    <div className="space-y-10 text-base w-full max-w-3xl mx-auto">
      {/* Core tests with real functionality */}
      {shouldShow("auth") && <AuthTest />}
      {shouldShow("database") && <DatabaseTest />}
      {shouldShow("uploads") && <UploadsTest />}
      {shouldShow("organizations") && <OrganizationsTest />}
      {shouldShow("email") && <EmailTest />}
      {shouldShow("llm-image") && <LLMImageTest />}
      {shouldShow("llm") && <LLMTextTest />}
      {shouldShow("analytics") && <AnalyticsTest />}
      {shouldShow("billing") && <BillingTest />}
      {/* Bot detection does not map to a specific integration; always show if any key selected */}
      {selectedKeys.length > 0 && <BotDetectionTest />}
      {shouldShow("maps") && <MapsAutocompleteTest />}

      {/* Placeholder tests – keep for integrations not yet available */}
      {shouldShow("realtime") && <RealtimeChatTest />}

    </div>
  );
}

// -------------------------- Realtime Chat Test ----------------------------
function RealtimeChatTest() {
  type Status = "idle" | "ok" | "pending" | "error";

  const [status, setStatus] = useState<Status>("idle");
  const [lastMsg, setLastMsg] = useState<string | null>(null);

  const userIdRef = useRef("user-" + Math.random().toString(36).slice(2, 9));
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  const canCall = useCanCallIntegrations();

  // Reset when global clear is triggered
  useClearTests(() => {
    setStatus("idle");
    setLastMsg(null);
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
  });

  // Subscribe once on mount
  useEffect(() => {
    if (!canCall) {
      setStatus("ok");
      return;
    }

    const channel = supabase.channel("vs-realtime-chat");
    channel
      .on("broadcast", { event: "msg" }, (payload) => {
        const { user, text } = payload.payload as { user: string; text: string };
        setLastMsg(`${user}: ${text}`);
        setStatus("ok");
      })
      .subscribe((subscriptionStatus) => {
        if (subscriptionStatus === "SUBSCRIBED") setStatus("idle");
      });

    channelRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
    };
  }, [canCall]);

  async function sendMessage() {
    if (!channelRef.current) return;
    const text = "See this on another tab?";
    setStatus("pending");
    // Optimistically show our own message
    setLastMsg(`${userIdRef.current}: ${text}`);
    channelRef.current
      .send({
        type: "broadcast",
        event: "msg",
        payload: { user: userIdRef.current, text },
      })
      .then(() => setStatus("ok"))
      .catch(() => setStatus("error"));
  }

  return (
    <TestCard
      title={
        <div className="grid grid-cols-[20%_25%_45%_10%] items-center gap-2 w-full">
          {/* 1️⃣ Name */}
          <span>Realtime Msg</span>

          {/* 2️⃣ Control */}
          <button
            onClick={sendMessage}
            className="btn-primary w-full min-w-[10rem] px-4 py-2 text-base"
            disabled={status === "pending"}
          >
            Send Message
          </button>

          {/* 3️⃣ Output */}
          {lastMsg ? (
            <span className="text-xs text-gray-600 dark:text-gray-400 truncate max-w-sm min-w-0">
              {lastMsg}
            </span>
          ) : (
            <span className="text-xs text-gray-500 dark:text-gray-400">No messages yet.</span>
          )}

          {/* 4️⃣ Status */}
          <StatusIcon className="justify-self-end" status={status === "pending" ? "pending" : status === "ok" ? "ok" : status === "error" ? "error" : "idle"} />
        </div>
      }
    />
  );
} 