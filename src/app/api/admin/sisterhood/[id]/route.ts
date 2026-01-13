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
      .from('sisterhood_posts')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching sisterhood post:', error)
      return NextResponse.json(
        { error: 'Failed to fetch post: ' + error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ post: data })
  } catch (error) {
    console.error('Error fetching sisterhood post:', error)
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
    const postData = await request.json()
    
    console.log('Updating sisterhood post:', id, postData)
    
    const supabase = createAdminClient()
    
    const updateData: any = {}

    // Update is_approved if provided
    if (postData.is_approved !== undefined) {
      updateData.is_approved = Boolean(postData.is_approved)
    }

    // Update featured if provided
    if (postData.featured !== undefined) {
      updateData.featured = Boolean(postData.featured)
    }

    // Update category if provided
    if (postData.category !== undefined) {
      updateData.category = postData.category
    }

    const { data, error } = await supabase
      .from('sisterhood_posts')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating sisterhood post:', error)
      return NextResponse.json(
        { error: 'Failed to update post: ' + error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, post: data })
  } catch (error) {
    console.error('Error updating sisterhood post:', error)
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
      .from('sisterhood_posts')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting sisterhood post:', error)
      return NextResponse.json(
        { error: 'Failed to delete post: ' + error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting sisterhood post:', error)
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    )
  }
}