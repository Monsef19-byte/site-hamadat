import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Routes that require authentication (login page itself is excluded)
  const isLoginPage = pathname === '/admin/login';
  const protectedRoutes = ['/dashboard', '/admin'];
  const isProtectedRoute = !isLoginPage && protectedRoutes.some(route => pathname.startsWith(route));

  // Check if the request is for a protected route
  if (isProtectedRoute) {
    // Check if user has admin auth token (you'll set this during login)
    const authToken = request.cookies.get('admin-auth-token')?.value;
    const adminAuth = request.cookies.get('admin-verified')?.value;

    // If no auth token, redirect to admin login
    if (!authToken || adminAuth !== 'true') {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
};
