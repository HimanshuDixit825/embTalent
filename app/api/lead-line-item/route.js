import { supabase } from "@/lib/supabase";
import { generateId } from "@/lib/utils";

// Helper to calculate token expiry (24 hours from now)
const getTokenExpiry = () => {
  const date = new Date();
  date.setHours(date.getHours() + 24);
  return date.toISOString();
};

// Create initial record with temporary token
export async function POST(request) {
  try {
    const body = await request.json();
    console.error("\n[API] POST - Request body:", body);

    const {
      domain,
      tech_skills,
      good_to_have,
      must_have,
      JD_filename,
      JD_fileURL,
    } = body;
    console.error("[API] POST - Extracted fields:", {
      domain,
      tech_skills,
      good_to_have,
      must_have,
      JD_filename,
      JD_fileURL,
    });

    // Generate temporary token and expiry
    const temporary_token = generateId();
    const token_expiry = getTokenExpiry();
    console.error("[API] Generated token:", temporary_token);

    // Get file URL from storage if JD_filename is provided but JD_fileURL is not
    let fileUrl = JD_fileURL;
    if (JD_filename && !JD_fileURL) {
      const {
        data: { publicUrl },
      } = supabase.storage.from("pdfs").getPublicUrl(JD_filename);
      fileUrl = publicUrl;
    }

    // Set temporary token via RPC
    await supabase.rpc("set_temporary_token", { token: temporary_token });

    // Create record
    const { data, error } = await supabase
      .from("ra_lead_line_item_col")
      .insert({
        temporary_token,
        token_expiry,
        domain,
        tech_skills: Array.isArray(tech_skills) ? tech_skills : [],
        good_to_have: Array.isArray(good_to_have) ? good_to_have : [],
        must_have: Array.isArray(must_have) ? must_have : [],
        JD_filename,
        JD_fileURL: fileUrl,
      })
      .select()
      .single();

    if (error) {
      console.error("[API] Supabase error creating record:", {
        error,
        errorMessage: error.message,
        errorDetails: error.details,
        errorHint: error.hint,
        errorCode: error.code,
      });
      return Response.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    if (!data) {
      console.error("[API] No data returned after insert");
      return Response.json(
        { success: false, error: "Failed to create record - no data returned" },
        { status: 500 }
      );
    }

    console.error("[API] Record created successfully:", data);
    return Response.json({
      success: true,
      data: { temporary_token, ...data },
    });
  } catch (error) {
    console.error("Error creating record:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// Update record during the flow
export async function PUT(request) {
  try {
    const { temporary_token, ...updateData } = await request.json();
    console.error("[API] PUT - Updating record:", {
      temporary_token,
      ...updateData,
    });

    // Set temporary token via RPC
    await supabase.rpc("set_temporary_token", { token: temporary_token });

    // Update record with all provided fields
    const { data, error } = await supabase
      .from("ra_lead_line_item_col")
      .update(updateData)
      .eq("temporary_token", temporary_token)
      .select()
      .single();

    if (error) {
      console.error("[API] Error updating record:", error);
      return Response.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    if (!data) {
      console.error("[API] No data returned after update");
      return Response.json(
        { success: false, error: "Failed to update record - no data returned" },
        { status: 500 }
      );
    }

    console.error("[API] Record updated successfully:", data);
    return Response.json({ success: true, data });
  } catch (error) {
    console.error("Error updating record:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// Link record to user after signup
export async function PATCH(request) {
  try {
    const { temporary_token, user_id } = await request.json();

    console.error("[API] PATCH - Linking record:", {
      temporary_token,
      user_id,
    });

    // First verify the record exists
    const { data: existingRecord, error: findError } = await supabase
      .from("ra_lead_line_item_col")
      .select("*")
      .eq("temporary_token", temporary_token)
      .single();

    if (findError) {
      console.error("[API] PATCH - Error finding record:", {
        error: findError,
        errorMessage: findError.message,
        errorDetails: findError.details,
        errorHint: findError.hint,
        errorCode: findError.code,
      });
      return Response.json(
        { success: false, error: "Record not found", details: findError },
        { status: 404 }
      );
    }

    console.error("[API] PATCH - Found record:", existingRecord);

    // Set temporary token first
    await supabase.rpc("set_temporary_token", { token: temporary_token });

    // Cast user_id to integer
    const numericUserId = parseInt(user_id);
    if (isNaN(numericUserId)) {
      console.error("[API] PATCH - Invalid user_id:", { user_id });
      return Response.json(
        {
          success: false,
          error: "Invalid user ID - must be a number",
          details: { providedId: user_id },
        },
        { status: 400 }
      );
    }

    // Update record directly instead of using RPC
    const { data, error } = await supabase
      .from("ra_lead_line_item_col")
      .update({
        user_id: numericUserId,
        temporary_token: null,
        token_expiry: null,
      })
      .eq("temporary_token", temporary_token)
      .select()
      .single();

    if (error) {
      console.error("[API] PATCH - Error linking record:", {
        error,
        errorMessage: error.message,
        errorDetails: error.details,
        errorHint: error.hint,
        errorCode: error.code,
        providedUserId: user_id,
        recordDetails: existingRecord,
      });
      return Response.json(
        {
          success: false,
          error: error.message,
          details: {
            code: error.code,
            hint: error.hint,
            details: error.details,
          },
        },
        { status: 500 }
      );
    }

    // Verify the update worked
    const { data: verifyRecord, error: verifyError } = await supabase
      .from("ra_lead_line_item_col")
      .select("*")
      .eq("temporary_token", temporary_token)
      .single();

    if (verifyError) {
      console.error("[API] PATCH - Error verifying update:", verifyError);
    } else {
      console.error("[API] PATCH - Record after update:", verifyRecord);
    }

    console.error("[API] PATCH - Successfully linked record:", data);
    return Response.json({ success: true, data });
  } catch (error) {
    console.error("Error linking record to user:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// Get record by token
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return Response.json(
        { success: false, error: "Token is required" },
        { status: 400 }
      );
    }

    // Set temporary token via RPC
    await supabase.rpc("set_temporary_token", { token });

    const { data, error } = await supabase
      .from("ra_lead_line_item_col")
      .select("*")
      .eq("temporary_token", token)
      .single();

    if (error) throw error;

    return Response.json({ success: true, data });
  } catch (error) {
    console.error("Error fetching record:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
