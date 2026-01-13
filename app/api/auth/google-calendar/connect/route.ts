import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';
export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { business_id } = body;

    if (!business_id) {
      return NextResponse.json({ error: "business_id is required" }, { status: 400 });
    }

    // Verify the business belongs to the user
    const { data: business, error: businessError } = await supabase
      .from("businesses")
      .select("id")
      .eq("id", business_id)
      .eq("owner_id", user.id)
      .single();

    if (businessError || !business) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 });
    }

    // Construct Google OAuth URL
    const redirectUri = `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/auth/google-calendar/callback`;
    const clientId = process.env.GOOGLE_CLIENT_ID;

    if (!clientId) {
      return NextResponse.json(
        { error: "Google OAuth not configured" },
        { status: 500 }
      );
    }

    const scopes = [
      "https://www.googleapis.com/auth/calendar",
      "https://www.googleapis.com/auth/calendar.events",
    ].join(" ");

    const state = Buffer.from(
      JSON.stringify({ business_id, user_id: user.id })
    ).toString("base64");

    const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    authUrl.searchParams.set("client_id", clientId);
    authUrl.searchParams.set("redirect_uri", redirectUri);
    authUrl.searchParams.set("response_type", "code");
    authUrl.searchParams.set("scope", scopes);
    authUrl.searchParams.set("access_type", "offline");
    authUrl.searchParams.set("prompt", "consent");
    authUrl.searchParams.set("state", state);

    return NextResponse.json({ url: authUrl.toString() });
  } catch (error) {
    console.error("Error initiating Google Calendar OAuth:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
