import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    const userid = searchParams.get("userid");

    if (!email && !userid) {
      return NextResponse.json(
        { error: "Email or userid is required" },
        { status: 400 }
      );
    }

    let query = supabase
      .from("ra_users_duplicate")
      .select("id, email, is_social_login, social_provider, userid");
    
    if (email) {
      query = query.eq("email", email);
    } else if (userid) {
      query = query.eq("userid", userid);
    }
    
    const { data: users, error } = await query;

    if (error) {
      console.error("Error checking user:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const existingUser = users && users.length > 0 ? users[0] : null;

    return NextResponse.json({
      exists: !!existingUser,
      user: existingUser ? {
        id: existingUser.id,
        email: existingUser.email,
        isSocialLogin: existingUser.is_social_login,
        socialProvider: existingUser.social_provider
      } : null
    });
  } catch (error) {
    console.error("Error checking user auth:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
