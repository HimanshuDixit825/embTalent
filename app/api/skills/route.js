import { supabase } from "@/utils/supabase";
import { NextResponse } from "next/server";

export async function POST(request) {
  // Add CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  // Handle preflight request
  if (request.method === "OPTIONS") {
    return new NextResponse(null, { status: 200, headers });
  }

  try {
    const body = await request.json();
    console.log("Looking up user with Clerk ID:", body.user_id);

    // First get the user's ID from ra_users_duplicate
    const { data: userData, error: userError } = await supabase
      .from("ra_users_duplicate")
      .select("id")
      .eq("userid", body.user_id)
      .single();

    if (userError || !userData) {
      console.error("Error finding user:", userError);
      return NextResponse.json(
        {
          error: "User not found in database",
          details: `Looked for Clerk ID: ${body.user_id}`,
        },
        { status: 404, headers }
      );
    }

    console.log("Found user with ID:", userData.id);

    // Required fields validation
    const missingFields = [];
    if (!body.main_technology) missingFields.push("main_technology");
    if (!body.category) missingFields.push("category");

    if (missingFields.length > 0) {
      const errorMessage = `Missing required fields: ${missingFields.join(
        ", "
      )}`;
      console.error(errorMessage);
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    // Use the numeric ID from userData for the insert
    console.log("Inserting skills with user_id:", userData.id);
    const { data, error } = await supabase
      .from("test_skills")
      .insert([
        {
          user_id: userData.id, // Use the numeric ID, not the Clerk ID
          main_technology: body.main_technology,
          selected_technologies: body.selected_technologies || [],
          category: body.category,
        },
      ])
      .select();

    if (error) {
      console.error("Supabase insert error:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
      return NextResponse.json(
        {
          error: `Database error: ${error.message}`,
          details: error.details,
          code: error.code,
        },
        { status: 500, headers }
      );
    }

    return NextResponse.json(
      {
        message: "Skills stored successfully",
        data,
        user_id: userData.id,
      },
      { status: 201, headers }
    );
  } catch (error) {
    console.error("Internal server error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers }
    );
  }
}
