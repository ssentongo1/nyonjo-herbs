import { createAdminClient } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = createAdminClient()
    
    const { data, error } = await supabase
      .from('sisterhood_posts')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching sisterhood posts:', error)
      return NextResponse.json(
        { error: 'Failed to fetch posts: ' + error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ posts: data })
  } catch (error) {
    console.error('Error fetching sisterhood posts:', error)
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    )
  }
}