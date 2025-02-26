import { supabase } from "@/lib/supabase";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const clerkUserId = searchParams.get("userId");

    if (!clerkUserId) {
      return Response.json({ error: "User ID is required" }, { status: 400 });
    }

    console.log("Fetching requirements for Clerk user:", clerkUserId);

    // First get the user's ID from ra_users_duplicate
    const { data: userData, error: userError } = await supabase
      .from("ra_users_duplicate")
      .select("id, userid, email")
      .eq("userid", clerkUserId)
      .single();

    if (userError) {
      console.error("Error fetching user:", userError);
      return Response.json({ error: userError.message }, { status: 500 });
    }

    if (!userData) {
      console.error("No user found for ID:", clerkUserId);
      return Response.json({ success: true, data: [] });
    }

    console.log("Found user in ra_users_duplicate:", userData);

    // Get all requirements for this user
    const { data: requirements, error: reqError } = await supabase
      .from("ra_lead_line_item_col")
      .select("*")
      .eq("user_id", userData.id)
      .order("created_at", { ascending: false });

    if (reqError) {
      console.error("Error fetching requirements:", reqError);
      return Response.json({ error: reqError.message }, { status: 500 });
    }

    console.log("Found requirements:", {
      count: requirements?.length,
      requirements,
    });

    // Transform all requirements to match RequirementCard props
    const transformedData = (requirements || []).map((req) => ({
      title: req.domain || "New Requirement",
      level: req.seniority || "Not Specified",
      duration: req.engagement_duration || "Not Specified",
      role: req.domain || "Role Not Specified",
      mustHaveSkills: Array.isArray(req.must_have)
        ? req.must_have.join(", ")
        : "None specified",
      goodToHaveSkills: Array.isArray(req.good_to_have)
        ? req.good_to_have.join(", ")
        : "None specified",
      // Add metadata for debugging
      created_at: req.created_at,
      user_id: req.user_id,
      temporary_token: req.temporary_token,
    }));

    console.log("Transformed data:", transformedData);

    return Response.json({ success: true, data: transformedData });
  } catch (error) {
    console.error("Error in requirements API:", error);
    console.error("Full error details:", {
      message: error.message,
      stack: error.stack,
    });
    return Response.json({ error: error.message }, { status: 500 });
  }
}
