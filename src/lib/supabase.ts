import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface LoveDocument {
  id: string;
  gustavo_signed: boolean;
  gustavo_signed_at: string | null;
  jennifer_signed: boolean;
  jennifer_signed_at: string | null;
  both_signed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface TreeMessage {
  id: string;
  message: string;
  created_at: string;
}
