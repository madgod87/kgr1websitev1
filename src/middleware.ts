import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('admin-token')?.value

  // Protected admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    try {
      jwt.verify(token, process.env.NEXTAUTH_SECRET!)
    } catch (error) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // If user is authenticated and tries to access login page, redirect to admin
  if (request.nextUrl.pathname === '/login' && token) {
    try {
      jwt.verify(token, process.env.NEXTAUTH_SECRET!)
      return NextResponse.redirect(new URL('/admin', request.url))
    } catch (error) {
      // Invalid token, allow access to login
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/login']
}
