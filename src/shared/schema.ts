import { z } from "zod";
import { type SelectInstrument, type InsertInstrument } from "@server/db/schema";

// Use Drizzle inferred types
export type Instrument = SelectInstrument;
export type NewInstrument = InsertInstrument;

// Form validation schemas
export const InstrumentFormSchema = z.object({
  name: z.string().min(1, "Instrument name is required").max(100, "Name must be less than 100 characters"),
  image_url: z.string().url("Must be a valid URL").optional().nullable(),
});

export const CreateInstrumentSchema = z.object({
  name: z.string().min(1, "Instrument name is required").max(100, "Name must be less than 100 characters"),
  image_url: z.string().url("Must be a valid URL"),
});

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

export interface InstrumentListResponse extends ApiResponse<Instrument[]> {}

export interface InstrumentResponse extends ApiResponse<Instrument> {}

// Form types
export type InstrumentFormData = z.infer<typeof InstrumentFormSchema>;
export type CreateInstrumentData = z.infer<typeof CreateInstrumentSchema>;
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

// Component prop types
export interface InstrumentCardProps {
  instrument: Instrument;
  onDelete: (id: number) => void;
}

export interface InstrumentFormProps {
  onSubmit: (data: CreateInstrumentData) => void;
  loading?: boolean;
  error?: string | null;
} 