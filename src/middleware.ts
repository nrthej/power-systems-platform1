// src/middleware.ts
import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAuth = !!token
    const isAuthPage = req.nextUrl.pathname.startsWith('/')
    const isApiAuthRoute = req.nextUrl.pathname.startsWith('/api/auth')
    const isTestApiRoute = req.nextUrl.pathname.startsWith('/api/test')
    const isDashboard = req.nextUrl.pathname.startsWith('/dashboard')

    // Allow access to login page and auth API routes
    if (isApiAuthRoute || isTestApiRoute) {
      return NextResponse.next()
    }

    // If accessing login page while authenticated, redirect to dashboard
    if (isAuth && req.nextUrl.pathname === '/') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    // If accessing protected routes without authentication, redirect to login
    if (!isAuth && isDashboard) {
      return NextResponse.redirect(new URL('/', req.url))
    }

    // If not authenticated and trying to access root, allow (login page)
    if (!isAuth && req.nextUrl.pathname === '/') {
      return NextResponse.next()
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to login page without token
        if (req.nextUrl.pathname === '/') {
          return true
        }
        
        // Require token for all other pages
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth API routes)
     * - api/test (Test API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api/auth|api/test|_next/static|_next/image|favicon.ico).*)',
  ],
}