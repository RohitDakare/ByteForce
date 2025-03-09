
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://whffcrkspkkmmnbueflc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndoZmZjcmtzcGtrbW1uYnVlZmxjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTg0NjA2MzMsImV4cCI6MjAzNDAzNjYzM30.6eMr8eAcItfJCeExgOGEPZQYwAJDl3dHi5BX2S0K5Kw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
