import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// GET - Fetch all notifications
export async function GET() {
  try {
    const { data: notifications, error } = await supabaseAdmin
      .from('notifications')
      .select(`
        *,
        admins!notifications_created_by_fkey(userid)
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Get notifications error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch notifications' },
        { status: 500 }
      )
    }

    return NextResponse.json({ notifications: notifications || [] })
  } catch (error) {
    console.error('Get notifications API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Create new notification (with file upload support)
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const title = formData.get('title') as string
    const content = formData.get('content') as string
    const is_active = formData.get('is_active') === 'true'
    const adminId = formData.get('adminId') as string
    const dynamicUrl = formData.get('dynamicUrl') as string
    const urlTitle = formData.get('urlTitle') as string
    const file = formData.get('file') as File | null

    if (!title || !content || !adminId) {
      return NextResponse.json(
        { error: 'Title, content, and admin ID are required' },
        { status: 400 }
      )
    }

    let fileUrl = null
    let fileName = null
    let fileType = null
    let fileSize = null

    // Handle file upload if present
    if (file && file.size > 0) {
      // Validate file type
      const allowedTypes = ['text/html', 'application/pdf', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
      const allowedExtensions = ['html', 'pdf', 'xls', 'xlsx']
      const fileExt = file.name.split('.').pop()?.toLowerCase()
      
      if (!allowedTypes.includes(file.type) || !fileExt || !allowedExtensions.includes(fileExt)) {
        return NextResponse.json(
          { error: 'Only HTML, PDF, and Excel files are allowed' },
          { status: 400 }
        )
      }

      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json(
          { error: 'File size must be less than 10MB' },
          { status: 400 }
        )
      }

      // Create unique filename
      const uniqueFileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      
      // Convert File to ArrayBuffer then to Buffer
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      
      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
        .from('notification-files')
        .upload(uniqueFileName, buffer, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type
        })

      if (uploadError) {
        console.error('File upload error:', uploadError)
        return NextResponse.json(
          { error: `File upload failed: ${uploadError.message}` },
          { status: 500 }
        )
      }

      // Get public URL
      const { data: { publicUrl } } = supabaseAdmin.storage
        .from('notification-files')
        .getPublicUrl(uniqueFileName)

      fileUrl = publicUrl
      fileName = file.name
      fileType = fileExt
      fileSize = file.size
    }

    // Create notification in database
    const { data: notification, error: dbError } = await supabaseAdmin
      .from('notifications')
      .insert([
        {
          title: title.trim(),
          content: content.trim(),
          is_active,
          created_by: adminId,
          file_url: fileUrl,
          file_name: fileName,
          file_type: fileType,
          file_size: fileSize,
          dynamic_url: dynamicUrl || null,
          url_title: urlTitle || null
        }
      ])
      .select()
      .single()

    if (dbError) {
      console.error('Database insert error:', dbError)
      // Clean up uploaded file if database insert fails
      if (fileUrl && fileName) {
        await supabaseAdmin.storage.from('notification-files').remove([fileName])
      }
      return NextResponse.json(
        { error: `Failed to create notification: ${dbError.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      notification
    })
  } catch (error) {
    console.error('Create notification API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Delete notification with file cleanup
export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json()

    if (!id) {
      return NextResponse.json(
        { error: 'Notification ID is required' },
        { status: 400 }
      )
    }

    // First, get the notification to check if it has files
    const { data: notification, error: fetchError } = await supabaseAdmin
      .from('notifications')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError) {
      console.error('Error fetching notification:', fetchError)
      return NextResponse.json(
        { error: 'Notification not found' },
        { status: 404 }
      )
    }

    // Delete associated file from storage if exists
    if (notification.file_url && notification.file_name) {
      const { error: storageError } = await supabaseAdmin.storage
        .from('notification-files')
        .remove([notification.file_name.split('/').pop() || notification.file_name])

      if (storageError) {
        console.error('Error deleting file from storage:', storageError)
        // Continue with database deletion even if file deletion fails
      }
    }

    // Delete notification from database
    const { error: deleteError } = await supabaseAdmin
      .from('notifications')
      .delete()
      .eq('id', id)

    if (deleteError) {
      console.error('Error deleting notification:', deleteError)
      return NextResponse.json(
        { error: `Failed to delete notification: ${deleteError.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Notification deleted successfully'
    })
  } catch (error) {
    console.error('Delete notification API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT - Update notification
export async function PUT(request: NextRequest) {
  try {
    const { id, title, content, is_active } = await request.json()

    if (!id) {
      return NextResponse.json(
        { error: 'Notification ID is required' },
        { status: 400 }
      )
    }

    const updateData: any = {
      updated_at: new Date().toISOString()
    }
    if (title !== undefined) updateData.title = title
    if (content !== undefined) updateData.content = content
    if (is_active !== undefined) updateData.is_active = is_active

    const { data: notification, error } = await supabaseAdmin
      .from('notifications')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating notification:', error)
      return NextResponse.json(
        { error: 'Failed to update notification' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      notification
    })
  } catch (error) {
    console.error('Update notification API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
