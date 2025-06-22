import { z } from "zod";

// Waitlist form
export const WaitlistSchema = z.object({
  name: z.string().min(1, "Name is required"),
  company: z.string().optional().nullable(),
  occupation: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  level: z.enum(["college_grad", "intern", "junior", "senior"]),
});

// API response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}

// Form types
export type WaitlistFormData = z.infer<typeof WaitlistSchema>;

// Upload types
export interface UploadedFile {
  url: string;
  name: string;
  size: number;
  key: string;
}

export interface UploadResponse {
  files: UploadedFile[];
}

// Auth types (from Supabase)
export interface User {
  id: string;
  email?: string;
  user_metadata?: {
    [key: string]: any;
  };
}

// Idea submission
export const IdeaSchema = z.object({
  text: z
    .string()
    .min(1, "Idea is required")
    .max(1000, "Idea is too long (max 1000 characters)"),
});

export type IdeaFormData = z.infer<typeof IdeaSchema>; 