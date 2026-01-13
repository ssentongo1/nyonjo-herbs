import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { id } = await params;

  // Get current likes
  const { data: post } = await supabase
    .from('sisterhood_posts')
    .select('likes')
    .eq('id', id)
    .single();

  if (!post) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }

  // Get action from request body (like/unlike)
  const { action = 'like' } = await request.json().catch(() => ({}));
  
  const newLikes = action === 'like' 
    ? (post.likes || 0) + 1 
    : Math.max(0, (post.likes || 0) - 1);

  // Update likes
  const { data, error } = await supabase
    .from('sisterhood_posts')
    .update({ likes: newLikes })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}