'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

type Comment = {
  id: string
  post_id: string
  name: string
  email: string | null
  comment: string
  is_approved: boolean
  created_at: string
  blog_posts: {
    title: string
  }
}

export default function AdminCommentsPage() {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('pending')

  useEffect(() => {
    fetchComments()
  }, [])

  const fetchComments = async () => {
    try {
      const response = await fetch('/api/admin/blog/comments')
      const data = await response.json()
      if (response.ok) {
        setComments(data.comments)
      }
    } catch (error) {
      console.error('Error fetching comments:', error)
    } finally {
      setLoading(false)
    }
  }

  const approveComment = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/blog/comments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_approved: true }),
      })

      if (response.ok) {
        setComments(comments.map(comment => 
          comment.id === id ? { ...comment, is_approved: true } : comment
        ))
      }
    } catch (error) {
      console.error('Error approving comment:', error)
    }
  }

  const deleteComment = async (id: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return

    try {
      const response = await fetch(`/api/admin/blog/comments/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setComments(comments.filter(c => c.id !== id))
      }
    } catch (error) {
      console.error('Error deleting comment:', error)
    }
  }

  const filteredComments = comments.filter(comment => {
    // Apply search filter
    const matchesSearch = 
      comment.name.toLowerCase().includes(search.toLowerCase()) ||
      comment.comment.toLowerCase().includes(search.toLowerCase()) ||
      comment.blog_posts.title.toLowerCase().includes(search.toLowerCase())
    
    // Apply status filter
    if (filter === 'pending') return matchesSearch && !comment.is_approved
    if (filter === 'approved') return matchesSearch && comment.is_approved
    return matchesSearch
  })

  const pendingCount = comments.filter(c => !c.is_approved).length
  const approvedCount = comments.filter(c => c.is_approved).length

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/admin/dashboard" className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-r from-rose-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold">NH</span>
                </div>
                <span className="text-xl font-bold text-gray-900">
                  Blog Comments
                </span>
              </Link>
              
              {pendingCount > 0 && (
                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {pendingCount} pending
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              <Link href="/admin/blog" className="text-gray-600 hover:text-gray-900 font-medium">
                ← Back to Posts
              </Link>
              <Link href="/admin/dashboard" className="text-gray-600 hover:text-gray-900">
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Comments</h1>
              <p className="text-gray-600">Review and approve comments on your blog posts</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search comments..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-transparent"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <span className="text-gray-400">🔍</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium ${filter === 'all' ? 'bg-rose-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            All ({comments.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg font-medium ${filter === 'pending' ? 'bg-yellow-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            Pending ({pendingCount})
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-4 py-2 rounded-lg font-medium ${filter === 'approved' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            Approved ({approvedCount})
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading comments...</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
            {filteredComments.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {filteredComments.map((comment) => (
                  <div key={comment.id} className="p-6 hover:bg-gray-50">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-gray-900 mb-1">
                          {comment.blog_posts.title}
                        </h3>
                        <div className="flex items-center space-x-3 text-sm text-gray-600">
                          <span>By: {comment.name}</span>
                          {comment.email && (
                            <span>• {comment.email}</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs font-semibold px-2 py-1 rounded ${comment.is_approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {comment.is_approved ? 'APPROVED' : 'PENDING'}
                        </span>
                        <span className="text-sm text-gray-500">
                          {formatDate(comment.created_at)}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-4 whitespace-pre-line">
                      {comment.comment}
                    </p>
                    
                    <div className="flex items-center space-x-3">
                      {!comment.is_approved && (
                        <button
                          onClick={() => approveComment(comment.id)}
                          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                        >
                          Approve
                        </button>
                      )}
                      
                      <button
                        onClick={() => deleteComment(comment.id)}
                        className="bg-red-50 text-red-700 hover:bg-red-100 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                      >
                        Delete
                      </button>
                      
                      <Link
                        href={`/blog/${comment.post_id}`}
                        target="_blank"
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        View Post
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-gray-400">💬</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {search || filter !== 'all' ? 'No comments found' : 'No comments yet'}
                </h3>
                <p className="text-gray-600">
                  {search ? 'Try a different search term' : 'Comments from readers will appear here'}
                </p>
              </div>
            )}
          </div>
        )}

        {!loading && (
          <div className="mt-8 text-sm text-gray-500">
            <div className="flex justify-between">
              <span>Total comments:</span>
              <span>{comments.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Pending approval:</span>
              <span className="text-yellow-600 font-semibold">{pendingCount}</span>
            </div>
            <div className="flex justify-between">
              <span>Approved comments:</span>
              <span className="text-green-600 font-semibold">{approvedCount}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}