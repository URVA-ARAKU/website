import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://nyydjisfdavwokfawrhr.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_T5w5cXt7kZ1ExWgnaF69Lg_zI-MJEMG';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

