import { createAdminClient } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = createAdminClient()
    
    const { data: comments, error } = await supabase
      .from('blog_comments')
      .select(`
        *,
        blog_posts:post_id (title)
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching comments:', error)
      return NextResponse.json(
        { error: 'Failed to fetch comments: ' + error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ comments })
  } catch (error) {
    console.error('Error in comments API:', error)
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    )
  }
}