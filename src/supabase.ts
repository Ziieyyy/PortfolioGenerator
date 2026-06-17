import { createClient } from '@supabase/supabase-js';

// Public Supabase configuration fallbacks for static hosting/publishing
const DEFAULT_URL = 'https://skgevucorcopouwjcwio.supabase.co';
const DEFAULT_KEY = 'sb_publishable_hzwqEyMnW58DwEd7cguOjg_nSNI271W';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || DEFAULT_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);
