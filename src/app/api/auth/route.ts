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
    const { userid, password } = await request.json()

    if (!userid || !password) {
      return NextResponse.json(
        { error: 'User ID and password are required' },
        { status: 400 }
      )
    }

    console.log('Auth API: Checking admin user:', userid)

    // Query the admin user from Supabase
    const { data: adminData, error: queryError } = await supabaseAdmin
      .from('admins')
      .select('*')
      .eq('userid', userid)
      .eq('is_active', true)
      .single()

    if (queryError || !adminData) {
      console.log('Auth API: Admin not found:', queryError)
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    console.log('Auth API: Admin found:', adminData.userid, adminData.role)

    // Verify password
    const passwordMatch = await bcrypt.compare(password, adminData.password_hash)
    
    if (!passwordMatch) {
      console.log('Auth API: Password does not match')
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    console.log('Auth API: Password verified')

    // Return admin data (excluding password hash)
    return NextResponse.json({
      success: true,
      admin: {
        id: adminData.id,
        userid: adminData.userid,
        role: adminData.role
      }
    })
  } catch (error) {
    console.error('Auth API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
