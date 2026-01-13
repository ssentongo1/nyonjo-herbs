import { createAdminClient } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const supabase = createAdminClient()
    
    const { data: message, error } = await supabase
      .from('messages')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching message:', error)
      return NextResponse.json(
        { error: 'Failed to fetch message: ' + error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ message })
  } catch (error) {
    console.error('Error fetching message:', error)
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
    const { status } = await request.json()
    
    const supabase = createAdminClient()
    
    const { data, error } = await supabase
      .from('messages')
      .update({
        status: status || 'read'
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating message:', error)
      return NextResponse.json(
        { error: 'Failed to update message: ' + error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, message: data })
  } catch (error) {
    console.error('Error updating message:', error)
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
      .from('messages')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting message:', error)
      return NextResponse.json(
        { error: 'Failed to delete message: ' + error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting message:', error)
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    )
  }
}