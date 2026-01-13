import { createClient } from '@/lib/supabase/client-only'

// Products functions (unchanged)
export async function getProducts() {
  const supabase = createClient()
  console.log('getProducts: Creating Supabase client...')
  
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('in_stock', true)
      .order('created_at', { ascending: false })

    console.log('getProducts: Query executed')
    console.log('getProducts: Data:', data)
    console.log('getProducts: Error:', error)
    
    if (error) {
      console.error('Error fetching products:', error)
      console.error('Error details:', error.message, error.code, error.details)
      return []
    }

    return data || []
  } catch (err) {
    console.error('Unexpected error in getProducts:', err)
    return []
  }
}

export async function getProductsStatic() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('in_stock', true)

  if (error) {
    console.error('Error fetching products (static):', error)
    return []
  }

  return data || []
}

export async function getProductById(id: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching product:', error)
    return null
  }

  return data
}

export async function getFeaturedProducts() {
  const supabase = createClient()
  
  try {
    console.log('getFeaturedProducts: Starting query...')
    
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('featured', true)
      .eq('in_stock', true)
      .limit(2)

    console.log('getFeaturedProducts: Query executed')
    console.log('getFeaturedProducts: Data:', data)
    
    if (error) {
      console.error('Error fetching featured products:', error)
      console.error('Error details:', error.message, error.code, error.details)
      return []
    }

    return data || []
  } catch (err) {
    console.error('Unexpected error in getFeaturedProducts:', err)
    return []
  }
}

// Blog functions
export async function getBlogPosts() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('published', true)
    .order('published_at', { ascending: false })

  if (error) {
    console.error('Error fetching blog posts:', error)
    return []
  }

  return data || []
}

export async function getBlogPostsStatic() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('published', true)

  if (error) {
    console.error('Error fetching blog posts (static):', error)
    return []
  }

  return data || []
}

export async function getBlogPostById(id: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', id)
    .eq('published', true)
    .single()

  if (error) {
    console.error('Error fetching blog post:', error)
    return null
  }

  return data
}

// Get featured blog post - SIMPLIFIED
export async function getFeaturedBlogPost() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('featured', true)
    .eq('published', true)
    .limit(1)
    .maybeSingle()

  if (error) {
    console.error('Error fetching featured blog post:', error)
    return null
  }

  return data
}

export async function getBlogComments(postId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('blog_comments')
    .select('*')
    .eq('post_id', postId)
    .eq('is_approved', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching blog comments:', error)
    return []
  }

  return data || []
}

export async function getBlogLikeCount(postId: string) {
  const supabase = createClient()
  const { count, error } = await supabase
    .from('blog_reactions')
    .select('*', { count: 'exact', head: true })
    .eq('post_id', postId)

  if (error) {
    console.error('Error fetching blog like count:', error)
    return 0
  }

  return count || 0
}

// Community
export async function getCommunityPosts() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('sisterhood_posts')
    .select('*')
    .eq('is_approved', true)
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) {
    console.error('Error fetching community posts:', error)
    return []
  }

  return data || []
}

// Get featured community post (sisterhood)
export async function getFeaturedCommunityPost() {
  const supabase = createClient()
  
  try {
    console.log('getFeaturedCommunityPost: Starting query...')
    
    const { data, error } = await supabase
      .from('sisterhood_posts')
      .select('*')
      .eq('featured', true)
      .eq('is_approved', true)
      .limit(1)
      .maybeSingle()

    console.log('getFeaturedCommunityPost: Query executed')
    console.log('getFeaturedCommunityPost: Data:', data)
    
    if (error) {
      console.error('Error fetching featured community post:', error)
      console.error('Error details:', error.message, error.code, error.details)
      return null
    }

    return data
  } catch (err) {
    console.error('Unexpected error in getFeaturedCommunityPost:', err)
    return null
  }
}

// These need server-side auth, we'll implement later
export async function createCommunityPost(anonymousId: string, content: string, mediaUrl?: string, mediaType?: string) {
  console.log('Creating community post:', { anonymousId, content })
  return { id: 'temp', anonymous_id: anonymousId, content }
}

export async function createComment(anonymousId: string, postType: 'blog' | 'community', postId: string, content: string) {
  console.log('Creating comment:', { anonymousId, postType, postId, content })
  return { id: 'temp', anonymous_id: anonymousId, content }
}

export async function toggleReaction(anonymousId: string, postType: 'blog' | 'community', postId: string) {
  console.log('Toggling reaction:', { anonymousId, postType, postId })
  return true
}

export async function createMessage(name: string | null, email: string | null, subject: string, message: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('messages')
    .insert({
      name,
      email,
      subject,
      message,
      status: 'unread'
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating message:', error)
    return null
  }

  return data
}

export async function createBlogComment(postId: string, name: string, email: string | null, comment: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('blog_comments')
    .insert({
      post_id: postId,
      name,
      email,
      comment,
      is_approved: false
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating blog comment:', error)
    return null
  }

  return data
}

export async function toggleBlogReaction(postId: string, anonymousId: string) {
  const supabase = createClient()
  
  // Check if already liked
  const { data: existingReaction } = await supabase
    .from('blog_reactions')
    .select('*')
    .eq('post_id', postId)
    .eq('anonymous_id', anonymousId)
    .single()

  if (existingReaction) {
    // Unlike
    const { error } = await supabase
      .from('blog_reactions')
      .delete()
      .eq('post_id', postId)
      .eq('anonymous_id', anonymousId)

    if (error) {
      console.error('Error removing reaction:', error)
      return { success: false, action: 'unlike', error }
    }

    return { success: true, action: 'unliked' }
  } else {
    // Like
    const { data, error } = await supabase
      .from('blog_reactions')
      .insert({
        post_id: postId,
        anonymous_id: anonymousId,
        reaction_type: 'like'
      })
      .select()
      .single()

    if (error) {
      console.error('Error adding reaction:', error)
      return { success: false, action: 'like', error }
    }

    return { success: true, action: 'liked', data }
  }
}