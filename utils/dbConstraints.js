import { supabase } from "./supabase";

export const constraintTests = {
  async setupConstraints() {
    try {
      // Create stored procedure for checking constraints
      await supabase.rpc("create_constraint_check_function", {
        sql: `
          CREATE OR REPLACE FUNCTION check_constraint(
            table_name text,
            column_name text,
            constraint_type text
          )
          RETURNS boolean
          LANGUAGE plpgsql
          AS $$
          BEGIN
            RETURN EXISTS (
              SELECT 1
              FROM information_schema.table_constraints tc
              JOIN information_schema.constraint_column_usage ccu
              ON tc.constraint_name = ccu.constraint_name
              WHERE tc.table_name = table_name
              AND ccu.column_name = column_name
              AND tc.constraint_type = constraint_type
            );
          END;
          $$;
        `,
      });

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async testEmailConstraint() {
    try {
      const testEmail = `test${Date.now()}@example.com`;

      // Cleanup any existing test data
      await supabase.from("ra_users").delete().eq("email", testEmail);

      // First insert should succeed
      const insert1 = await supabase.from("ra_users").insert({
        email: testEmail,
        name: "Test User",
        password: "password123",
      });

      if (insert1.error) {
        throw new Error(`First insert failed: ${insert1.error.message}`);
      }

      // Second insert should fail
      const insert2 = await supabase.from("ra_users").insert({
        email: testEmail,
        name: "Test User 2",
        password: "password123",
      });

      // Cleanup
      await supabase.from("ra_users").delete().eq("email", testEmail);

      return {
        success: insert2.error?.code === "23505",
        message:
          insert2.error?.code === "23505"
            ? "Email unique constraint working correctly"
            : "Email unique constraint failed",
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async testForeignKeyConstraints() {
    const tests = [
      {
        name: "ra_leads -> ra_users",
        test: async () => {
          try {
            // First create a test user
            const testUser = await supabase
              .from("ra_users")
              .insert({
                email: `test${Date.now()}@example.com`,
                name: "Test User",
                password: "password123",
              })
              .select()
              .single();

            if (testUser.error)
              throw new Error(
                `Failed to create test user: ${testUser.error.message}`
              );

            // Try to insert a lead with valid user_id
            const validLead = await supabase.from("ra_leads").insert({
              emb_lead_id: `TEST-${Date.now()}-1`,
              user_id: testUser.data.id,
              lead_status: "active",
            });

            // Try to insert a lead with invalid user_id
            const invalidLead = await supabase.from("ra_leads").insert({
              emb_lead_id: `TEST-${Date.now()}-2`,
              user_id: 999999999,
              lead_status: "active",
            });

            // Cleanup
            await supabase.from("ra_users").delete().eq("id", testUser.data.id);

            return {
              success: !validLead.error && invalidLead.error?.code === "23503",
              message:
                !validLead.error && invalidLead.error?.code === "23503"
                  ? "Foreign key constraint working correctly"
                  : "Foreign key constraint failed",
            };
          } catch (error) {
            return { success: false, error: error.message };
          }
        },
      },
    ];

    const results = [];
    for (const test of tests) {
      const result = await test.test();
      results.push({
        constraint: test.name,
        ...result,
      });
    }

    return results;
  },
};
