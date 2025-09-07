import { NextRequest, NextResponse } from 'next/server'
import { authenticateAdmin } from '@/lib/auth'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

export async function POST(request: NextRequest) {
  try {
    const { userid, password } = await request.json()

    if (!userid || !password) {
      return NextResponse.json(
        { error: 'User ID and password are required' },
        { status: 400 }
      )
    }

    const authResult = await authenticateAdmin({ userid, password })

    if (!authResult.success || !authResult.admin) {
      return NextResponse.json(
        { error: authResult.error || 'Authentication failed' },
        { status: 401 }
      )
    }

    // Create JWT token
    const token = jwt.sign(
      { 
        adminId: authResult.admin.id, 
        userid: authResult.admin.userid,
        role: authResult.admin.role 
      },
      process.env.NEXTAUTH_SECRET!,
      { expiresIn: '24h' }
    )

    // Set HTTP-only cookie
    const cookieStore = await cookies()
    cookieStore.set('admin-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400 // 24 hours
    })

    return NextResponse.json({
      success: true,
      admin: {
        id: authResult.admin.id,
        userid: authResult.admin.userid,
        role: authResult.admin.role
      }
    })
  } catch (error) {
    console.error('Login API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
