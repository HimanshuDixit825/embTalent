// utils/supabase.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Basic Supabase client (for public data)
export const supabase = createClient(supabaseUrl, supabaseKey);

// Enhanced Supabase client with Clerk authentication
export const createAuthenticatedSupabaseClient = async (clerkToken) => {
  return createClient(supabaseUrl, supabaseKey, {
    global: {
      headers: {
        Authorization: `Bearer ${clerkToken}`,
      },
    },
  });
};
