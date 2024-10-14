import { createClient } from "@supabase/supabase-js";

const supabaseURL: string = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey: string = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseClient = createClient(supabaseURL, supabaseAnonKey);

export default supabaseClient;
