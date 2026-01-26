import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Skip middleware if Supabase env vars are not set
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.next()
  }

  let response = NextResponse.next({
    request,
  })

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options)
            })
          },
        },
      }
    )

    // Refresh session if expired - required for Server Components
    // Don't throw if this fails, just continue
    await supabase.auth.getUser().catch(() => {
      // Ignore auth errors in middleware - user might not be logged in
    })
  } catch (error) {
    // If any error occurs, return the response anyway
    // This ensures the middleware never fails completely
    return response
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match only dashboard routes that need auth
     * Skip root path, public pages, API routes, and static files
     */
    '/dashboard/:path*',
  ],
}
