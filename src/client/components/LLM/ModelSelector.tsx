import React from "react";
import { DEFAULT_LLM_MODEL } from "@shared/constants";

interface ModelSelectorProps {
  value?: string;
  onChange: (model: string) => void;
  className?: string;
  mode?: "text" | "structured" | "image";
}

const ALL_MODELS: { id: string; label: string }[] = [
  { id: DEFAULT_LLM_MODEL, label: DEFAULT_LLM_MODEL },
  { id: "openai/gpt-4o-mini", label: "gpt-4o-mini" },
  { id: "google/gemini-pro-1.5", label: "gemini-pro-1.5" },
  { id: "google/gemini-1.5-pro", label: "gemini-1.5-pro" },
  { id: "google/gemini-2.0-flash-001", label: "gemini-2-flash" },
  { id: "dall-e-3", label: "dall-e-3" },
  { id: "dall-e-2", label: "dall-e-2" },
  { id: "stability-ai/stable-diffusion-xl", label: "sdxl" },
  { id: "gpt-image-1", label: "gpt-image-1" },
];

const IMAGE_MODELS = [
  { id: "dall-e-3", label: "dall-e-3" },
  { id: "dall-e-2", label: "dall-e-2" },
  { id: "gpt-image-1", label: "gpt-image-1" },
];

const IMAGE_MODEL_IDS = ["dall-e-3", "dall-e-2", "gpt-image-1", "stability-ai/stable-diffusion-xl"] as const;

const TEXT_MODELS = ALL_MODELS.filter((m) => !IMAGE_MODEL_IDS.includes(m.id as any));

export default function ModelSelector({ value, onChange, className, mode }: ModelSelectorProps) {
  const selected = value ?? DEFAULT_LLM_MODEL;
  const modelOptions = mode === "image" ? IMAGE_MODELS : TEXT_MODELS;
  // Ensure currently selected model is present in options to avoid React warning
  const options = modelOptions.some((m) => m.id === selected)
    ? modelOptions
    : [...modelOptions, { id: selected, label: selected }];

  const isSingle = options.length === 1;

  return (
    <select
      value={selected}
      onChange={(e) => onChange(e.target.value)}
      className={`input py-1 px-2 text-sm ${className ?? ""}`.trim()}
      disabled={isSingle}
    >
      {options.map((m) => (
        <option key={m.id} value={m.id}>
          {m.label}
        </option>
      ))}
    </select>
  );
} 