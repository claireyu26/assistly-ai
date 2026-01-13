import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextResponse } from 'next/server';

// This prevents Next.js from trying to pre-render this route as a static HTML file
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();
  
  // Sign out from Supabase
  await supabase.auth.signOut();

  // Determine the redirect URL
  // We use the request URL to determine the origin to ensure it works on both Localhost and Vercel
  const requestUrl = new URL(request.url);
  const redirectUrl = new URL('/', requestUrl.origin);

  return NextResponse.redirect(redirectUrl, {
    status: 303, // Using 303 See Other is standard for a POST-to-GET redirect
  });
}