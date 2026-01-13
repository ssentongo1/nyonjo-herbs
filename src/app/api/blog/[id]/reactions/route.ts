import { createClient } from '@/lib/supabase/client-only'
import { NextRequest, NextResponse } from 'next/server'

// Simple anonymous ID generation (not perfect but works)
function generateAnonymousId(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || 'anonymous'
  const userAgent = request.headers.get('user-agent') || ''
  return Buffer.from(`${ip}-${userAgent.substring(0, 50)}`).toString('base64')
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const anonymousId = generateAnonymousId(request)
    
    const supabase = createClient()
    
    // Get total like count
    const { count: likeCount, error: countError } = await supabase
      .from('blog_reactions')
      .select('*', { count: 'exact', head: true })
      .eq('post_id', id)

    if (countError) {
      console.error('Error fetching like count:', countError)
    }

    // Check if current user has liked
    const { data: userReaction } = await supabase
      .from('blog_reactions')
      .select('*')
      .eq('post_id', id)
      .eq('anonymous_id', anonymousId)
      .single()

    return NextResponse.json({ 
      likeCount: likeCount || 0,
      hasLiked: !!userReaction
    })
  } catch (error) {
    console.error('Error fetching reactions:', error)
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
    const anonymousId = generateAnonymousId(request)
    
    const supabase = createClient()
    
    // Check if already liked
    const { data: existingReaction } = await supabase
      .from('blog_reactions')
      .select('*')
      .eq('post_id', id)
      .eq('anonymous_id', anonymousId)
      .single()

    if (existingReaction) {
      // Unlike
      const { error } = await supabase
        .from('blog_reactions')
        .delete()
        .eq('post_id', id)
        .eq('anonymous_id', anonymousId)

      if (error) {
        console.error('Error removing reaction:', error)
        return NextResponse.json(
          { error: 'Failed to remove reaction' },
          { status: 500 }
        )
      }

      return NextResponse.json({ 
        success: true, 
        action: 'unliked',
        message: 'Reaction removed'
      })
    } else {
      // Like
      const { data, error } = await supabase
        .from('blog_reactions')
        .insert({
          post_id: id,
          anonymous_id: anonymousId,
          reaction_type: 'like'
        })
        .select()
        .single()

      if (error) {
        console.error('Error adding reaction:', error)
        return NextResponse.json(
          { error: 'Failed to add reaction' },
          { status: 500 }
        )
      }

      return NextResponse.json({ 
        success: true, 
        action: 'liked',
        message: 'Reaction added'
      })
    }
  } catch (error) {
    console.error('Error handling reaction:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}