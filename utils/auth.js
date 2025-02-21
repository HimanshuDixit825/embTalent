import { auth } from "@clerk/nextjs";
import { createAuthenticatedSupabaseClient } from "./supabase";

export const getAuthenticatedSupabase = async () => {
  const { getToken } = auth();
  const token = await getToken({ template: "supabase" });
  return createAuthenticatedSupabaseClient(token);
};
