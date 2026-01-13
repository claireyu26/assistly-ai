import { createServerSupabaseClient } from "@/lib/supabase";
import { NextResponse } from "next/server";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    if (error) {
      return redirect("/dashboard/settings?error=oauth_cancelled");
    }

    if (!code || !state) {
      return redirect("/dashboard/settings?error=invalid_request");
    }

    // Decode state
    let stateData;
    try {
      stateData = JSON.parse(Buffer.from(state, "base64").toString());
    } catch {
      return redirect("/dashboard/settings?error=invalid_state");
    }

    const { business_id, user_id } = stateData;

    // Verify user is authenticated
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || user.id !== user_id) {
      return redirect("/dashboard/settings?error=unauthorized");
    }

    // Exchange code for tokens
    const redirectUri = `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/auth/google-calendar/callback`;
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error("Token exchange error:", errorData);
      return redirect("/dashboard/settings?error=token_exchange_failed");
    }

    const tokens = await tokenResponse.json();
    const { access_token, refresh_token, expires_in } = tokens;

    // Calculate expiration time
    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + (expires_in || 3600));

    // Store tokens in database
    const { error: upsertError } = await supabase
      .from("google_calendar_tokens")
      .upsert(
        {
          business_id,
          access_token,
          refresh_token,
          expires_at: expiresAt.toISOString(),
        },
        {
          onConflict: "business_id",
        }
      );

    if (upsertError) {
      console.error("Error storing tokens:", upsertError);
      return redirect("/dashboard/settings?error=storage_failed");
    }

    return redirect("/dashboard/settings?success=calendar_connected");
  } catch (error) {
    console.error("Error in Google Calendar callback:", error);
    return redirect("/dashboard/settings?error=internal_error");
  }
}
