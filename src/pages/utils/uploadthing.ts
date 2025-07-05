"use client";

import {
  generateUploadButton,
  generateUploadDropzone,
  generateReactHelpers,
} from "@uploadthing/react";
import type { UploadRouter } from "@server/uploadthing";

// Upload-related types - moved from shared/schema.ts
export interface UploadedFile {
  url: string;
  name: string;
  size: number;
  key: string;
}

export interface UploadResponse {
  files: UploadedFile[];
}

export const UploadButton = generateUploadButton<UploadRouter>({
  url: "/api/uploadthing",
});

export const UploadDropzone = generateUploadDropzone<UploadRouter>({
  url: "/api/uploadthing",
});

// Helper hook for custom upload components
export const { useUploadThing } = generateReactHelpers<UploadRouter>({
  url: "/api/uploadthing",
}); 