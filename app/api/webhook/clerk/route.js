import { Webhook } from "svix";
import { headers } from "next/headers";
import { createClient } from "@supabase/supabase-js";

// Add OPTIONS handler for CORS preflight
export async function OPTIONS(request) {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST",
      "Access-Control-Allow-Headers":
        "Content-Type, svix-id, svix-timestamp, svix-signature",
    },
  });
}

export async function POST(request) {
  console.log("Webhook request received"); // Add logging

  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    console.error("Missing CLERK_WEBHOOK_SECRET");
    return new Response("Configuration error", {
      status: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
    });
  }

  try {
    // Get the headers
    const headersList = headers();
    const svix_id = headersList.get("svix-id");
    const svix_timestamp = headersList.get("svix-timestamp");
    const svix_signature = headersList.get("svix-signature");

    console.log("Headers received:", { svix_id, svix_timestamp }); // Log headers

    if (!svix_id || !svix_timestamp || !svix_signature) {
      console.error("Missing required headers");
      return new Response("Missing headers", {
        status: 400,
        headers: { "Access-Control-Allow-Origin": "*" },
      });
    }

    // Get the body
    const payload = await request.json();
    const body = JSON.stringify(payload);
    console.log("Webhook payload:", body); // Log payload

    // Verify webhook
    const wh = new Webhook(WEBHOOK_SECRET);
    const evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });

    // Initialize Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const eventType = evt.type;
    console.log("Event type:", eventType); // Log event type

    if (eventType === "user.created" || eventType === "user.updated") {
      const { id, email_addresses, ...attributes } = evt.data;

      // Update to use ra_users table instead of users
      await supabase.from("ra_users").upsert({
        clerk_id: id,
        email: email_addresses?.[0]?.email_address || "",
        attributes: JSON.stringify(attributes), // Ensure attributes are properly stored
      });
      console.log("User data updated:", id);
    }

    if (eventType === "user.deleted") {
      const { id } = evt.data;
      await supabase.from("ra_users").delete().match({ clerk_id: id });
      console.log("User deleted:", id);
    }

    return new Response("Success", {
      status: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
    });
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(error.message, {
      status: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
    });
  }
}
