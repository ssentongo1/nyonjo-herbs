import { createClient } from '@/lib/supabase/client-only'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import BlogPostClient from '@/components/BlogPostClient'
import { getBlogPostsStatic } from '@/lib/db'

export async function generateStaticParams() {
  const posts = await getBlogPostsStatic()
  return posts.map((post) => ({
    id: post.id,
  }))
}

async function getBlogPost(id: string) {
  const supabase = createClient()
  
  const { data: post, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', id)
    .eq('published', true)
    .single()

  if (error) {
    console.error('Error fetching blog post:', error)
    return null
  }

  // Increment view count - ensure we handle NULL properly
  const currentViewCount = post.view_count || 0
  console.log(`Incrementing view count for post ${id}: ${currentViewCount} → ${currentViewCount + 1}`)
  
  const { error: updateError } = await supabase
    .from('blog_posts')
    .update({ 
      view_count: currentViewCount + 1 
    })
    .eq('id', id)

  if (updateError) {
    console.error('Error incrementing view count:', updateError)
  } else {
    console.log('View count updated successfully')
  }

  // Return post with incremented count for display
  return {
    ...post,
    view_count: currentViewCount + 1
  }
}

async function getComments(postId: string) {
  const supabase = createClient()
  
  const { data: comments, error } = await supabase
    .from('blog_comments')
    .select('*')
    .eq('post_id', postId)
    .eq('is_approved', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching comments:', error)
    return []
  }

  return comments
}

async function getLikeCount(postId: string) {
  const supabase = createClient()
  
  const { count, error } = await supabase
    .from('blog_reactions')
    .select('*', { count: 'exact', head: true })
    .eq('post_id', postId)

  if (error) {
    console.error('Error fetching like count:', error)
    return 0
  }

  return count || 0
}

export default async function BlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const post = await getBlogPost(id)
  
  if (!post) {
    notFound()
  }

  const [comments, likeCount] = await Promise.all([
    getComments(id),
    getLikeCount(id)
  ])

  return (
    <div className="min-h-screen">
      {/* Back Navigation */}
      <section className="bg-gradient-to-br from-rose-50 to-white py-4 md:py-6 lg:py-8">
        <div className="container mx-auto px-4 md:px-6">
          <Link href="/blog" className="inline-flex items-center text-rose-600 hover:text-rose-700 mb-3 md:mb-4 text-sm md:text-base">
            ← Back to Blog
          </Link>
        </div>
      </section>

      {/* Blog Post */}
      <section className="py-4 md:py-6 lg:py-8">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <BlogPostClient 
              post={post}
              initialComments={comments}
              initialLikeCount={likeCount}
            />
          </div>
        </div>
      </section>
    </div>
  )
}