import { supabase } from "./supabase";
import { constraintTests } from "./dbConstraints";
import { cleanupUtils } from "./dbCleanup";
import { validationTests } from "./dbValidation";

export const dbTests = {
  async runAllTests() {
    // Start with cleanup
    await cleanupUtils.cleanupTestData();

    const results = {
      // Basic connection test
      connection: await this.testConnection(),

      // Table existence and structure
      tables: await this.testTableExistence(),
      validation: await validationTests.validateAllTables(),

      // Constraints
      constraints: {
        email: await constraintTests.testEmailConstraint(),
        foreignKeys: await constraintTests.testForeignKeyConstraints(),
      },

      // Relationships
      relationships: await this.testRelationships(),
    };

    // Final cleanup
    await cleanupUtils.cleanupTestData();

    return results;
  },

  // Test database connection
  async testConnection() {
    try {
      const { data, error } = await supabase.from("ra_users").select("count");
      if (error) throw error;
      return { success: true, message: "Successfully connected to Supabase" };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Test if all required tables exist
  async testTableExistence() {
    const requiredTables = [
      "ra_users",
      "resource_bifurcations",
      "skills",
      "ra_leads",
      "ra_lead_line_items",
      "lead_line_item_skills",
      "applicant_cvs",
      "ra_files",
    ];

    const results = [];

    for (const table of requiredTables) {
      try {
        const { data, error } = await supabase.from(table).select("count");

        results.push({
          table,
          exists: !error,
          error: error?.message,
        });
      } catch (error) {
        results.push({
          table,
          exists: false,
          error: error.message,
        });
      }
    }

    return results;
  },

  // Test table relationships
  async testRelationships() {
    const tests = [
      {
        name: "ra_leads -> ra_users",
        test: async () => {
          const { error } = await supabase
            .from("ra_leads")
            .select(
              `
              id,
              user:ra_users(id)
            `
            )
            .limit(1);
          return !error;
        },
      },
      {
        name: "ra_lead_line_items -> ra_leads",
        test: async () => {
          const { error } = await supabase
            .from("ra_lead_line_items")
            .select(
              `
              id,
              lead:ra_leads(id)
            `
            )
            .limit(1);
          return !error;
        },
      },
      {
        name: "lead_line_item_skills -> skills",
        test: async () => {
          const { error } = await supabase
            .from("lead_line_item_skills")
            .select(
              `
              id,
              skill:skills(id)
            `
            )
            .limit(1);
          return !error;
        },
      },
    ];

    const results = [];
    for (const test of tests) {
      try {
        const passed = await test.test();
        results.push({
          relationship: test.name,
          valid: passed,
          error: null,
        });
      } catch (error) {
        results.push({
          relationship: test.name,
          valid: false,
          error: error.message,
        });
      }
    }

    return results;
  },

  // Test constraints
  async testConstraints() {
    const tests = [
      {
        name: "ra_users email unique constraint",
        test: async () => {
          // Try to insert duplicate email
          const testEmail = "test@example.com";
          await supabase.from("ra_users").delete().eq("email", testEmail);

          const insert1 = await supabase.from("ra_users").insert({
            email: testEmail,
            name: "Test User",
            password: "password123",
          });

          const insert2 = await supabase.from("ra_users").insert({
            email: testEmail,
            name: "Test User 2",
            password: "password123",
          });

          return insert2.error?.code === "23505"; // Unique violation
        },
      },
      // Add more constraint tests as needed
    ];

    const results = [];
    for (const test of tests) {
      try {
        const passed = await test.test();
        results.push({
          constraint: test.name,
          valid: passed,
          error: null,
        });
      } catch (error) {
        results.push({
          constraint: test.name,
          valid: false,
          error: error.message,
        });
      }
    }

    return results;
  },
};
