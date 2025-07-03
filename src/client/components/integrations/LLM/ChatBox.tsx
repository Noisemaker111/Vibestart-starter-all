import React, { useRef, useState } from "react";
import { useChat } from "ai/react";
import ModelSelector from "@client/components/integrations/LLM/ModelSelector";
import { DEFAULT_LLM_MODEL, DEFAULT_IMAGE_MODEL } from "@shared/constants";
import { generateImages } from "@client/utils/integrationLLM";
import { Paperclip, Send as SendIcon } from "lucide-react";

export interface ChatBoxProps {
  className?: string;
}

export default function ChatBox({ className }: ChatBoxProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<FileList | undefined>();
  const [model, setModel] = useState<string>(DEFAULT_LLM_MODEL);
  const [mode, setMode] = useState<"text" | "structured" | "image">("text");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [rawImageOutput, setRawImageOutput] = useState<string>("");
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [revisedPrompt, setRevisedPrompt] = useState<string | null>(null);
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    status,
    stop,
    error,
    reload,
  } = useChat({
    api: "/api/chat",
  }) as any;

  // Auto-detection helper: decide mode based on prompt & attachments
  const detectMode = (prompt: string, attachedFiles?: FileList | undefined): "text" | "structured" | "image" => {
    // If user attached files, treat as image request
    if (attachedFiles && attachedFiles.length > 0) return "image";

    const lower = prompt.toLowerCase();

    // Heuristic: if prompt asks for JSON specifically
    if (/\bjson\b/.test(lower) && /\b(return|output|respond)\b/.test(lower)) {
      return "structured";
    }

    // Heuristic: keywords indicating an image creation request
    if (/(generate|create|draw|produce|make).*\b(image|picture|photo|art|illustration)\b/.test(lower) || /\b(image|picture|photo|illustration) of /.test(lower)) {
      return "image";
    }

    return "text";
  };

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Decide mode dynamically
    const detectedMode = detectMode(input, files);
    setMode(detectedMode);

    if (detectedMode === "image") {
      const chosenModel = DEFAULT_IMAGE_MODEL;
      if (model !== chosenModel) setModel(chosenModel);
      if (!input.trim()) return;
      setIsGeneratingImage(true);
      setImageUrls([]);
      setRevisedPrompt(null);
      setRawImageOutput("");
      try {
        const res = await generateImages(input.trim(), chosenModel);
        setImageUrls(res.urls);
        // Attempt to parse JSON to get revised_prompt
        let rev: string | null = null;
        try {
          const parsed = typeof res.raw === "string" ? JSON.parse(res.raw) : res.raw;
          if (parsed && typeof parsed === "object") {
            if (typeof parsed.revised_prompt === "string") rev = parsed.revised_prompt;
            if (!rev && Array.isArray(parsed?.data) && parsed.data[0]?.revised_prompt) {
              rev = parsed.data[0].revised_prompt;
            }
          }
        } catch {/* ignore */}
        setRevisedPrompt(rev);
        setRawImageOutput(res.raw);
      } catch (err: any) {
        setRawImageOutput(err?.message || "Error generating images");
      } finally {
        setIsGeneratingImage(false);
      }
      return;
    }

    // Reset image-related UI state
    setImageUrls([]);
    setIsGeneratingImage(false);

    const chosenModel = model === "dall-e-3" ? DEFAULT_LLM_MODEL : model;
    if (model !== chosenModel) setModel(chosenModel);

    if (!input.trim()) return;

    const structured = detectedMode === "structured";

    handleSubmit(event as any, {
      body: { model: chosenModel, structured },
      ...(files ? { experimental_attachments: files } : {}),
    });
    // reset file input
    setFiles(undefined);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  // UI helpers
  const isSending = status === "submitted" || status === "streaming";

  const hasOutput =
    messages.length > 0 ||
    (mode === "image" && (isGeneratingImage || imageUrls.length > 0 || rawImageOutput || error));

  return (
    <div className={`flex flex-col w-full max-w-3xl mx-auto border rounded-lg bg-white dark:bg-gray-900 shadow ${className ?? ""}`.trim()}>
      {/* Controls */}
      <div className="p-4 flex flex-col gap-3 border-b dark:border-gray-700">
        {/* Row 1 – model + mode selectors */}
        <div className="flex gap-3 w-full flex-wrap">
          <ModelSelector
            value={model}
            onChange={setModel}
            mode={mode}
            className="w-40"
          />
          {/* Mode selector removed – mode is auto-detected */}
          {isSending && (
            <button
              type="button"
              onClick={() => stop()}
              className="text-xs text-red-600 underline"
            >
              Stop
            </button>
          )}
          {!isSending && messages.length > 0 && (
            <button
              type="button"
              onClick={() => reload()}
              className="text-xs text-indigo-600 underline"
            >
              Regenerate
            </button>
          )}
        </div>

        {/* Row 2 – attachment, input, send */}
        <form onSubmit={onSubmit} className="flex items-center gap-3 w-full mt-3">
          <input
            id="fileInput"
            type="file"
            multiple
            ref={fileInputRef}
            onChange={(e) => setFiles(e.target.files ?? undefined)}
            className="hidden"
          />
          <label
            htmlFor="fileInput"
            className="p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <Paperclip className="w-4 h-4 text-gray-600 dark:text-gray-300" />
          </label>

          <input
            name="prompt"
            value={input}
            onChange={handleInputChange}
            disabled={isSending}
            placeholder="Type your message…"
            className="flex-1 px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <button
            type="submit"
            disabled={isSending}
            className="p-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 flex items-center justify-center"
          >
            <SendIcon className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Transcript / Generated output */}
      {hasOutput && (
        <div className="flex flex-col gap-4 p-4">
          {(messages as any[]).map((m: any) => (
            <div key={m.id} className="flex flex-col gap-1">
              <div
                className={`text-sm font-semibold ${
                  m.role === "user" ? "text-indigo-600" : "text-green-600"
                }`}
              >
                {m.role === "user" ? "You" : "AI"}
              </div>
              <div className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200">
                {((m as any).parts ?? []).map((part: any, idx: number) => {
                  if (part.type === "text") return <span key={idx}>{part.text}</span>;
                  if (part.type === "file" && part.mimeType?.startsWith("image/")) {
                    return (
                      <img
                        key={idx}
                        src={`data:${part.mimeType};base64,${part.data}`}
                        alt="generated"
                        className="max-w-full rounded-md border border-gray-300 dark:border-gray-700 my-2"
                      />
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          ))}
          {mode === "image" && isGeneratingImage && (
            <div className="text-sm text-gray-500">Generating image… please wait</div>
          )}
          {mode === "image" && revisedPrompt && (
            <div className="text-sm italic text-gray-700 dark:text-gray-300 mb-2">Revised prompt: {revisedPrompt}</div>
          )}
          {mode === "image" && imageUrls.length>0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {imageUrls.map((u,idx)=>(<img key={idx} src={u} className="w-full h-40 object-cover rounded"/>))}
            </div>
          )}
          {rawImageOutput && mode==="image" && (
             <pre className="bg-gray-900 text-gray-100 text-xs p-4 rounded-lg overflow-x-auto">{rawImageOutput}</pre>
          )}
          {error && (
            <div className="text-red-500 text-sm">Something went wrong. <button onClick={() => reload()} className="underline">Retry</button></div>
          )}
        </div>
      )}
    </div>
  );
} 