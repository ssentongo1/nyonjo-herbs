import { createAdminClient } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, subject, message, contact_preference } = await request.json()
    
    if (!message || message.trim() === '') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Validate contact preference
    if (contact_preference === 'email' && (!email || email.trim() === '')) {
      return NextResponse.json(
        { error: 'Email is required for email response' },
        { status: 400 }
      )
    }

    if (contact_preference === 'whatsapp' && (!phone || phone.trim() === '')) {
      return NextResponse.json(
        { error: 'Phone number is required for WhatsApp response' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()
    
    const { data, error } = await supabase
      .from('messages')
      .insert({
        name: name?.trim() || null,
        email: email?.trim() || null,
        phone: phone?.trim() || null,
        subject: subject?.trim() || 'General Inquiry',
        message: message.trim(),
        contact_preference: contact_preference || 'email',
        status: 'unread'
      })
      .select()
      .single()

    if (error) {
      console.error('Error saving message:', error)
      return NextResponse.json(
        { error: 'Failed to save message: ' + error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Message sent successfully',
      data 
    })
  } catch (error) {
    console.error('Error in contact API:', error)
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    )
  }
}