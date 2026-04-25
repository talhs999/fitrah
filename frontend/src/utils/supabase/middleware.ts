import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Admin Route Protection
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // If not logged in, redirect to login
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }

    // Replace this email with the admin's email, or use an environment variable.
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@fitrah.com'
    
    // If logged in but NOT the admin email, redirect to home page
    if (user.email !== adminEmail) {
      const url = request.nextUrl.clone()
      url.pathname = '/'
      return NextResponse.redirect(url)
    }
  }

  // User Account Protection
  if (request.nextUrl.pathname.startsWith('/account')) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }
  }

  // Prevent logged-in users from accessing login and register pages
  if (user && (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register')) {
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@fitrah.com'
    const url = request.nextUrl.clone()
    
    if (user.email === adminEmail) {
      url.pathname = '/admin'
    } else {
      url.pathname = '/account'
    }
    
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
