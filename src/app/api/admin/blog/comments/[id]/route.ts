import { createAdminClient } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const supabase = createAdminClient()
    
    const { data: comment, error } = await supabase
      .from('blog_comments')
      .select(`
        *,
        blog_posts:post_id (title)
      `)
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching comment:', error)
      return NextResponse.json(
        { error: 'Failed to fetch comment: ' + error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ comment })
  } catch (error) {
    console.error('Error fetching comment:', error)
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { is_approved } = await request.json()
    
    const supabase = createAdminClient()
    
    const { data, error } = await supabase
      .from('blog_comments')
      .update({
        is_approved,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating comment:', error)
      return NextResponse.json(
        { error: 'Failed to update comment: ' + error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, comment: data })
  } catch (error) {
    console.error('Error updating comment:', error)
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const supabase = createAdminClient()
    
    const { error } = await supabase
      .from('blog_comments')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting comment:', error)
      return NextResponse.json(
        { error: 'Failed to delete comment: ' + error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting comment:', error)
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    )
  }
}