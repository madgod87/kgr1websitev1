import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// For admin operations
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Database Types
export interface Admin {
  id: string
  userid: string
  password_hash: string
  role: 'main_admin' | 'sub_admin'
  created_by?: string | null
  created_at: string
  updated_at: string
  is_active: boolean
}

export interface Notification {
  id: string
  title: string
  content: string
  created_by: string
  created_at: string
  updated_at: string
  is_active: boolean
}

export interface GalleryImage {
  id: string
  filename: string
  url: string
  alt_text?: string
  uploaded_by: string
  uploaded_at: string
  file_size: number
}

export interface FileUpload {
  id: string
  filename: string
  original_name: string
  url: string
  file_type: string
  file_size: number
  uploaded_by: string
  uploaded_at: string
  category: 'pdf' | 'excel' | 'image' | 'other'
}
