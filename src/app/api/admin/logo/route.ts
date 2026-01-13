import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('site_settings')
      .select('setting_value')
      .eq('setting_key', 'site_logo')
      .single()
    
    if (error) {
      console.error('Error fetching logo:', error)
      return NextResponse.json({ logoUrl: '' }, { status: 200 })
    }
    
    return NextResponse.json({ 
      logoUrl: data?.setting_value || '' 
    })
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json({ logoUrl: '' }, { status: 200 })
  }
}

export async function POST(request: NextRequest) {
  console.log('Logo upload API called')
  
  try {
    // Check admin authentication - try cookies first, then auth header
    let sessionStr = ''
    
    // Try to get session from cookies
    const cookieStore = await cookies()
    const cookieSession = cookieStore.get('nyonjo_admin_session')?.value
    
    if (cookieSession) {
      sessionStr = cookieSession
      console.log('Got session from cookies')
    } else {
      // Try to get session from auth header (for localStorage)
      const authHeader = request.headers.get('Authorization')
      if (authHeader && authHeader.startsWith('Bearer ')) {
        sessionStr = authHeader.substring(7)
        console.log('Got session from Authorization header')
      }
    }
    
    if (!sessionStr) {
      console.log('No session found')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    let session
    try {
      session = JSON.parse(sessionStr)
    } catch (error) {
      console.log('Invalid session format:', error)
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
    }
    
    if (session.expires < Date.now()) {
      console.log('Session expired')
      return NextResponse.json({ error: 'Session expired' }, { status: 401 })
    }
    
    console.log('Authentication passed')
    
    const formData = await request.formData()
    const file = formData.get('logo') as File
    
    if (!file) {
      console.log('No file in request')
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }
    
    console.log('File received:', file.name, file.type, file.size)
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml']
    if (!validTypes.includes(file.type)) {
      console.log('Invalid file type:', file.type)
      return NextResponse.json({ 
        error: 'Invalid file type. Use JPEG, PNG, WebP or SVG' 
      }, { status: 400 })
    }
    
    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      console.log('File too large:', file.size)
      return NextResponse.json({ 
        error: 'File too large. Max size is 5MB' 
      }, { status: 400 })
    }
    
    const supabase = await createClient()
    console.log('Supabase client created')
    
    // Generate unique filename
    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'png'
    const fileName = `logo-${Date.now()}.${fileExt}`
    const filePath = fileName
    
    console.log('Uploading to path:', filePath)
    
    // Convert File to ArrayBuffer for upload
    const arrayBuffer = await file.arrayBuffer()
    const uint8Array = new Uint8Array(arrayBuffer)
    
    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('logos')
      .upload(filePath, uint8Array, {
        upsert: true,
        contentType: file.type,
        cacheControl: '3600'
      })
    
    if (uploadError) {
      console.error('Upload error:', uploadError)
      return NextResponse.json({ 
        error: 'Failed to upload logo: ' + uploadError.message 
      }, { status: 500 })
    }
    
    console.log('Upload successful:', uploadData)
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('logos')
      .getPublicUrl(filePath)
    
    console.log('Public URL:', publicUrl)
    
    // Save URL to database
    const { error: dbError } = await supabase
      .from('site_settings')
      .upsert({
        setting_key: 'site_logo',
        setting_value: publicUrl
      }, {
        onConflict: 'setting_key'
      })
    
    if (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json({ 
        error: 'Failed to save logo URL: ' + dbError.message 
      }, { status: 500 })
    }
    
    console.log('Database update successful')
    
    return NextResponse.json({ 
      success: true, 
      message: 'Logo uploaded successfully',
      logoUrl: publicUrl
    })
    
  } catch (error: any) {
    console.error('Server error:', error)
    return NextResponse.json({ 
      error: 'Internal server error: ' + error.message 
    }, { status: 500 })
  }
}