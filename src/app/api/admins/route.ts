import { NextRequest, NextResponse } from 'next/server'
import { getAllAdmins, updateAdminStatus } from '@/lib/auth'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

export async function GET(request: NextRequest) {
  try {
    // Get current admin from token
    const cookieStore = cookies()
    const token = cookieStore.get('admin-token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET!) as any

    if (decoded.role !== 'main_admin') {
      return NextResponse.json(
        { error: 'Only main admin can view all admins' },
        { status: 403 }
      )
    }

    const admins = await getAllAdmins()

    // Remove sensitive information
    const safeAdmins = admins.map(admin => ({
      id: admin.id,
      userid: admin.userid,
      role: admin.role,
      created_at: admin.created_at,
      is_active: admin.is_active,
      created_by: admin.created_by
    }))

    return NextResponse.json({ admins: safeAdmins })
  } catch (error) {
    console.error('Get admins API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { adminId, isActive } = await request.json()

    if (!adminId || typeof isActive !== 'boolean') {
      return NextResponse.json(
        { error: 'Admin ID and status are required' },
        { status: 400 }
      )
    }

    // Get current admin from token
    const cookieStore = cookies()
    const token = cookieStore.get('admin-token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET!) as any

    if (decoded.role !== 'main_admin') {
      return NextResponse.json(
        { error: 'Only main admin can update admin status' },
        { status: 403 }
      )
    }

    // Prevent main admin from deactivating themselves
    if (adminId === decoded.adminId && !isActive) {
      return NextResponse.json(
        { error: 'Cannot deactivate your own account' },
        { status: 400 }
      )
    }

    const success = await updateAdminStatus(adminId, isActive)

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to update admin status' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Update admin status API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
