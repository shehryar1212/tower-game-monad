
import { createClient } from '@supabase/supabase-js';

// Define fallback values to prevent app from crashing
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-url.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

// Still log the error, but don't crash the app
if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn('Missing Supabase environment variables. Leaderboard functionality will be limited.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
