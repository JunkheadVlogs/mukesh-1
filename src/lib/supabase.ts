import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wnqdmltuuzxythaginqa.supabase.co';
const supabaseAnonKey = 'sb_publishable_nsVP3N_1ykEaY5uD6Ae2Pw_SM2qprIU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
