// src/integrations/supabase/client.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase env vars. Check VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in .env'
  );
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);