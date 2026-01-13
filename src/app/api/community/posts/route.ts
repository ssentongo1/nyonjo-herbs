import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { anonymousId, content, mediaUrl, mediaType } = await request.json()
    
    if (!anonymousId || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('community_posts')
      .insert({
        anonymous_id: anonymousId,
        content,
        media_url: mediaUrl,
        media_type: mediaType,
        is_approved: true
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating post:', error)
      return NextResponse.json(
        { error: 'Failed to create post' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, post: data })
  } catch (error) {
    console.error('Error in community post API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('community_posts')
      .select('*')
      .eq('is_approved', true)
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      console.error('Error fetching posts:', error)
      return NextResponse.json(
        { error: 'Failed to fetch posts' },
        { status: 500 }
      )
    }

    return NextResponse.json({ posts: data })
  } catch (error) {
    console.error('Error in community posts API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}