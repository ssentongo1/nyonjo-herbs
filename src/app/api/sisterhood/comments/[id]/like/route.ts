import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { id } = await params;

  // Get action from request body
  const { action = 'like' } = await request.json().catch(() => ({}));

  // Get current likes
  const { data: comment } = await supabase
    .from('sisterhood_comments')
    .select('likes')
    .eq('id', id)
    .single();

  if (!comment) {
    return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
  }

  // Calculate new likes
  const newLikes = action === 'like' 
    ? (comment.likes || 0) + 1 
    : Math.max(0, (comment.likes || 0) - 1);

  // Update likes
  const { data, error } = await supabase
    .from('sisterhood_comments')
    .update({ likes: newLikes })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}