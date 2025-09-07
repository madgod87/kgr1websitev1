import { supabase } from '@/lib/supabase'
import bcryptjs from 'bcryptjs'

interface Admin {
  id: string
  userid: string
  password_hash: string
  role: 'main_admin' | 'sub_admin'
  created_at: string
  is_active: boolean
  created_by?: string
}

interface CreateSubAdminResult {
  success: boolean
  admin?: Admin
  error?: string
}

export async function createSubAdmin(
  createdBy: string,
  userid: string,
  password: string
): Promise<CreateSubAdminResult> {
  try {
    // Using the shared supabase client

    // Check if userid already exists
    const { data: existingAdmin } = await supabase
      .from('admins')
      .select('userid')
      .eq('userid', userid)
      .single()

    if (existingAdmin) {
      return {
        success: false,
        error: 'An admin with this User ID already exists'
      }
    }

    // Hash the password
    const saltRounds = 12
    const passwordHash = await bcryptjs.hash(password, saltRounds)

    // Create the sub-admin
    const { data: newAdmin, error } = await supabase
      .from('admins')
      .insert({
        userid,
        password_hash: passwordHash,
        role: 'sub_admin',
        created_by: createdBy,
        is_active: true
      })
      .select()
      .single()

    if (error) {
      console.error('Database error creating sub-admin:', error)
      return {
        success: false,
        error: 'Failed to create sub-admin'
      }
    }

    return {
      success: true,
      admin: newAdmin
    }
  } catch (error) {
    console.error('Error creating sub-admin:', error)
    return {
      success: false,
      error: 'Internal server error'
    }
  }
}

export async function getAllAdmins(): Promise<Admin[]> {
  try {
    // Using the shared supabase client

    const { data: admins, error } = await supabase
      .from('admins')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Database error fetching admins:', error)
      return []
    }

    return admins || []
  } catch (error) {
    console.error('Error fetching admins:', error)
    return []
  }
}

export async function updateAdminStatus(adminId: string, isActive: boolean): Promise<boolean> {
  try {
    // Using the shared supabase client

    const { error } = await supabase
      .from('admins')
      .update({ is_active: isActive })
      .eq('id', adminId)

    if (error) {
      console.error('Database error updating admin status:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error updating admin status:', error)
    return false
  }
}

export async function getAdminById(adminId: string): Promise<Admin | null> {
  try {
    // Using the shared supabase client

    const { data: admin, error } = await supabase
      .from('admins')
      .select('*')
      .eq('id', adminId)
      .eq('is_active', true)
      .single()

    if (error || !admin) {
      return null
    }

    return admin
  } catch (error) {
    console.error('Error fetching admin by ID:', error)
    return null
  }
}

export async function verifyAdminCredentials(userid: string, password: string): Promise<Admin | null> {
  try {
    // Using the shared supabase client

    const { data: admin, error } = await supabase
      .from('admins')
      .select('*')
      .eq('userid', userid)
      .eq('is_active', true)
      .single()

    if (error || !admin) {
      return null
    }

    // Verify password
    const isPasswordValid = await bcryptjs.compare(password, admin.password_hash)
    
    if (!isPasswordValid) {
      return null
    }

    return admin
  } catch (error) {
    console.error('Error verifying admin credentials:', error)
    return null
  }
}

export async function changeAdminPassword(adminId: string, newPassword: string): Promise<boolean> {
  try {
    // Using the shared supabase client

    // Hash the new password
    const saltRounds = 12
    const passwordHash = await bcryptjs.hash(newPassword, saltRounds)

    const { error } = await supabase
      .from('admins')
      .update({ password_hash: passwordHash })
      .eq('id', adminId)

    if (error) {
      console.error('Database error updating admin password:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error updating admin password:', error)
    return false
  }
}
