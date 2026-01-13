import { createAdminClient } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const supabase = createAdminClient()
    
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching blog post:', error)
      return NextResponse.json(
        { error: 'Failed to fetch blog post: ' + error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ post: data })
  } catch (error) {
    console.error('Error in blog post API:', error)
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    )
  }
}

// Handle both PUT and PATCH
async function updateBlogPost(id: string, updateData: any) {
  const supabase = createAdminClient()
  
  // If cover_image is provided, check if it's a video
  if (updateData.cover_image) {
    const isVideo = /\.(mp4|webm|mov|avi)$/i.test(updateData.cover_image)
    if (isVideo) {
      updateData.media_type = 'video'
    } else if (updateData.cover_image && !updateData.media_type) {
      updateData.media_type = 'image'
    }
  }
  
  const { data, error } = await supabase
    .from('blog_posts')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const updateData = await request.json()
    
    console.log('PATCH - Updating blog post:', { id, updateData })
    
    const data = await updateBlogPost(id, updateData)

    return NextResponse.json({ 
      success: true, 
      post: data,
      message: 'Blog post updated successfully'
    })
  } catch (error: any) {
    console.error('Error updating blog post:', error)
    return NextResponse.json(
      { error: 'Failed to update blog post: ' + error.message },
      { status: 500 }
    )
  }
}

// Add PUT method to handle requests from admin
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const updateData = await request.json()
    
    console.log('PUT - Updating blog post:', { id, updateData })
    
    const data = await updateBlogPost(id, updateData)

    return NextResponse.json({ 
      success: true, 
      post: data,
      message: 'Blog post updated successfully'
    })
  } catch (error: any) {
    console.error('Error updating blog post:', error)
    return NextResponse.json(
      { error: 'Failed to update blog post: ' + error.message },
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
      .from('blog_posts')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting blog post:', error)
      return NextResponse.json(
        { error: 'Failed to delete blog post: ' + error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true,
      message: 'Blog post deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting blog post:', error)
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    )
  }
}