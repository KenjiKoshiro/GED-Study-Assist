import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let client: SupabaseClient | undefined;

export function getSupabase() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Study content is temporarily unavailable. Please try again later.');
  }
  client ??= createClient(supabaseUrl, supabaseAnonKey);
  return client;
}
