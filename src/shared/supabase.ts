import { createClient } from "@supabase/supabase-js";

// Auth types - moved from shared/schema.ts
export interface User {
  id: string;
  email?: string;
  user_metadata?: {
    [key: string]: any;
  };
}

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
); 