import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcrypt'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = params.id
    const { userid, password, role, notification_access, photo_access, is_active } = await request.json()

    if (!userid || !role) {
      return NextResponse.json(
        { error: 'User ID and role are required' },
        { status: 400 }
      )
    }

    console.log('Updating user:', userId, userid, role)

    // Check if new userid already exists (if changed)
    const { data: existingUser } = await supabaseAdmin
      .from('admins')
      .select('userid, id')
      .eq('userid', userid)
      .single()

    if (existingUser && existingUser.id !== userId) {
      return NextResponse.json(
        { error: 'User ID already exists' },
        { status: 400 }
      )
    }

    // Prepare update data
    const updateData: any = {
      userid: userid.trim(),
      role,
      notification_access,
      photo_access,
      is_active,
      updated_at: new Date().toISOString()
    }

    // Hash password if provided
    if (password) {
      const saltRounds = 12
      updateData.password_hash = await bcrypt.hash(password, saltRounds)
      console.log('Password will be updated')
    }

    // Update the user
    const { data, error } = await supabaseAdmin
      .from('admins')
      .update(updateData)
      .eq('id', userId)
      .select('id, userid, role, is_active, notification_access, photo_access')
      .single()

    if (error) {
      console.error('Error updating user:', error)
      return NextResponse.json(
        { error: 'Failed to update user' },
        { status: 500 }
      )
    }

    console.log('User updated successfully:', data)

    return NextResponse.json({
      success: true,
      user: data
    })
  } catch (error) {
    console.error('User update API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = params.id

    console.log('Deleting user:', userId)

    // Check if user exists and is not main_admin
    const { data: user, error: fetchError } = await supabaseAdmin
      .from('admins')
      .select('role')
      .eq('id', userId)
      .single()

    if (fetchError || !user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    if (user.role === 'main_admin') {
      return NextResponse.json(
        { error: 'Cannot delete main admin user' },
        { status: 400 }
      )
    }

    // Delete the user
    const { error: deleteError } = await supabaseAdmin
      .from('admins')
      .delete()
      .eq('id', userId)

    if (deleteError) {
      console.error('Error deleting user:', deleteError)
      return NextResponse.json(
        { error: 'Failed to delete user' },
        { status: 500 }
      )
    }

    console.log('User deleted successfully')

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully'
    })
  } catch (error) {
    console.error('User delete API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
