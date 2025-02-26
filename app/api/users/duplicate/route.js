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
    const { data: users, error } = await supabase
      .from("ra_users_duplicate")
      .select("id, userid, name, is_social_login, social_provider")
      .eq("userid", userid);

    if (error) {
      // console.error("Error checking user existence:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const existingUser = users && users.length > 0 ? users[0] : null;
    // console.log("Found user:", existingUser);

    // Ensure we return the ID as a number, not a string
    return NextResponse.json({
      exists: !!existingUser,
      user: existingUser,
      numericId: existingUser ? parseInt(existingUser.id) : null,
      name: existingUser?.name || null,
      isSocialLogin: existingUser?.is_social_login || false,
      socialProvider: existingUser?.social_provider || null,
    });
  } catch (error) {
    // console.error("Error checking user:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    
    // If an ID is provided, update that specific user
    if (body.id) {
      const { data, error } = await supabase
        .from("ra_users_duplicate")
        .update({
          name: body.name,
          userid: body.userid, // Update with Google userid
          email: body.email,
          country_code: body.country_code,
          mobile_number: body.mobile_number,
          company_name: body.company_name,
          is_social_login: body.is_social_login !== undefined ? body.is_social_login : true,
          social_provider: body.social_provider || "email,google",
          updated_at: new Date().toISOString(),
        })
        .eq("id", body.id)
        .select();

      if (error) throw error;

      return NextResponse.json({
        message: "User updated successfully",
        user: data[0],
        numericId: parseInt(data[0].id),
      });
    }

    // Check if user already exists by either email or userid
    const { data: existingUsers, error: searchError } = await supabase
      .from("ra_users_duplicate")
      .select("*")
      .or(`email.eq."${body.email}",userid.eq."${body.userid}"`);

    if (searchError) throw searchError;

    const existingUser = existingUsers && existingUsers.length > 0 ? existingUsers[0] : null;

    if (existingUser) {
      // console.log("Updating existing user:", existingUser.id);
      // If user exists, update their information
      const { data, error } = await supabase
        .from("ra_users_duplicate")
        .update({
          name: body.name,
          userid: body.userid,
          email: body.email, // Update email in case it changed
          country_code: body.country_code,
          mobile_number: body.mobile_number,
          company_name: body.company_name,
          is_social_login: body.is_social_login !== undefined ? body.is_social_login : existingUser.is_social_login,
          social_provider: body.social_provider || existingUser.social_provider,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingUser.id)
        .select();

      if (error) throw error;

      // console.log("User updated:", data[0]);
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

    // Determine if this is a social login
    const isSocialLogin = body.is_social_login !== undefined ? body.is_social_login : false;
    const socialProvider = body.social_provider || (isSocialLogin ? "google" : "email"); // Default based on login type

    const { data, error } = await supabase
      .from("ra_users_duplicate")
      .insert([
        {
          email: body.email,
          password: hashedPassword,
          name: body.name,
          userid: body.userid,
          country_code: body.country_code,
          mobile_number: body.mobile_number,
          company_name: body.company_name,
          is_social_login: isSocialLogin,
          social_provider: socialProvider,
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
    // console.error("API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process user" },
      { status: 500 }
    );
  }
}
