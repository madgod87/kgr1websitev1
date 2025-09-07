import { NextRequest, NextResponse } from 'next/server'
import { createSubAdmin } from '@/lib/auth'
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

    // Get current admin from token
    const cookieStore = await cookies()
    const token = cookieStore.get('admin-token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET!) as { adminId: string; userid: string; role: string }

    if (decoded.role !== 'main_admin') {
      return NextResponse.json(
        { error: 'Only main admin can create sub-admins' },
        { status: 403 }
      )
    }

    const result = await createSubAdmin(decoded.adminId, userid, password)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      admin: {
        id: result.admin?.id,
        userid: result.admin?.userid,
        role: result.admin?.role,
        created_at: result.admin?.created_at
      }
    })
  } catch (error) {
    console.error('Create admin API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
