import { supabase } from "./supabase";

export const validationTests = {
  async validateTableStructure(tableName) {
    try {
      const { data, error } = await supabase.rpc("get_table_info", {
        table_name: tableName,
      });

      if (error) throw error;

      return {
        success: true,
        structure: data,
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async validateAllTables() {
    const tables = [
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
    for (const table of tables) {
      const result = await this.validateTableStructure(table);
      results.push({
        table,
        ...result,
      });
    }

    return results;
  },
};
