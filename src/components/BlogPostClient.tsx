'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

type BlogPost = {
  id: string
  title: string
  content: string
  category: string
  cover_image?: string
  media_type?: string
  published_at: string
  view_count: number
}

type Comment = {
  id: string
  name: string
  email?: string
  comment: string
  created_at: string
}

interface BlogPostClientProps {
  post: BlogPost
  initialComments: Comment[]
  initialLikeCount: number
}

export default function BlogPostClient({ 
  post, 
  initialComments, 
  initialLikeCount 
}: BlogPostClientProps) {
  const router = useRouter()
  const [comments, setComments] = useState(initialComments)
  const [likeCount, setLikeCount] = useState(initialLikeCount)
  const [hasLiked, setHasLiked] = useState(false)
  const [loadingLike, setLoadingLike] = useState(false)
  const [showCommentForm, setShowCommentForm] = useState(false)
  const [commentForm, setCommentForm] = useState({
    name: '',
    email: '',
    comment: ''
  })
  const [submittingComment, setSubmittingComment] = useState(false)
  const [commentSuccess, setCommentSuccess] = useState(false)
  const [commentError, setCommentError] = useState('')

  // Check if user has liked on component mount
  useEffect(() => {
    checkLikeStatus()
  }, [])

  const isVideoPost = () => {
    if (!post.cover_image) return false
    const isVideo = /\.(mp4|webm|mov|avi)$/i.test(post.cover_image)
    return isVideo || post.media_type === 'video'
  }

  const isImagePost = () => {
    if (!post.cover_image) return false
    const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(post.cover_image)
    return isImage || post.media_type === 'image'
  }

  const checkLikeStatus = async () => {
    try {
      const response = await fetch(`/api/blog/${post.id}/reactions`)
      if (response.ok) {
        const data = await response.json()
        setHasLiked(data.hasLiked || false)
      }
    } catch (error) {
      console.error('Error checking like status:', error)
    }
  }

  const handleLike = async () => {
    if (loadingLike) return
    
    setLoadingLike(true)
    try {
      const response = await fetch(`/api/blog/${post.id}/reactions`, {
        method: 'POST'
      })
      
      const data = await response.json()
      
      if (response.ok) {
        if (data.action === 'liked') {
          setLikeCount(prev => prev + 1)
          setHasLiked(true)
        } else {
          setLikeCount(prev => prev - 1)
          setHasLiked(false)
        }
      }
    } catch (error) {
      console.error('Error toggling like:', error)
    } finally {
      setLoadingLike(false)
    }
  }

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmittingComment(true)
    setCommentError('')
    setCommentSuccess(false)

    try {
      const response = await fetch(`/api/blog/${post.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(commentForm)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit comment')
      }

      setCommentSuccess(true)
      setCommentForm({ name: '', email: '', comment: '' })
      setShowCommentForm(false)
      
      // Refresh comments
      const commentsResponse = await fetch(`/api/blog/${post.id}/comments`)
      if (commentsResponse.ok) {
        const commentsData = await commentsResponse.json()
        setComments(commentsData.comments || [])
      }
    } catch (err: any) {
      setCommentError(err.message || 'Failed to submit comment')
    } finally {
      setSubmittingComment(false)
    }
  }

  const shareOnFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`
    window.open(url, '_blank', 'width=600,height=400')
  }

  const shareOnTwitter = () => {
    const text = `Check out this blog post: ${post.title}`
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`
    window.open(url, '_blank', 'width=600,height=400')
  }

  const shareOnWhatsApp = () => {
    const text = `Check out this blog post: ${post.title} - ${window.location.href}`
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`
    window.open(url, '_blank')
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) {
      return 'Today'
    } else if (diffDays === 1) {
      return 'Yesterday'
    } else if (diffDays < 7) {
      return `${diffDays} days ago`
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    }
  }

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Post Header */}
      <div className="bg-white rounded-2xl shadow-lg border border-rose-100 p-6 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4 md:mb-6">
          <span className="inline-block bg-rose-100 text-rose-700 px-3 py-1 rounded-full text-sm font-semibold">
            {post.category}
          </span>
          {isVideoPost() && (
            <span className="inline-flex items-center bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold">
              <span className="mr-1">🎬</span> Video Post
            </span>
          )}
          {isImagePost() && (
            <span className="inline-flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
              <span className="mr-1">🖼️</span> Image Post
            </span>
          )}
        </div>
        
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 md:mb-6">
          {post.title}
        </h1>
        
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 md:mb-8 text-gray-600 text-sm md:text-base">
          <div className="flex flex-wrap items-center gap-3 md:gap-4">
            <span>📅 {new Date(post.published_at).toLocaleDateString()}</span>
            <span>👁️ {post.view_count || 0} views</span>
            <span>💬 {comments.length} comments</span>
            <span>❤️ {likeCount} likes</span>
          </div>
        </div>
        
        {/* Media Display */}
        {post.cover_image && (
          <div className="mb-6 md:mb-8 overflow-hidden rounded-xl">
            {isVideoPost() ? (
              <div className="w-full rounded-xl overflow-hidden bg-black">
                <video 
                  controls 
                  className="w-full h-auto max-h-[500px] bg-black"
                  playsInline
                  preload="metadata"
                  key={post.cover_image}
                >
                  <source 
                    src={post.cover_image} 
                    type={`video/${post.cover_image.split('.').pop()?.toLowerCase() || 'mp4'}`} 
                  />
                  Your browser does not support the video tag.
                </video>
              </div>
            ) : (
              <img
                src={post.cover_image}
                alt={post.title}
                className="w-full h-auto rounded-xl"
              />
            )}
          </div>
        )}
        
        <div className="prose prose-base md:prose-lg max-w-none">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
      </div>

      {/* Like and Comment Buttons */}
      <div className="bg-white rounded-2xl shadow-lg border border-rose-100 p-4">
        <div className="flex items-center justify-around border-b border-gray-200 pb-4 mb-4">
          <button
            onClick={handleLike}
            disabled={loadingLike}
            className={`flex items-center space-x-2 px-3 py-2 md:px-4 md:py-2 rounded-lg transition-colors ${hasLiked ? 'text-rose-600 bg-rose-50' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <span className="text-xl">{hasLiked ? '❤️' : '🤍'}</span>
            <span className="hidden sm:inline">Like</span>
            {likeCount > 0 && (
              <span className="text-sm">({likeCount})</span>
            )}
          </button>
          
          <button
            onClick={() => setShowCommentForm(!showCommentForm)}
            className="flex items-center space-x-2 px-3 py-2 md:px-4 md:py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <span className="text-xl">💬</span>
            <span className="hidden sm:inline">Comment</span>
            {comments.length > 0 && (
              <span className="text-sm">({comments.length})</span>
            )}
          </button>
          
          <button
            onClick={shareOnFacebook}
            className="flex items-center space-x-2 px-3 py-2 md:px-4 md:py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <span className="text-xl">↗️</span>
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>

        {/* Comment Form */}
        {showCommentForm && (
          <div className="mb-4 md:mb-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-lg font-semibold text-gray-900 mb-3 md:mb-4">Leave a comment</h4>
            
            {commentSuccess && (
              <div className="mb-3 md:mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                ✓ Comment submitted! It will appear after approval.
              </div>
            )}
            
            {commentError && (
              <div className="mb-3 md:mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {commentError}
              </div>
            )}
            
            <form onSubmit={handleCommentSubmit} className="space-y-3 md:space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <div>
                  <input
                    type="text"
                    placeholder="Your name *"
                    value={commentForm.name}
                    onChange={(e) => setCommentForm({ ...commentForm, name: e.target.value })}
                    className="w-full px-3 py-2 md:px-4 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-transparent text-sm"
                    required
                  />
                </div>
                
                <div>
                  <input
                    type="email"
                    placeholder="Email (optional)"
                    value={commentForm.email}
                    onChange={(e) => setCommentForm({ ...commentForm, email: e.target.value })}
                    className="w-full px-3 py-2 md:px-4 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-transparent text-sm"
                  />
                </div>
              </div>
              
              <div>
                <textarea
                  placeholder="What's on your mind? *"
                  value={commentForm.comment}
                  onChange={(e) => setCommentForm({ ...commentForm, comment: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 md:px-4 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-transparent text-sm"
                  required
                />
              </div>
              
              <div className="flex flex-col sm:flex-row sm:justify-end gap-2 sm:space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowCommentForm(false)
                    setCommentForm({ name: '', email: '', comment: '' })
                    setCommentError('')
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium text-sm"
                >
                  Cancel
                </button>
                
                <button
                  type="submit"
                  disabled={submittingComment}
                  className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:from-rose-600 hover:to-pink-600 transition-all font-semibold text-sm disabled:opacity-50"
                >
                  {submittingComment ? 'Posting...' : 'Post Comment'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Comments List */}
        {comments.length > 0 && (
          <div className="space-y-4 md:space-y-6">
            <h3 className="text-lg md:text-xl font-bold text-gray-900">
              Comments ({comments.length})
            </h3>
            
            {comments.map((comment) => (
              <div key={comment.id} className="flex space-x-3 md:space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-rose-100 rounded-full flex items-center justify-center">
                    <span className="text-rose-600 text-sm md:text-base">{comment.name.charAt(0).toUpperCase()}</span>
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="bg-gray-50 rounded-2xl rounded-tl-none p-3 md:p-4">
                    <div className="flex flex-wrap items-center gap-1 md:gap-2 mb-1 md:mb-2">
                      <span className="font-bold text-gray-900 text-sm md:text-base">{comment.name}</span>
                      <span className="text-gray-500 text-xs md:text-sm">• {formatDate(comment.created_at)}</span>
                    </div>
                    <p className="text-gray-700 whitespace-pre-line text-sm md:text-base">{comment.comment}</p>
                    
                    <div className="mt-2 md:mt-3 flex items-center space-x-3 md:space-x-4 text-xs md:text-sm text-gray-500">
                      <button className="hover:text-rose-600">Like</button>
                      <button className="hover:text-rose-600">Reply</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Social Sharing */}
      <div className="bg-white rounded-2xl shadow-lg border border-rose-100 p-4 md:p-6">
        <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4">Share this post</h3>
        <div className="flex flex-wrap gap-2 md:gap-4">
          <button
            onClick={shareOnFacebook}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 md:px-4 md:py-2 rounded-lg transition-colors text-sm"
          >
            <span>f</span>
            <span>Facebook</span>
          </button>
          
          <button
            onClick={shareOnTwitter}
            className="flex items-center space-x-2 bg-blue-400 hover:bg-blue-500 text-white px-3 py-2 md:px-4 md:py-2 rounded-lg transition-colors text-sm"
          >
            <span>🐦</span>
            <span>Twitter</span>
          </button>
          
          <button
            onClick={shareOnWhatsApp}
            className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-3 py-2 md:px-4 md:py-2 rounded-lg transition-colors text-sm"
          >
            <span>💬</span>
            <span>WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  )
}