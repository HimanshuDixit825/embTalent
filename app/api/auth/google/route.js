import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs";
import { supabase } from "@/lib/supabase";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, userId, firstName, lastName, source } = body;

    if (!email || !userId) {
      return NextResponse.json(
        { error: "Email and userId are required" },
        { status: 400 }
      );
    }

    console.log(`Google auth API called with email: ${email}, userId: ${userId}, source: ${source}`);

    // Check if user exists in our database by email
    const { data: existingUsers, error: searchError } = await supabase
      .from("ra_users_duplicate")
      .select("*")
      .eq("email", email);

    if (searchError) {
      console.error("Error checking user existence:", searchError);
      return NextResponse.json(
        { error: searchError.message },
        { status: 500 }
      );
    }

    const existingUser = existingUsers && existingUsers.length > 0 ? existingUsers[0] : null;
    let numericId = null;

    if (existingUser) {
      console.log("User exists in database:", existingUser.id);
      
      // If user exists, update their information to include Google auth
      const { data, error } = await supabase
        .from("ra_users_duplicate")
        .update({
          name: `${firstName || ""} ${lastName || ""}`.trim() || existingUser.name,
          userid: userId, // Update with Google userid
          is_social_login: true,
          social_provider: existingUser.social_provider 
            ? (existingUser.social_provider.includes("google") 
                ? existingUser.social_provider 
                : `${existingUser.social_provider},google`)
            : "google",
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingUser.id)
        .select();

      if (error) {
        console.error("Error updating user:", error);
        return NextResponse.json(
          { error: error.message },
          { status: 500 }
        );
      }

      numericId = parseInt(existingUser.id);
      console.log("User updated successfully:", numericId);
    } else {
      console.log("User doesn't exist, creating new user");
      
      // User doesn't exist, create new user
      const { data, error } = await supabase
        .from("ra_users_duplicate")
        .insert([
          {
            email: email,
            password: Math.random().toString(36).slice(-8), // Random password
            name: `${firstName || ""} ${lastName || ""}`.trim(),
            userid: userId,
            country_code: null,
            mobile_number: null,
            company_name: null,
            is_social_login: true,
            social_provider: "google",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        .select();

      if (error) {
        console.error("Error creating user:", error);
        return NextResponse.json(
          { error: error.message },
          { status: 500 }
        );
      }

      numericId = parseInt(data[0].id);
      console.log("User created successfully:", numericId);
    }

    // Return success response
    return NextResponse.json({
      success: true,
      numericId,
      message: existingUser ? "User updated successfully" : "User created successfully",
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process user" },
      { status: 500 }
    );
  }
}
