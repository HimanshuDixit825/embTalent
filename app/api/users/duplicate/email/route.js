import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

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

    // Get user's email from ra_users_duplicate
    const { data: users, error } = await supabase
      .from("ra_users_duplicate")
      .select("email")
      .eq("userid", userid)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      email: users?.email || null
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
