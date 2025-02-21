import { supabase } from "./supabase";

export const cleanupUtils = {
  async cleanupTestData() {
    try {
      const testEmail = "test%@example.com";

      // Remove test users
      await supabase.from("ra_users").delete().like("email", testEmail);

      // Remove test leads
      await supabase.from("ra_leads").delete().like("emb_lead_id", "TEST-%");

      return { success: true, message: "Test data cleaned up successfully" };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
  async resetRLS() {
    try {
      await supabase.rpc("reset_rls", {
        sql: `
          ALTER TABLE ra_users ENABLE ROW LEVEL SECURITY;
          
          -- Re-enable original policies
          DROP POLICY IF EXISTS "Enable read access for all users" ON ra_users;
          DROP POLICY IF EXISTS "Enable insert for all users" ON ra_users;
          DROP POLICY IF EXISTS "Enable update for own data" ON ra_users;
          
          CREATE POLICY "Users can view their own data"
          ON ra_users FOR SELECT
          USING (auth.uid()::text = userid::text);
        `,
      });
      return { success: true, message: "RLS reset successfully" };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
};
