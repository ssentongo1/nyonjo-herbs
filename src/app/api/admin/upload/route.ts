import { createAdminClient } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const bucket = formData.get('bucket') as string || 'product-images'
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/jpg']
    const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo']
    const allowedTypes = [...allowedImageTypes, ...allowedVideoTypes]
    
    if (!allowedTypes.includes(file.type.toLowerCase())) {
      return NextResponse.json(
        { error: 'Invalid file type. Only images (JPG, PNG, WebP, GIF) and videos (MP4, WebM, MOV, AVI) are allowed.' },
        { status: 400 }
      )
    }

    // Validate file size (max 50MB for blog-media, 5MB for product-images)
    const maxSize = bucket === 'blog-media' ? 50 * 1024 * 1024 : 5 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `File too large. Maximum size is ${bucket === 'blog-media' ? '50MB' : '5MB'}.` },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    // Generate unique filename
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const fileExt = originalName.split('.').pop()?.toLowerCase() || (file.type.includes('video') ? 'mp4' : 'jpg')
    const fileName = `${timestamp}-${randomString}.${fileExt}`
    
    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, buffer, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type
      })

    if (error) {
      console.error('Error uploading file:', error)
      return NextResponse.json(
        { error: 'Failed to upload file: ' + error.message },
        { status: 500 }
      )
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName)

    return NextResponse.json({ 
      success: true, 
      fileName,
      url: publicUrl,
      bucket,
      type: file.type.includes('video') ? 'video' : 'image',
      message: 'File uploaded successfully'
    })
  } catch (error) {
    console.error('Error in upload API:', error)
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    )
  }
}