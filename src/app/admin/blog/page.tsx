'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

type BlogPost = {
  id: string
  title: string
  excerpt: string
  category: string
  cover_image?: string
  published: boolean
  featured: boolean
  view_count: number
  published_at: string
  created_at: string
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [updating, setUpdating] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')

  // Helper functions to detect media type
  const isVideoUrl = (url?: string) => {
    if (!url) return false
    return /\.(mp4|webm|mov|avi)$/i.test(url)
  }

  const isImageUrl = (url?: string) => {
    if (!url) return false
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(url)
  }

  const getMediaTypeIcon = (url?: string) => {
    if (!url) return '📝'
    if (isVideoUrl(url)) return '🎬'
    if (isImageUrl(url)) return '🖼️'
    return '📁'
  }

  const getMediaTypeText = (url?: string) => {
    if (!url) return 'No media'
    if (isVideoUrl(url)) return 'Video'
    if (isImageUrl(url)) return 'Image'
    return 'File'
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/admin/blog')
      const data = await response.json()
      if (response.ok) {
        setPosts(data.posts)
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post? This will also delete all comments and reactions.')) return

    try {
      const response = await fetch(`/api/admin/blog/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setPosts(posts.filter(p => p.id !== id))
      }
    } catch (error) {
      console.error('Error deleting post:', error)
    }
  }

  const togglePublish = async (id: string, currentStatus: boolean) => {
    try {
      setUpdating(id)
      const response = await fetch(`/api/admin/blog/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          published: !currentStatus,
          published_at: !currentStatus ? new Date().toISOString() : null
        }),
      })

      if (response.ok) {
        fetchPosts()
      }
    } catch (error) {
      console.error('Error updating post:', error)
    } finally {
      setUpdating(null)
    }
  }

  const toggleFeatured = async (post: BlogPost) => {
    if (!post.published) {
      alert('Only published posts can be featured on the homepage')
      return
    }
    
    setUpdating(post.id)
    
    try {
      const response = await fetch(`/api/admin/blog/${post.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          featured: !post.featured
        }),
      })

      if (response.ok) {
        // Update local state
        setPosts(posts.map(p => 
          p.id === post.id ? { ...p, featured: !p.featured } : p
        ))
        
        // If featuring this post and we already have a featured post, 
        // unfeature the current one (limit to 1 featured blog post)
        if (!post.featured) {
          const currentFeatured = posts.find(p => p.featured && p.id !== post.id)
          
          if (currentFeatured) {
            await fetch(`/api/admin/blog/${currentFeatured.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ featured: false }),
            })
            
            // Update local state for the unfeatured post
            setPosts(posts.map(p => 
              p.id === currentFeatured.id ? { ...p, featured: false } : p
            ))
          }
        }
      }
    } catch (error) {
      console.error('Error updating featured status:', error)
      alert('Failed to update featured status')
    } finally {
      setUpdating(null)
    }
  }

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(search.toLowerCase()) ||
    post.category.toLowerCase().includes(search.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(search.toLowerCase())
  )

  const totalViews = posts.reduce((sum, post) => sum + (post.view_count || 0), 0)
  const publishedPosts = posts.filter(post => post.published).length
  const featuredPost = posts.find(post => post.featured)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading blog posts...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link href="/admin/dashboard" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-rose-500 to-pink-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">NH</span>
                </div>
                <span className="text-lg font-bold text-gray-900">
                  Blog
                </span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-3">
              <Link href="/admin/blog/comments" className="text-gray-600 hover:text-gray-900 font-medium text-sm">
                Comments
              </Link>
              <Link href="/admin/dashboard" className="text-gray-600 hover:text-gray-900 text-sm">
                ← Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="p-4">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-lg shadow border border-gray-200 p-3">
            <p className="text-gray-600 text-xs">Total Posts</p>
            <p className="text-xl font-bold text-gray-900">{posts.length}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow border border-gray-200 p-3">
            <p className="text-gray-600 text-xs">Published</p>
            <p className="text-xl font-bold text-green-600">{publishedPosts}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow border border-gray-200 p-3">
            <p className="text-gray-600 text-xs">Total Views</p>
            <p className="text-xl font-bold text-blue-600">{totalViews}</p>
          </div>
        </div>

        {/* Search and Controls */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-4 mb-6">
          <div className="space-y-4">
            <div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search posts..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-transparent text-sm"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <span className="text-gray-400 text-sm">🔍</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex space-x-2">
                <button 
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium ${viewMode === 'list' ? 'bg-rose-100 text-rose-700' : 'bg-gray-100 text-gray-700'}`}
                >
                  List
                </button>
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium ${viewMode === 'grid' ? 'bg-rose-100 text-rose-700' : 'bg-gray-100 text-gray-700'}`}
                >
                  Grid
                </button>
              </div>
              
              <div className="flex space-x-2">
                <Link
                  href="/admin/blog/new"
                  className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:from-rose-600 hover:to-pink-600 transition-all font-semibold text-sm"
                >
                  + New Post
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Post Notice */}
        {featuredPost && (
          <div className="mb-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center">
              <span className="w-5 h-5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-2">
                <span className="text-white text-xs">★</span>
              </span>
              <span className="text-sm font-medium text-gray-900">
                Featured: <span className="text-blue-600">"{featuredPost.title.substring(0, 30)}..."</span>
              </span>
              {featuredPost.cover_image && (
                <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                  isVideoUrl(featuredPost.cover_image) 
                    ? 'bg-purple-100 text-purple-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  <span className="mr-1">{getMediaTypeIcon(featuredPost.cover_image)}</span>
                  {getMediaTypeText(featuredPost.cover_image)}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Posts Display */}
        {filteredPosts.length === 0 ? (
          <div className="bg-white rounded-lg shadow border border-gray-200 p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl text-gray-400">📝</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No blog posts found</h3>
            <p className="text-gray-600 mb-6 text-sm">
              {search ? 'Try a different search term' : 'Start by creating your first blog post'}
            </p>
            <Link
              href="/admin/blog/new"
              className="inline-flex items-center bg-gradient-to-r from-rose-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:from-rose-600 hover:to-pink-600 transition-all font-semibold text-sm"
            >
              + Create Your First Post
            </Link>
          </div>
        ) : viewMode === 'list' ? (
          /* List View */
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <div key={post.id} className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start">
                      {post.cover_image ? (
                        <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 mr-3 flex-shrink-0 bg-black relative">
                          {isVideoUrl(post.cover_image) ? (
                            <>
                              <video
                                src={post.cover_image}
                                className="w-full h-full object-cover"
                                muted
                                playsInline
                                autoPlay
                                loop
                                preload="metadata"
                              >
                                <source src={post.cover_image} type={`video/${post.cover_image.split('.').pop()}`} />
                              </video>
                              <div className="absolute top-1 left-1 bg-black/70 text-white text-[10px] px-1 py-0.5 rounded flex items-center">
                                <span className="mr-0.5">🎬</span>
                                <span>Video</span>
                              </div>
                            </>
                          ) : isImageUrl(post.cover_image) ? (
                            <img
                              src={post.cover_image}
                              alt={post.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none'
                                const parent = e.currentTarget.parentElement
                                if (parent) {
                                  parent.innerHTML = `
                                    <div class="w-full h-full bg-gradient-to-br from-green-100 to-blue-100 flex flex-col items-center justify-center">
                                      <span class="text-green-600 text-sm">🖼️</span>
                                      <span class="text-green-700 text-xs mt-1">Image</span>
                                    </div>
                                  `
                                }
                              }}
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-50 flex flex-col items-center justify-center">
                              <span className="text-gray-600 text-sm">📁</span>
                              <span className="text-gray-700 text-xs mt-1">File</span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg flex items-center justify-center mr-3">
                          <span className="text-blue-600 text-sm">📝</span>
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-gray-900">{post.title}</div>
                        <div className="text-gray-500 text-xs mt-1 line-clamp-1">
                          {post.excerpt}
                        </div>
                        {post.cover_image && (
                          <div className="mt-1">
                            <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs ${
                              isVideoUrl(post.cover_image) 
                                ? 'bg-purple-100 text-purple-800' 
                                : isImageUrl(post.cover_image)
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              <span className="mr-1">{getMediaTypeIcon(post.cover_image)}</span>
                              {getMediaTypeText(post.cover_image)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end space-y-1">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${post.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {post.published ? 'Published' : 'Draft'}
                      </span>
                      {post.featured && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800">
                          ★ Featured
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded-full">
                      {post.category}
                    </span>
                    <div className="flex items-center text-gray-600 text-xs">
                      <span className="mr-3">👁️ {post.view_count || 0}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => togglePublish(post.id, post.published)}
                      disabled={updating === post.id}
                      className={`px-3 py-2 rounded-lg text-xs font-medium ${post.published ? 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100' : 'bg-green-50 text-green-600 hover:bg-green-100'} disabled:opacity-50`}
                    >
                      {updating === post.id ? 'Updating...' : (post.published ? 'Unpublish' : 'Publish')}
                    </button>
                    
                    <button
                      onClick={() => toggleFeatured(post)}
                      disabled={!post.published || updating === post.id}
                      className={`px-3 py-2 rounded-lg text-xs font-medium ${post.featured ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} disabled:opacity-50`}
                    >
                      {post.featured ? '★ Featured' : '☆ Feature'}
                    </button>
                    
                    <div className="col-span-2 grid grid-cols-2 gap-2">
                      <Link
                        href={`/admin/blog/edit/${post.id}`}
                        className="px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 text-xs font-medium text-center"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 text-xs font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  
                  {!post.published && (
                    <p className="text-xs text-amber-600 mt-2 text-center">
                      Publish first to feature on homepage
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPosts.map((post) => (
              <div key={post.id} className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                <div className="p-4">
                  {post.cover_image ? (
                    <div className="w-full h-32 rounded-lg overflow-hidden border border-gray-200 mb-3 bg-black relative">
                      {isVideoUrl(post.cover_image) ? (
                        <>
                          <video
                            src={post.cover_image}
                            className="w-full h-full object-cover"
                            muted
                            playsInline
                            autoPlay
                            loop
                            preload="metadata"
                          >
                            <source src={post.cover_image} type={`video/${post.cover_image.split('.').pop()}`} />
                          </video>
                          <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center">
                            <span className="mr-1">🎬</span>
                            <span>Video</span>
                          </div>
                        </>
                      ) : isImageUrl(post.cover_image) ? (
                        <img
                          src={post.cover_image}
                          alt={post.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none'
                            const parent = e.currentTarget.parentElement
                            if (parent) {
                              parent.innerHTML = `
                                <div class="w-full h-full bg-gradient-to-br from-green-100 to-blue-100 flex flex-col items-center justify-center">
                                  <span class="text-green-600 text-xl">🖼️</span>
                                  <span class="text-green-700 text-sm mt-1">Image Post</span>
                                </div>
                              `
                            }
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-50 flex flex-col items-center justify-center">
                          <span className="text-gray-600 text-xl">📁</span>
                          <span className="text-gray-700 text-sm mt-1">Media File</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-full h-32 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg flex items-center justify-center mb-3">
                      <span className="text-blue-600 text-xl">📝</span>
                    </div>
                  )}
                  
                  <div className="mb-3">
                    <div className="font-medium text-gray-900 text-sm mb-1 line-clamp-2">{post.title}</div>
                    <div className="text-gray-500 text-xs line-clamp-1">{post.excerpt}</div>
                    {post.cover_image && (
                      <div className="mt-1">
                        <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs ${
                          isVideoUrl(post.cover_image) 
                            ? 'bg-purple-100 text-purple-800' 
                            : isImageUrl(post.cover_image)
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          <span className="mr-1">{getMediaTypeIcon(post.cover_image)}</span>
                          {getMediaTypeText(post.cover_image)}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded-full">
                      {post.category}
                    </span>
                    <div className="flex items-center text-gray-600 text-xs">
                      <span>👁️ {post.view_count || 0}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${post.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {post.published ? 'Published' : 'Draft'}
                    </span>
                    {post.featured && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800">
                        Featured
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <button
                      onClick={() => togglePublish(post.id, post.published)}
                      disabled={updating === post.id}
                      className={`w-full px-3 py-2 rounded-lg text-xs font-medium ${post.published ? 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100' : 'bg-green-50 text-green-600 hover:bg-green-100'} disabled:opacity-50`}
                    >
                      {updating === post.id ? 'Updating...' : (post.published ? 'Unpublish' : 'Publish')}
                    </button>
                    
                    <button
                      onClick={() => toggleFeatured(post)}
                      disabled={!post.published || updating === post.id}
                      className={`w-full px-3 py-2 rounded-lg text-xs font-medium ${post.featured ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} disabled:opacity-50`}
                    >
                      {post.featured ? '★ Featured' : '☆ Feature on Home'}
                    </button>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        href={`/admin/blog/edit/${post.id}`}
                        className="px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 text-xs font-medium text-center"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 text-xs font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 text-sm text-gray-500 text-center">
          Showing {filteredPosts.length} of {posts.length} posts • {totalViews} total views
        </div>
        
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">💡 Featured Blog Post Guide</h3>
          <ul className="text-gray-700 text-xs space-y-1">
            <li className="flex items-start">
              <span className="text-blue-500 mr-1">•</span>
              <span>Only <strong>1 blog post</strong> can be featured on the homepage at a time</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-1">•</span>
              <span>Only <strong>published</strong> posts can be featured</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-1">•</span>
              <span>To feature a new post, it will automatically unfeature the current one</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-1">•</span>
              <span>Featured posts can include <strong>videos or images</strong> on the homepage</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}