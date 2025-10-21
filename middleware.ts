import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyTokenForMiddleware } from '@/lib/jwt-utils'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Define public routes (no authentication required)
  const publicRoutes = [
    '/',
    '/login',
    '/signup',
    '/admin/login',
    '/about',
    '/contact',
    '/shop',
    '/collection',
  ]

  // Check if route is public
  const isPublicRoute = publicRoutes.includes(pathname) ||
                        pathname.startsWith('/api/auth/') ||
                        pathname.startsWith('/_next/') ||
                        pathname === '/favicon.ico'

  if (isPublicRoute) {
    return NextResponse.next()
  }

  // Check if route is admin route
  const isAdminRoute = pathname.startsWith('/admin') || pathname.startsWith('/api/admin')

  // Check if route is user dashboard
  const isUserDashboard = pathname === '/dashboard'

  // Extract access token from cookies
  const accessToken = request.cookies.get('accessToken')?.value

  // If no token, redirect to appropriate login page
  if (!accessToken) {
    if (isAdminRoute) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
    if (isUserDashboard) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    return NextResponse.next()
  }

  // Verify token
  const decoded = await verifyTokenForMiddleware(accessToken)

  // If token is invalid or expired
  if (!decoded) {
    if (isAdminRoute) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
    if (isUserDashboard) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    return NextResponse.next()
  }

  // Check role for admin routes
  if (isAdminRoute && decoded.role !== 'admin') {
    // User is authenticated but not an admin - redirect to home with error
    const url = new URL('/', request.url)
    url.searchParams.set('error', 'admin_access_required')
    return NextResponse.redirect(url)
  }

  // Allow request
  return NextResponse.next()
}

// Configure matcher to run middleware only on relevant routes
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
