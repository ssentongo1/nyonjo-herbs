import { createClient } from '@/lib/supabase/client-only'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const supabase = createClient()
    
    const { data: comments, error } = await supabase
      .from('blog_comments')
      .select('*')
      .eq('post_id', id)
      .eq('is_approved', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching comments:', error)
      return NextResponse.json(
        { error: 'Failed to fetch comments' },
        { status: 500 }
      )
    }

    return NextResponse.json({ comments })
  } catch (error) {
    console.error('Error fetching comments:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { name, email, comment } = await request.json()
    
    if (!name || !comment) {
      return NextResponse.json(
        { error: 'Name and comment are required' },
        { status: 400 }
      )
    }

    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('blog_comments')
      .insert({
        post_id: id,
        name,
        email: email || null,
        comment,
        is_approved: false // Admin must approve
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating comment:', error)
      return NextResponse.json(
        { error: 'Failed to create comment' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      comment: data,
      message: 'Comment submitted for approval'
    })
  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}