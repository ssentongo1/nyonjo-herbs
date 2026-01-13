import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('sisterhood_posts')
    .select('*')
    .eq('is_approved', true) // ADD THIS FILTER
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Database error:', error);
    return NextResponse.json([], { status: 200 });
  }

  return NextResponse.json(data || []);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { username, content, media_url } = await request.json();

  const { data, error } = await supabase
    .from('sisterhood_posts')
    .insert([{ 
      username, 
      content, 
      media_url: media_url || null,
      is_approved: true // New posts should be approved by default
    }])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}