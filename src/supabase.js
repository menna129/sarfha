

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);

export async function testSupabaseConnection() {
  const { data, error } = await supabase
    .from("test_connection")
    .select("*")
    .limit(1);

  if (error) {
    console.error("Supabase connection error:", error.message);
    return false;
  }

  console.log("Supabase connected successfully:", data);
  return true;
}