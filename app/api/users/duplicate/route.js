// app/api/users/duplicate/route.js
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userid = searchParams.get("userid");

    if (!userid) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Check if user exists by userid
    const { data: existingUser, error } = await supabase
      .from("ra_users_duplicate")
      .select("id, userid")
      .eq("userid", userid)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 is "not found" error
      console.error("Error checking user existence:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Ensure we return the ID as a number, not a string
    return NextResponse.json({
      exists: !!existingUser,
      user: existingUser,
      numericId: existingUser ? parseInt(existingUser.id) : null,
    });
  } catch (error) {
    console.error("Error checking user:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from("ra_users_duplicate")
      .select("*")
      .eq("email", body.email)
      .single();

    if (existingUser) {
      // If user exists, update their information
      const { data, error } = await supabase
        .from("ra_users_duplicate")
        .update({
          name: body.name,
          userid: body.userid,
          updated_at: new Date().toISOString(),
        })
        .eq("email", body.email)
        .select();

      if (error) throw error;

      return NextResponse.json({
        message: "User updated successfully",
        user: data[0],
        numericId: parseInt(data[0].id),
      });
    }

    // If user doesn't exist, create new user
    // Hash password before storing
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(body.password, salt);

    const { data, error } = await supabase
      .from("ra_users_duplicate")
      .insert([
        {
          email: body.email,
          password: hashedPassword,
          name: body.name,
          userid: body.userid,
          is_social_login: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) throw error;

    return NextResponse.json({
      message: "User created successfully",
      user: data[0],
      numericId: parseInt(data[0].id),
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process user" },
      { status: 500 }
    );
  }
}
