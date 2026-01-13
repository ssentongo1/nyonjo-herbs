'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import ImageUpload from '@/components/admin/ImageUpload'

export default function EditBlogPostPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: 'Wellness',
    cover_image: '',
    video_url: '',
    media_type: 'article',
    published: 'false'
  })

  useEffect(() => {
    if (id) {
      fetchPost()
    }
  }, [id])

  const fetchPost = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/blog/${id}`)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch blog post')
      }

      const post = data.post
      
      if (post) {
        setFormData({
          title: post.title || '',
          content: post.content || '',
          excerpt: post.excerpt || '',
          category: post.category || 'Wellness',
          cover_image: post.cover_image || '',
          video_url: post.video_url || '',
          media_type: post.media_type || 'article',
          published: post.published ? 'true' : 'false'
        })
      }
    } catch (err: any) {
      console.error('Error fetching blog post:', err)
      setError('Failed to load blog post: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      const postData = {
        ...formData,
        content: formData.content || formData.excerpt
      }

      const response = await fetch(`/api/admin/blog/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update blog post')
      }

      alert('Blog post updated successfully!')
      router.push('/admin/blog')
      router.refresh()
    } catch (err: any) {
      console.error('Update error:', err)
      setError(err.message || 'Failed to update blog post')
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading blog post...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <a href="/admin/blog" className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-r from-rose-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold">NH</span>
                </div>
                <span className="text-xl font-bold text-gray-900">
                  Edit Blog Post
                </span>
              </a>
            </div>
            
            <a href="/admin/blog" className="text-gray-600 hover:text-gray-900">
              ← Back to Blog
            </a>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow border border-gray-200 p-6 md:p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Blog Post</h1>
              <p className="text-gray-600">Update your educational content</p>
            </div>

            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200">
                  Basic Information
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2" htmlFor="title">
                      Title *
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-transparent"
                      placeholder="e.g., 5 Herbal Teas for Better Sleep"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2" htmlFor="category">
                      Category *
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-transparent"
                      required
                    >
                      <option value="Wellness">Wellness</option>
                      <option value="Women's Health">Women's Health</option>
                      <option value="Mental Health">Mental Health</option>
                      <option value="Nutrition">Nutrition</option>
                      <option value="Lifestyle">Lifestyle</option>
                      <option value="Community">Community</option>
                      <option value="Education">Education</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2" htmlFor="excerpt">
                      Short Description/Excerpt *
                    </label>
                    <textarea
                      id="excerpt"
                      name="excerpt"
                      value={formData.excerpt}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-transparent"
                      placeholder="Brief summary shown on blog listing"
                      required
                    />
                    <p className="text-gray-500 text-sm mt-1">Keep it concise (1-2 sentences)</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200">
                  Content
                </h2>
                
                <div>
                  <label className="block text-gray-700 font-semibold mb-2" htmlFor="content">
                    Full Content *
                  </label>
                  <textarea
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    rows={12}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-transparent font-mono text-sm"
                    placeholder="Write your blog post content here... You can use basic HTML for formatting."
                    required
                  />
                  <p className="text-gray-500 text-sm mt-1">
                    You can use simple HTML tags like &lt;p&gt;, &lt;h2&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;a&gt;, &lt;strong&gt;, &lt;em&gt;
                  </p>
                </div>
              </div>

              {/* Media */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200">
                  Media
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Cover Image
                    </label>
                    <ImageUpload
                      onImageUploaded={(url) => setFormData(prev => ({ ...prev, cover_image: url }))}
                      value={formData.cover_image}
                    />
                    <p className="text-gray-500 text-sm mt-2">
                      Optional: Featured image for your blog post
                    </p>
                  </div>

                  <div>
                    <label className="block text-gray700 font-semibold mb-2" htmlFor="video_url">
                      Video URL (Optional)
                    </label>
                    <input
                      type="url"
                      id="video_url"
                      name="video_url"
                      value={formData.video_url}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-transparent"
                      placeholder="https://youtube.com/embed/..."
                    />
                    <p className="text-gray-500 text-sm mt-1">
                      Embed URL from YouTube, Vimeo, etc. Leave empty for text-only post.
                    </p>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2" htmlFor="media_type">
                      Media Type
                    </label>
                    <select
                      id="media_type"
                      name="media_type"
                      value={formData.media_type}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-transparent"
                    >
                      <option value="article">Article (Text)</option>
                      <option value="video">Video Post</option>
                      <option value="image">Image Gallery</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Publishing */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200">
                  Publishing
                </h2>
                
                <div>
                  <label className="block text-gray-700 font-semibold mb-2" htmlFor="published">
                    Publish Status
                  </label>
                  <select
                    id="published"
                    name="published"
                    value={formData.published}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-transparent"
                  >
                    <option value="false">Save as Draft</option>
                    <option value="true">Publish Now</option>
                  </select>
                  <p className="text-gray-500 text-sm mt-1">
                    Draft posts are only visible to you. Published posts are visible to everyone.
                  </p>
                </div>
              </div>

              {/* Form Actions */}
              <div className="pt-8 border-t border-gray-200">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <p className="text-gray-600 text-sm">
                      Fields marked with * are required
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <button
                      type="button"
                      onClick={() => router.push('/admin/blog')}
                      className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                    
                    <button
                      type="submit"
                      disabled={saving}
                      className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-8 py-3 rounded-lg hover:from-rose-600 hover:to-pink-600 transition-all font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saving ? 'Updating...' : 'Update Blog Post'}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}