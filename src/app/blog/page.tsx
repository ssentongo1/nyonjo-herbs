'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client-only'
import Link from 'next/link'

interface BlogPost {
  id: string
  title: string
  content: string
  excerpt: string
  category: string
  cover_image?: string
  media_type?: string
  published_at: string
  view_count: number
  like_count: number
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)
  const [mounted, setMounted] = useState(false)

  // Format dates consistently to avoid hydration mismatch
  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    try {
      const date = new Date(dateString)
      const now = new Date()
      const diffTime = Math.abs(now.getTime() - date.getTime())
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
      
      if (diffDays === 0) return 'Today'
      if (diffDays === 1) return 'Yesterday'
      if (diffDays < 7) return `${diffDays} days ago`
      
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    } catch {
      return ''
    }
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      fetchPosts()
    }
  }, [refreshKey, mounted])

  async function fetchPosts() {
    const supabase = createClient()
    
    // Get blog posts with fresh data (no cache)
    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true)
      .order('published_at', { ascending: false })

    if (error) {
      console.error('Error fetching blog posts:', error)
      setLoading(false)
      return []
    }

    // Get like counts for each post
    const postsWithLikes = await Promise.all(
      (posts || []).map(async (post) => {
        const { count, error: countError } = await supabase
          .from('blog_reactions')
          .select('*', { count: 'exact', head: true })
          .eq('post_id', post.id)

        if (countError) {
          console.error('Error fetching like count for post', post.id, countError)
        }

        return {
          ...post,
          view_count: post.view_count || 0, // Ensure not null
          like_count: count || 0
        }
      })
    )

    setPosts(postsWithLikes)
    setLoading(false)
  }

  const refreshPosts = () => {
    setRefreshKey(prev => prev + 1)
  }

  function isVideoUrl(url?: string) {
    if (!url) return false
    return /\.(mp4|webm|mov|avi)$/i.test(url)
  }

  function isImageUrl(url?: string) {
    if (!url) return false
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(url)
  }

  if (!mounted || loading) return (
    <div className="min-h-screen flex items-center justify-center py-20">
      <div className="animate-spin rounded-full h-8 w-8 md:h-12 md:w-12 border-b-2 border-rose-600"></div>
    </div>
  )
  
  return (
    <div className="min-h-screen">
      {/* Blog Hero */}
      <section className="bg-gradient-to-br from-pink-50 to-white py-8 md:py-12 lg:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2 md:mb-4">
                Wellness <span className="text-rose-600">Blog</span>
              </h1>
              <p className="text-base md:text-lg lg:text-xl text-gray-700 max-w-3xl">
                Educational content, herbal wisdom, and wellness tips from our community.
              </p>
            </div>
            <button
              onClick={refreshPosts}
              className="text-rose-600 hover:text-rose-700 text-sm md:text-base font-medium self-start md:self-center"
            >
              ↻ Refresh
            </button>
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-6 md:py-8 lg:py-16">
        <div className="container mx-auto px-4 md:px-6">
          {posts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 mb-6 md:mb-8 lg:mb-12">
                {posts.map((post) => {
                  const isVideo = isVideoUrl(post.cover_image)
                  const isImage = isImageUrl(post.cover_image)
                  
                  return (
                    <div 
                      key={post.id} 
                      className="bg-white rounded-xl md:rounded-2xl shadow-lg border border-rose-100 overflow-hidden hover:shadow-xl transition-shadow duration-300"
                    >
                      {/* Media Container */}
                      <div className="relative h-40 md:h-48 w-full overflow-hidden bg-black">
                        {isVideo ? (
                          // Video player - fits within container
                          <div className="relative w-full h-full flex items-center justify-center">
                            <video
                              className="w-full h-full object-contain"
                              muted
                              playsInline
                              autoPlay
                              loop
                              preload="metadata"
                            >
                              <source src={post.cover_image} type={`video/${post.cover_image?.split('.').pop()}`} />
                              Your browser does not support videos.
                            </video>
                            {/* Video badge */}
                            <div className="absolute top-2 left-2 md:top-3 md:left-3 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center">
                              <span className="mr-1">🎬</span>
                              <span>Video</span>
                            </div>
                          </div>
                        ) : isImage ? (
                          <img
                            src={post.cover_image}
                            alt={post.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-rose-50 to-pink-50 flex items-center justify-center">
                            <div className="w-12 h-12 md:w-16 md:h-16 bg-rose-100 rounded-full flex items-center justify-center">
                              <span className="text-xl md:text-2xl text-rose-600">📝</span>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Content */}
                      <div className="p-4 md:p-6 lg:p-8">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-3 md:mb-4">
                          <span className="inline-block bg-rose-100 text-rose-700 px-2 py-1 md:px-3 md:py-1 rounded-full text-xs md:text-sm font-semibold">
                            {post.category}
                          </span>
                          <div className="flex items-center space-x-2 text-gray-500 text-xs md:text-sm">
                            <span className="flex items-center">
                              <span className="mr-1">👁️</span>
                              <span>{post.view_count}</span>
                            </span>
                            <span className="flex items-center">
                              <span className="mr-1">❤️</span>
                              <span>{post.like_count}</span>
                            </span>
                          </div>
                        </div>
                        <h3 className="text-base md:text-lg lg:text-xl font-bold text-gray-900 mb-2 md:mb-3 lg:mb-4 line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-gray-600 text-xs md:text-sm lg:text-base mb-3 md:mb-4 lg:mb-6 line-clamp-3">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500 text-xs md:text-sm">
                            {formatDate(post.published_at)}
                          </span>
                          <Link
                            href={`/blog/${post.id}`}
                            className="text-rose-600 hover:text-rose-700 font-semibold text-xs md:text-sm lg:text-base"
                          >
                            Read →
                          </Link>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
              
              <div className="mt-6 md:mt-8 lg:mt-12 text-center">
                <p className="text-gray-600 text-sm md:text-base">
                  Showing {posts.length} blog post{posts.length !== 1 ? 's' : ''}
                </p>
              </div>
            </>
          ) : (
            <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl md:rounded-2xl lg:rounded-3xl p-6 md:p-8 lg:p-12 text-center">
              <div className="w-12 h-12 md:w-16 md:h-16 lg:w-24 lg:h-24 bg-gradient-to-r from-rose-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 lg:mb-8">
                <span className="text-xl md:text-2xl lg:text-3xl text-white">📚</span>
              </div>
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 md:mb-3 lg:mb-4">Blog Content Coming Soon!</h2>
              <p className="text-sm md:text-base lg:text-xl text-gray-700 mb-4 md:mb-6 lg:mb-8 max-w-2xl mx-auto">
                We're preparing valuable educational content about herbal wellness and women's health.
              </p>
              <p className="text-gray-600 text-xs md:text-sm lg:text-base">
                Videos, articles, and community discussions will be available here.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}