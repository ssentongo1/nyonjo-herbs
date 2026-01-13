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
        { error: 'Failed to fetch comments: ' + error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ comments: comments || [] })
  } catch (error) {
    console.error('Error fetching comments:', error)
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
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
        name: name.trim(),
        email: email?.trim() || null,
        comment: comment.trim(),
        is_approved: false
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating comment:', error)
      return NextResponse.json(
        { error: 'Failed to create comment: ' + error.message },
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
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    )
  }
}