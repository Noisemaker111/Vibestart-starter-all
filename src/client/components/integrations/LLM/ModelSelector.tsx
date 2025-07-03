import React from "react";
import { DEFAULT_LLM_MODEL, DEFAULT_IMAGE_MODEL } from "@shared/constants";

interface ModelSelectorProps {
  value?: string;
  onChange: (model: string) => void;
  className?: string;
  mode?: "text" | "structured" | "image";
}

const ALL_MODELS: { id: string; label: string }[] = [
  { id: DEFAULT_LLM_MODEL, label: "google/gemma-3n-e4b-it" },
  { id: DEFAULT_IMAGE_MODEL, label: DEFAULT_IMAGE_MODEL },
];

const IMAGE_MODELS = ALL_MODELS.filter((m) => m.id === DEFAULT_IMAGE_MODEL);

const TEXT_MODELS = ALL_MODELS.filter((m) => m.id !== DEFAULT_IMAGE_MODEL);

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