import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { supabase } from "@shared/supabase";
import { Loader2 } from "lucide-react";
import { useUploadThing, generateImages } from "@pages/utils/index";
import { APIProvider, useMapsLibrary } from "@vis.gl/react-google-maps";
import { useAuth } from "@pages/components/AuthContext";
import { SignInButton } from "@pages/components/SignInButton";

// Clear Tests Event
export const CLEAR_TESTS_EVENT = "vs-clear-tests";
export const dispatchClearTests = () => window.dispatchEvent(new Event(CLEAR_TESTS_EVENT));
export const useClearTests = (handler: () => void) =>
  useEffect(() => {
    window.addEventListener(CLEAR_TESTS_EVENT, handler);
    return () => window.removeEventListener(CLEAR_TESTS_EVENT, handler);
  }, [handler]);

// UI Primitives
interface TestCardProps { title: React.ReactNode; children?: React.ReactNode; className?: string }
export const TestCard = ({ title, children, className = "" }: TestCardProps) => (
  <div className={`mb-10 w-full max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-xl border border-gray-300 dark:border-gray-700 overflow-hidden ${className}`}>
    <div className="p-6 space-y-4">{title}{children}</div>
  </div>
);

export const UploadPhotoButton = ({ onComplete }: { onComplete?: (files: any) => void }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState(0);
  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onUploadBegin: () => setProgress(0),
    onUploadProgress: (p: any) => setProgress(typeof p === "number" ? Math.round(p) : Math.round(p?.progress)),
    onClientUploadComplete: (res: any) => { setProgress(0); onComplete?.(res); },
  });
  const handleFiles = (files: File[]) => files.length && startUpload(files);
  return (
    <div className="flex items-center gap-2">
      <button type="button" className="btn-primary w-full min-w-[8rem] px-4 py-2 text-base" onClick={() => inputRef.current?.click()} disabled={isUploading}>
        Upload Photo
      </button>
      <input
        type="file"
        accept="image/*"
        multiple={false}
        ref={inputRef}
        className="hidden"
        onChange={(e) => { handleFiles(Array.from(e.target.files || [])); e.target.value = ""; }}
      />
      {isUploading && <div className="flex items-center gap-1"><Loader2 className="w-4 h-4 animate-spin text-gray-600" /><span className="text-xs tabular-nums">{progress}%</span></div>}
    </div>
  );
};

export const StatusIcon = ({ status, className = "" }: { status: "idle" | "ok" | "error" | "pending"; className?: string }) => {
  const base = `mr-3 ${className}`;
  return <span className={base + (status === "ok" ? " text-green-500" : status === "error" ? " text-red-500" : status === "pending" ? " text-gray-400" : " text-yellow-500")}>
    {status === "ok" ? "✔" : status === "error" ? "✖" : status === "pending" ? "…" : "⚠"}
  </span>;
};

// Utilities
const hashString = (str: string): string => {
  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) hash = ((hash ^ str.charCodeAt(i)) * 0x1000193) >>> 0;
  return hash.toString(16);
};

export const useCanCallIntegrations = () => {
  const { session } = useAuth();
  const authorisedHash = import.meta.env.VITE_DEV_EMAIL_HASH as string | undefined;
  return import.meta.env.DEV || (authorisedHash && session && hashString(session?.user?.email?.toLowerCase() || "") === authorisedHash.toLowerCase());
};

// Integration Tests
const DEFAULT_LLM_MODEL = "google/gemini-2.5-flash";
const DEFAULT_IMAGE_MODEL = "dall-e-3";
const ANIMALS = ["Cat", "Dog", "Fox", "Dolphin", "Elephant", "Lion", "Tiger", "Panda", "Rabbit", "Koala"];

