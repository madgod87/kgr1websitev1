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

export async function POST(request: NextRequest) {
  try {
    const { userid, password, role, notification_access, photo_access, created_by } = await request.json()

    if (!userid || !password || !role) {
      return NextResponse.json(
        { error: 'User ID, password, and role are required' },
        { status: 400 }
      )
    }

    console.log('Creating user:', userid, role)

    // Check if user already exists
    const { data: existingUser } = await supabaseAdmin
      .from('admins')
      .select('userid')
      .eq('userid', userid)
      .single()

    if (existingUser) {
      return NextResponse.json(
        { error: 'User ID already exists' },
        { status: 400 }
      )
    }

    // Hash the password
    const saltRounds = 12
    const passwordHash = await bcrypt.hash(password, saltRounds)

    // Create the user
    const { data, error } = await supabaseAdmin
      .from('admins')
      .insert([
        {
          userid: userid.trim(),
          password_hash: passwordHash,
          role,
          notification_access,
          photo_access,
          created_by,
          is_active: true
        }
      ])
      .select('id, userid, role')
      .single()

    if (error) {
      console.error('Error creating user:', error)
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      )
    }

    console.log('User created successfully:', data)

    return NextResponse.json({
      success: true,
      user: data
    })
  } catch (error) {
    console.error('User creation API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
