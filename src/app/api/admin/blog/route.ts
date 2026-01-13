import { createAdminClient } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = createAdminClient()
    
    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching blog posts:', error)
      return NextResponse.json(
        { error: 'Failed to fetch blog posts: ' + error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ posts })
  } catch (error) {
    console.error('Error in blog API:', error)
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const postData = await request.json()
    
    console.log('Received blog post data:', postData)
    
    if (!postData.title || !postData.content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()
    
    // Determine if it's a video based on URL
    const isVideo = postData.cover_image && 
                    /\.(mp4|webm|mov|avi)$/i.test(postData.cover_image)
    
    const dataToInsert = {
      title: postData.title,
      content: postData.content,
      excerpt: postData.excerpt || postData.content.substring(0, 150) + '...',
      category: postData.category || 'Wellness',
      cover_image: postData.cover_image || '',
      media_type: isVideo ? 'video' : (postData.media_type || 'article'),
      published: postData.published === 'true' || postData.published === true,
      published_at: (postData.published === 'true' || postData.published === true) 
        ? (postData.published_at || new Date().toISOString())
        : null
    }

    console.log('Inserting blog post:', dataToInsert)
    
    const { data, error } = await supabase
      .from('blog_posts')
      .insert([dataToInsert])
      .select()
      .single()

    if (error) {
      console.error('Error creating blog post:', error)
      return NextResponse.json(
        { error: 'Failed to create blog post: ' + error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      post: data,
      message: 'Blog post created successfully'
    })
  } catch (error) {
    console.error('Error creating blog post:', error)
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    )
  }
}