export const AuthTest = () => {
  const { session } = useAuth();
  useClearTests(() => supabase.auth.signOut().catch(() => {}));
  return (
    <TestCard title={
      <div className="grid grid-cols-[20%_25%_45%_10%] items-center gap-2 w-full">
        <span>Auth Test</span>
        <SignInButton className="w-full px-4 py-2 text-base" />
        <span className={`pl-2 text-xs truncate min-w-0 ${session ? "text-gray-600 dark:text-gray-400" : "text-transparent select-none"}`}>
          {session ? session.user.email : "—"}
        </span>
        <StatusIcon className="justify-self-end" status={session ? "ok" : "idle"} />
      </div>
    } />
  );
};

export const DatabaseTest = () => {
  const [animalInput, setAnimalInput] = useState(ANIMALS[0]);
  const [animals, setAnimals] = useState<string[]>([]);
  const [animalError, setAnimalError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle");
  const canCall = useCanCallIntegrations();

  const refreshAnimals = async () => {
    if (!canCall) return setAnimals([]), setStatus("ok");
    try {
      const res = await fetch("/api/animals");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json() as { name: string }[];
      setAnimals(data?.map(d => d.name) ?? []);
      setStatus(data.length > 0 ? "ok" : "idle");
    } catch (err: any) {
      setAnimalError(err.message || String(err));
      setStatus("error");
    }
  };

  const addAnimal = async (name: string) => {
    if (!canCall || !name) return setStatus("ok");
    try {
      const res = await fetch("/api/animals", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name }) });
      if (!res.ok) throw new Error((await res.json().catch(() => ({})))?.error || `HTTP ${res.status}`);
      setAnimalInput(ANIMALS[0]);
      setStatus("ok");
      await refreshAnimals();
    } catch (err: any) {
      setAnimalError(err.message || String(err));
      setStatus("error");
    }
  };

  useEffect(() => { import.meta.env.DEV && refreshAnimals(); }, []);
  useClearTests(() => {
    setAnimalInput(ANIMALS[0]);
    setAnimals([]);
    setAnimalError(null);
    setStatus("idle");
    fetch("/api/animals", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: "{}" }).then(refreshAnimals).catch(() => {});
  });

  return (
    <TestCard title={
      <div className="grid grid-cols-[20%_25%_45%_10%] items-center gap-2 w-full">
        <span>Database Test</span>
        <button onClick={() => addAnimal(ANIMALS[Math.floor(Math.random() * ANIMALS.length)])} className="btn-primary w-full min-w-[10rem] px-4 py-2 text-base" disabled={status === "error"}>
          Send
        </button>
        {animals.length ? (
          <div className="flex items-center gap-1 flex-wrap max-w-xs overflow-x-auto">
            {animals.map(a => <span key={a} className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-1.5 py-0.5 rounded-full">{a}</span>)}
          </div>
        ) : <span className="text-xs text-gray-500 dark:text-gray-400">No animals yet.</span>}
        <StatusIcon className="justify-self-end" status={status} />
      </div>
    }>
      {animalError && <p className="text-sm text-red-600 dark:text-red-400 break-all mt-2">Error: {animalError}</p>}
    </TestCard>
  );
};

export const UploadsTest = () => {
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [uploadedImages, setUploadedImages] = useState<{ id: number; url: string }[]>([]);
  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle");
  const [apiError, setApiError] = useState<string | null>(null);
  const canCall = useCanCallIntegrations();

  const fetchImages = async () => {
    if (!canCall || !import.meta.env.DEV) return;
    try {
      const res = await fetch("/api/images");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setUploadedImages(await res.json());
    } catch (err) { console.error("Failed to fetch images", err); }
  };

  const checkUploadthingApi = async () => {
    if (!canCall) return setStatus("ok");
    try {
      const res = await fetch("/api/uploadthing");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus("ok");
    } catch (err: any) {
      setStatus("error");
      setApiError(err.message || String(err));
    }
  };

  useEffect(() => { import.meta.env.DEV && (fetchImages(), checkUploadthingApi()); }, []);
  useEffect(() => { uploadResult && import.meta.env.DEV && (fetchImages(), checkUploadthingApi()); }, [uploadResult]);
  useClearTests(() => {
    setUploadResult(null);
    setUploadedImages([]);
    setStatus("idle");
    setApiError(null);
    fetch("/api/images", { method: "DELETE" }).then(checkUploadthingApi).catch(() => {});
  });

  const iconStatus = uploadResult?.length || uploadedImages.length ? "ok" : status === "error" ? "error" : "idle";
  return (
    <TestCard title={
      <div className="grid grid-cols-[20%_25%_45%_10%] items-center gap-2 w-full">
        <span>File Upload Test</span>
        <UploadPhotoButton onComplete={setUploadResult} />
        <div className="flex items-center gap-1 flex-wrap">
          {uploadedImages.slice(-4).map(img => <img key={img.id} src={img.url} alt="Uploaded" className="w-8 h-8 object-cover rounded border border-gray-300" />)}
        </div>
        <StatusIcon className="justify-self-end" status={iconStatus} />
      </div>
    }>
      {apiError && <p className="text-sm text-red-600 dark:text-red-400 mt-4 break-all">Error: {apiError}</p>}
    </TestCard>
  );
};

export const OrganizationsTest = () => {
  const { session } = useAuth();
  const [status, setStatus] = useState<"idle" | "ok" | "error" | "pending">("idle");
  const [org, setOrg] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const canCall = useCanCallIntegrations();

  useEffect(() => {
    if (!session) return setOrg(null), setStatus("idle"), setErrorMsg(null);
    const fetchOrg = async () => {
      if (!canCall) return setStatus("idle");
      try {
        const { data, error } = await supabase.from("organizations").select("id, name").eq("owner_id", session!.user.id).order("created_at", { ascending: false }).limit(1);
        if (error) throw error;
        setOrg(data?.[0] ?? null);
        setStatus(data?.[0] ? "ok" : "idle");
      } catch (err: any) {
        setErrorMsg(err.message || String(err));
        setStatus("error");
      }
    };
    fetchOrg();
  }, [session, canCall]);

  useClearTests(() => { setStatus("idle"); setOrg(null); setErrorMsg(null); });

  const handleCreate = async () => {
    if (!session) return;
    if (!canCall) return setOrg({ name: "Demo Org" }), setStatus("ok");
    try {
      setStatus("pending");
      const { data, error } = await supabase.from("organizations").insert({ name: "Acme Co.", owner_id: session.user.id }).select("id, name").single();
      if (error) throw error;
      setOrg(data);
      setStatus("ok");
    } catch (err: any) {
      setErrorMsg(err.message || String(err));
      setStatus("error");
    }
  };

  const handleDelete = async () => {
    if (!session || !org) return;
    if (!canCall) return setOrg(null), setStatus("idle");
    try {
      setStatus("pending");
      const { error } = await supabase.from("organizations").delete().eq("id", org.id);
      if (error) throw error;
      setOrg(null);
      setStatus("idle");
    } catch (err: any) {
      setErrorMsg(err.message || String(err));
      setStatus("error");
    }
  };

  return (
    <TestCard title={
      <div className="grid grid-cols-[20%_25%_45%_10%] items-center gap-2 w-full">
        <span>Organizations</span>
        <button onClick={org ? handleDelete : handleCreate} className="btn-primary w-full min-w-[10rem] px-4 py-2 text-base" disabled={status === "pending" || !session}>
          {status === "pending" ? "Please wait…" : org ? "Delete Organization" : "Create Organization"}
        </button>
        <span className={`text-xs truncate max-w-xs min-w-0 ${org ? "text-gray-600 dark:text-gray-400" : "text-gray-500 dark:text-gray-400"}`}>
          {org ? org.name : "No org"}
        </span>
        <StatusIcon className="justify-self-end" status={status} />
      </div>
    }>
      {errorMsg && <p className="text-sm text-red-600 dark:text-red-400 break-all">{errorMsg}</p>}
    </TestCard>
  );
};

export const LLMImageTest = () => {
  const [status, setStatus] = useState<"idle" | "pending" | "ok" | "error">("idle");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const canCallLLM = useCanCallIntegrations();

  useClearTests(() => { setStatus("idle"); setImageUrl(null); setErrorMsg(null); });

  const handleGenerateImage = async () => {
    if (!canCallLLM) return setStatus("ok"), setImageUrl(null);
    setStatus("pending");
    setErrorMsg(null);
    setImageUrl(null);
    try {
      const res = await generateImages("A scenic landscape photograph of mountains overlooking a lake at sunset, high resolution, vibrant colors", DEFAULT_IMAGE_MODEL);
      if (res.error || !res.urls.length) throw new Error(res.error || "No image URLs returned");
      setImageUrl(res.urls[0]);
      setStatus("ok");
    } catch (err: any) {
      setErrorMsg(err?.message || String(err));
      setStatus("error");
    }
  };

  return (
    <TestCard title={
      <div className="grid grid-cols-[20%_25%_45%_10%] items-center gap-2 w-full">
        <span className="font-medium truncate">LLM Image</span>
        <button onClick={handleGenerateImage} className="btn-primary w-full min-w-[10rem] px-4 py-2 text-base" disabled={status === "pending"}>
          Generate Image
        </button>
        <div className="flex items-center min-h-[4rem]">
          {status === "pending" ? <span className="text-xs text-gray-500">Generating…</span> :
           status === "ok" && imageUrl ? <img src={imageUrl} alt="Generated scenic landscape" className="w-24 h-16 object-cover rounded border border-gray-300" /> :
           status === "error" ? <span className="text-xs text-red-500">Error</span> :
           <span className="text-xs text-transparent select-none">—</span>}
        </div>
        <StatusIcon className="justify-self-end" status={status} />
      </div>
    }>
      {status === "error" && <p className="text-sm text-red-600 dark:text-red-400 break-all">{errorMsg}</p>}
    </TestCard>
  );
};

export const LLMTextTest = () => {
  const [status, setStatus] = useState<"idle" | "pending" | "ok" | "error">("idle");
  const [textOutput, setTextOutput] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const canCallLLM = useCanCallIntegrations();

  useClearTests(() => { setStatus("idle"); setTextOutput(null); setErrorMsg(null); });

  const handleGenerateStory = async () => {
    if (!canCallLLM) return setStatus("ok"), setTextOutput("Lorem ipsum dolor sit amet.");
    setStatus("pending");
    setErrorMsg(null);
    setTextOutput(null);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: DEFAULT_LLM_MODEL, messages: [{ role: "user", content: "In two sentences, write a short story about any topic of your choice." }] }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status} – ${await res.text()}`);
      const reader = res.body?.getReader();
      let story = "";
      if (reader) {
        const decoder = new TextDecoder();
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          decoder.decode(value, { stream: true }).split(/\n+/).forEach(line => {
            const cleaned = line.trim().replace(/^data:\s*/, "");
            if (!cleaned || cleaned === "[DONE]") return;
            try {
              const json = JSON.parse(cleaned);
              const delta = json?.choices?.[0]?.delta?.content;
              if (delta) story += delta;
            } catch { story += cleaned; }
          });
        }
      } else {
        const raw = await res.text();
        try {
          story = JSON.parse(raw)?.choices?.[0]?.message?.content ?? raw;
        } catch { story = raw; }
      }
      story = story.trim().replace(/^f:\{[^}]*\}/, "").replace(/e:\{[^}]*\}/g, "").replace(/d:\{[^}]*\}/g, "");
      if (/\d+:"/.test(story)) story = [...story.matchAll(/\d+:\"([^\"]*)\"/g)].map(m => m[1]).join("").trim();
      setTextOutput(story);
      setStatus("ok");
    } catch (err: any) {
      setErrorMsg(err?.message || String(err));
      setStatus("error");
    }
  };

  return (
    <TestCard title={
      <div className="grid grid-cols-[20%_25%_45%_10%] items-center gap-2 w-full">
        <span className="font-medium truncate">LLM Story</span>
        <button onClick={handleGenerateStory} className="btn-primary w-full min-w-[10rem] px-4 py-2 text-base" disabled={status === "pending"}>
          Generate Story
        </button>
        <div className="text-xs whitespace-pre-wrap text-gray-700 dark:text-gray-300 break-words">{status === "pending" ? "Generating…" : textOutput || "—"}</div>
        <StatusIcon className="justify-self-end" status={status} />
      </div>
    }>
      {status === "error" && <p className="text-sm text-red-600 dark:text-red-400 break-all">{errorMsg}</p>}
    </TestCard>
  );
};

export const AnalyticsTest = () => {
  const [status, setStatus] = useState<"idle" | "ok" | "error" | "pending">("idle");
  const canCall = useCanCallIntegrations();

  useClearTests(() => setStatus("idle"));

  const sendTestEvent = async () => {
    if (!canCall) return setStatus("ok");
    try {
      setStatus("pending");
      const ph = (window as any).posthog;
      if (ph) {
        ph.capture("docs_test_event", { ts: Date.now() });
        setStatus("ok");
      } else throw new Error();
    } catch {
      setStatus("error");
    }
  };

  return (
    <TestCard title={
      <div className="grid grid-cols-[20%_25%_45%_10%] items-center gap-2 w-full">
        <span>Analytics</span>
        <button onClick={sendTestEvent} className="btn-primary w-full min-w-[10rem] px-4 py-2 text-base" disabled={status === "pending"}>
          Send Test Event
        </button>
        <span className="text-xs text-gray-500 dark:text-gray-400">{status === "ok" ? "Event sent" : ""}</span>
        <StatusIcon className="justify-self-end" status={status} />
      </div>
    } />
  );
};

export const BillingTest = () => {
  const [status, setStatus] = useState<"idle" | "ok" | "error" | "pending">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const canCall = useCanCallIntegrations();

  useClearTests(() => { setStatus("idle"); setErrorMsg(null); setProducts([]); });

  const pingPolar = async () => {
    if (!canCall) return setStatus("ok");
    try {
      setStatus("pending");
      const res = await fetch("/api/polar?mode=ping");
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.ok) throw new Error(data?.error || `HTTP ${res.status}`);
      setStatus("ok");
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err?.message || String(err));
    }
  };

  const fetchProducts = async () => {
    if (!canCall) return;
    try {
      setStatus("pending");
      const res = await fetch("/api/polar?mode=products");
      const data = await res.json().catch(() => ({}));
      if (res.ok && Array.isArray(data?.products)) setProducts(data.products), setStatus("ok");
      else throw new Error(data?.error || `HTTP ${res.status}`);
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err?.message || String(err));
    }
  };

  return (
    <TestCard title={
      <div className="grid grid-cols-[20%_25%_45%_10%] items-center gap-2 w-full">
        <span>Billing</span>
        <button onClick={async () => { await pingPolar(); status !== "error" && await fetchProducts(); }} className="btn-primary w-full min-w-[10rem] px-4 py-2 text-base" disabled={status === "pending"}>
          Check Billing
        </button>
        <span className={`text-xs truncate ${products.length ? "text-gray-600 dark:text-gray-400" : "text-transparent select-none"}`}>
          {products.length ? `${products.length} products` : "—"}
        </span>
        <StatusIcon className="justify-self-end" status={status} />
      </div>
    }>
      {status === "error" && <p className="text-sm text-red-600 dark:text-red-400 break-all">{errorMsg}</p>}
      {products.length > 0 && (
        <ul className="mt-2 space-y-1">
          {products.slice(0, 5).map(p => <li key={p.id} className="text-xs text-gray-700 dark:text-gray-300">{p.name} – {p.id}</li>)}
          {products.length > 5 && <li className="text-xs text-gray-500">and {products.length - 5} more…</li>}
        </ul>
      )}
    </TestCard>
  );
};

export const BotDetectionTest = () => {
  const [status, setStatus] = useState<"pending" | "success" | "error">("pending");
  const canCall = useCanCallIntegrations();

  const checkBot = () => fetch("/api/botid").then(async res => {
    if (!res.ok) throw new Error("Network error");
    setStatus((await res.json())?.isBot ? "error" : "success");
  }).catch(() => setStatus("error"));

  useEffect(() => { checkBot(); }, []);
  useClearTests(() => { setStatus("pending"); checkBot(); });

  return (
    <TestCard title={
      <div className="grid grid-cols-[20%_25%_45%_10%] items-center gap-2 w-full">
        <span>Bot Detection</span>
        <button onClick={() => setStatus("pending")} className="btn-primary w-full min-w-[10rem] px-4 py-2 text-base" disabled={status === "pending"}>
          Check
        </button>
        <span className={`text-xs truncate ${status === "success" ? "text-gray-600 dark:text-gray-400" : "text-transparent select-none"}`}>{status === "success" ? "verified" : "—"}</span>
        <StatusIcon className="justify-self-end" status={status === "pending" ? "pending" : status === "success" ? "ok" : "error"} />
      </div>
    }>
      {status === "error" && <p className="text-sm text-red-500">Your request was flagged as a bot or the verification failed.</p>}
    </TestCard>
  );
};

export const MapsAutocompleteTest = () => {
  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle");
  const [selected, setSelected] = useState<any>(null);
  const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const AutocompleteField = () => {
    const inputRef = useRef<HTMLInputElement>(null);
    const places = useMapsLibrary("places");
    useEffect(() => {
      if (!places || !inputRef.current) return;
      const ac = new (places as any).Autocomplete(inputRef.current, { fields: ["geometry", "name", "formatted_address"] });
      ac.addListener("place_changed", () => { setSelected(ac.getPlace()); setStatus("ok"); });
    }, [places]);
    return <input ref={inputRef} placeholder="Search place..." className="px-3 py-2 border border-gray-300 rounded w-full" />;
  };

  return (
    <TestCard title={
      <div className="grid grid-cols-[20%_25%_45%_10%] items-center gap-2 w-full">
        <span>Maps Autocomplete</span>
        <div className="col-span-2 w-full"><APIProvider apiKey={API_KEY} libraries={["places"]}><AutocompleteField /></APIProvider></div>
        <StatusIcon className="justify-self-end" status={status} />
      </div>
    }>
      {selected && <p className="text-xs text-gray-600 dark:text-gray-400 break-words">{selected.formatted_address || selected.name}</p>}
    </TestCard>
  );
};

export const EmailTest = () => {
  const [status, setStatus] = useState<"idle" | "ok" | "error" | "pending">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const canCall = useCanCallIntegrations();

  useClearTests(() => { setStatus("idle"); setErrorMsg(null); });

  const sendEmail = async () => {
    if (!canCall) return setStatus("ok");
    try {
      setStatus("pending");
      const res = await fetch("/api/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: "onboarding@resend.dev", subject: "Hello World", html: "<p>Congrats on sending your <strong>first email</strong>!</p>" }),
      });
      if (!res.ok) throw new Error((await res.json())?.error || `HTTP ${res.status}`);
      setStatus("ok");
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err?.message || String(err));
    }
  };

  return (
    <TestCard title={
      <div className="grid grid-cols-[20%_25%_45%_10%] items-center gap-2 w-full">
        <span>Email</span>
        <button onClick={sendEmail} className="btn-primary w-full min-w-[10rem] px-4 py-2 text-base flex items-center gap-2" disabled={status === "pending"}>
          Send Email
        </button>
        <span className="text-xs text-gray-600 dark:text-gray-400 truncate">to owner</span>
        <StatusIcon className="justify-self-end" status={status} />
      </div>
    }>
      {errorMsg && <p className="text-sm text-red-600 dark:text-red-400 break-all">{errorMsg}</p>}
    </TestCard>
  );
};

export const RealtimeChatTest = () => {
  const [status, setStatus] = useState<"idle" | "ok" | "pending" | "error">("idle");
  const [lastMsg, setLastMsg] = useState<string | null>(null);
  const userIdRef = useRef("user-" + Math.random().toString(36).slice(2, 9));
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const canCall = useCanCallIntegrations();

  useClearTests(() => {
    setStatus("idle");
    setLastMsg(null);
    if (channelRef.current) supabase.removeChannel(channelRef.current), channelRef.current = null;
  });

  useEffect(() => {
    if (!canCall) return setStatus("ok");
    const channel = supabase.channel("vs-realtime-chat")
      .on("broadcast", { event: "msg" }, ({ payload }: any) => {
        setLastMsg(`${payload.user}: ${payload.text}`);
        setStatus("ok");
      })
      .subscribe(s => s === "SUBSCRIBED" && setStatus("idle"));
    channelRef.current = channel;
    return () => { supabase.removeChannel(channel); };
  }, [canCall]);

  const sendMessage = () => {
    if (!channelRef.current) return;
    const text = "See this on another tab?";
    setStatus("pending");
    setLastMsg(`${userIdRef.current}: ${text}`);
    channelRef.current.send({ type: "broadcast", event: "msg", payload: { user: userIdRef.current, text } })
      .then(() => setStatus("ok"))
      .catch(() => setStatus("error"));
  };

  return (
    <TestCard title={
      <div className="grid grid-cols-[20%_25%_45%_10%] items-center gap-2 w-full">
        <span>Realtime Msg</span>
        <button onClick={sendMessage} className="btn-primary w-full min-w-[10rem] px-4 py-2 text-base" disabled={status === "pending"}>
          Send Message
        </button>
        <span className={`text-xs truncate max-w-sm min-w-0 ${lastMsg ? "text-gray-600 dark:text-gray-400" : "text-gray-500 dark:text-gray-400"}`}>
          {lastMsg || "No messages yet."}
        </span>
        <StatusIcon className="justify-self-end" status={status} />
      </div>
    } />
  );
};

interface TestIntegrationsProps { selectedKeys?: string[] }
export const TestIntegrations = ({ selectedKeys = [] }: TestIntegrationsProps) => {
  const show = (key: string) => !selectedKeys.length || selectedKeys.includes(key);
  return (
    <div className="space-y-10 text-base w-full max-w-3xl mx-auto">
      {show("auth") && <AuthTest />}
      {show("database") && <DatabaseTest />}
      {show("uploads") && <UploadsTest />}
      {show("organizations") && <OrganizationsTest />}
      {show("email") && <EmailTest />}
      {show("llm-image") && <LLMImageTest />}
      {show("llm") && <LLMTextTest />}
      {show("analytics") && <AnalyticsTest />}
      {show("billing") && <BillingTest />}
      {selectedKeys.length > 0 && <BotDetectionTest />}
      {show("maps") && <MapsAutocompleteTest />}
      {show("realtime") && <RealtimeChatTest />}
    </div>
  );
};

interface ModalProps { open: boolean; onClose: () => void }
export default function TestIntegrationsModal({ open, onClose }: ModalProps) {
  if (!open) return null;
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-900 dark:hover:text-white" aria-label="Close">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="text-2xl font-semibold">Integration Tests</h2>
          <button onClick={dispatchClearTests} className="btn-primary px-4 py-2 text-sm">Clear Tests</button>
        </div>
        <TestIntegrations />
      </div>
    </div>,
    document.body
  );
}