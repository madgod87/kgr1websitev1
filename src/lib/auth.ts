import bcrypt from 'bcryptjs'
import { supabaseAdmin } from './supabase'
import { Admin } from './supabase'

export interface LoginCredentials {
  userid: string
  password: string
}

export interface AuthResult {
  success: boolean
  admin?: Admin
  error?: string
}

export async function authenticateAdmin(credentials: LoginCredentials): Promise<AuthResult> {
  try {
    const { userid, password } = credentials

    // Get admin from database
    const { data: admin, error } = await supabaseAdmin
      .from('admins')
      .select('*')
      .eq('userid', userid)
      .eq('is_active', true)
      .single()

    if (error || !admin) {
      return {
        success: false,
        error: 'Invalid credentials'
      }
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, admin.password_hash)
    
    if (!passwordMatch) {
      return {
        success: false,
        error: 'Invalid credentials'
      }
    }

    return {
      success: true,
      admin: admin as Admin
    }
  } catch (error) {
    console.error('Authentication error:', error)
    return {
      success: false,
      error: 'Authentication failed'
    }
  }
}

export async function createSubAdmin(
  mainAdminId: string, 
  userid: string, 
  password: string
): Promise<AuthResult> {
  try {
    // Verify main admin permissions
    const { data: mainAdmin, error: mainAdminError } = await supabaseAdmin
      .from('admins')
      .select('*')
      .eq('id', mainAdminId)
      .eq('role', 'main_admin')
      .eq('is_active', true)
      .single()

    if (mainAdminError || !mainAdmin) {
      return {
        success: false,
        error: 'Unauthorized: Only main admin can create sub-admins'
      }
    }

    // Check if userid already exists
    const { data: existingAdmin } = await supabaseAdmin
      .from('admins')
      .select('userid')
      .eq('userid', userid)
      .single()

    if (existingAdmin) {
      return {
        success: false,
        error: 'User ID already exists'
      }
    }

    // Hash password
    const saltRounds = 12
    const passwordHash = await bcrypt.hash(password, saltRounds)

    // Create sub-admin
    const { data: newAdmin, error: createError } = await supabaseAdmin
      .from('admins')
      .insert([
        {
          userid,
          password_hash: passwordHash,
          role: 'sub_admin',
          created_by: mainAdminId,
          is_active: true
        }
      ])
      .select()
      .single()

    if (createError || !newAdmin) {
      return {
        success: false,
        error: 'Failed to create sub-admin'
      }
    }

    return {
      success: true,
      admin: newAdmin as Admin
    }
  } catch (error) {
    console.error('Create sub-admin error:', error)
    return {
      success: false,
      error: 'Failed to create sub-admin'
    }
  }
}

export async function getAllAdmins(): Promise<Admin[]> {
  try {
    const { data: admins, error } = await supabaseAdmin
      .from('admins')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching admins:', error)
      return []
    }

    return admins as Admin[]
  } catch (error) {
    console.error('Get all admins error:', error)
    return []
  }
}

export async function updateAdminStatus(adminId: string, isActive: boolean): Promise<boolean> {
  try {
    const { error } = await supabaseAdmin
      .from('admins')
      .update({ is_active: isActive })
      .eq('id', adminId)

    return !error
  } catch (error) {
    console.error('Update admin status error:', error)
    return false
  }
}
