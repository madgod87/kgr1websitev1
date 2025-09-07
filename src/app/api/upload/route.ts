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

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const adminId = formData.get('adminId') as string
    const uploadType = formData.get('type') as string || 'gallery'
    const category = formData.get('category') as string || 'general'
    const title = formData.get('title') as string || ''
    const description = formData.get('description') as string || ''
    const displayOrder = parseInt(formData.get('displayOrder') as string || '0')

    if (!file || !adminId) {
      return NextResponse.json(
        { error: 'File and admin ID are required' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Only image files are allowed' },
        { status: 400 }
      )
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 5MB' },
        { status: 400 }
      )
    }

    console.log('Uploading file:', file.name, 'Size:', file.size, 'Type:', file.type)

    // Create unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

    // Convert File to ArrayBuffer then to Buffer for Node.js
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Choose bucket based on upload type
    const bucketName = uploadType === 'slideshow' ? 'slideshow-images' : 'gallery-images'
    
    // Upload to Supabase Storage using service role (bypasses RLS)
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from(bucketName)
      .upload(fileName, buffer, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type
      })

    if (uploadError) {
      console.error('Storage upload error:', uploadError)
      return NextResponse.json(
        { error: `Upload failed: ${uploadError.message}` },
        { status: 500 }
      )
    }

    console.log('File uploaded to storage:', fileName)

    // Get public URL
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from(bucketName)
      .getPublicUrl(fileName)

    console.log('Public URL generated:', publicUrl)

    // Save to database based on upload type
    let dbData, dbError
    
    if (uploadType === 'slideshow') {
      const result = await supabaseAdmin
        .from('slideshow_images')
        .insert([
          {
            filename: fileName,
            url: publicUrl,
            title: title || file.name.split('.')[0],
            description: description,
            display_order: displayOrder,
            uploaded_by: adminId,
            file_size: file.size,
            is_active: true
          }
        ])
        .select()
        .single()
      
      dbData = result.data
      dbError = result.error
    } else {
      const result = await supabaseAdmin
        .from('gallery_images')
        .insert([
          {
            filename: fileName,
            url: publicUrl,
            alt_text: file.name.split('.')[0],
            category: category,
            uploaded_by: adminId,
            file_size: file.size
          }
        ])
        .select()
        .single()
      
      dbData = result.data
      dbError = result.error
    }

    if (dbError) {
      console.error('Database insert error:', dbError)
      // Clean up uploaded file if database insert fails
      await supabaseAdmin.storage.from(bucketName).remove([fileName])
      return NextResponse.json(
        { error: `Database error: ${dbError.message}` },
        { status: 500 }
      )
    }

    console.log('Image saved to database:', dbData)

    return NextResponse.json({
      success: true,
      image: dbData
    })
  } catch (error) {
    console.error('Upload API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
