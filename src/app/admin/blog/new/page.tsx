'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ImageUpload from '@/components/admin/ImageUpload'

export default function NewBlogPostPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: 'Wellness',
    cover_image: '',
    media_type: 'article',
    published: 'false'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Auto-detect media type from URL
      const mediaType = formData.cover_image 
        ? (formData.cover_image.match(/\.(mp4|webm|mov|avi)$/i) ? 'video' : 'image')
        : 'article'

      const postData = {
        ...formData,
        content: formData.content || formData.excerpt,
        media_type: mediaType
      }

      const response = await fetch('/api/admin/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create blog post')
      }

      alert('Blog post created successfully!')
      router.push('/admin/blog')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Failed to create blog post')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageUploaded = (url: string) => {
    setFormData(prev => ({ 
      ...prev, 
      cover_image: url 
    }))
  }

  const getMediaTypeFromUrl = (url: string) => {
    if (!url) return 'article'
    const videoExtensions = ['.mp4', '.webm', '.mov', '.avi']
    const isVideo = videoExtensions.some(ext => url.toLowerCase().endsWith(ext))
    return isVideo ? 'video' : 'image'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile-First Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => router.push('/admin/blog')}
                className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition-colors md:hidden"
              >
                <span className="text-2xl">←</span>
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-rose-500 to-pink-600 rounded-lg flex items-center justify-center md:w-10 md:h-10 md:rounded-xl">
                  <span className="text-white font-bold text-sm md:text-base">NH</span>
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900 md:text-xl">New Blog Post</h1>
                  <p className="text-xs text-gray-500 hidden md:block">Share educational content</p>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => router.push('/admin/blog')}
              className="hidden md:inline-flex items-center text-gray-600 hover:text-gray-900 text-sm"
            >
              ← Back to Blog
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-4 md:py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow border border-gray-200 p-4 md:p-8">
            {/* Page Header */}
            <div className="mb-6 md:mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-1 md:text-3xl md:mb-2">Create New Blog Post</h1>
              <p className="text-gray-600 text-sm md:text-base">Share educational content with your community</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 md:mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm md:text-base">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
              {/* Basic Information */}
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4 pb-3 border-b border-gray-200 md:text-xl md:mb-6 md:pb-4">
                  Basic Information
                </h2>
                
                <div className="space-y-4 md:space-y-6">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1 md:mb-2 text-sm md:text-base" htmlFor="title">
                      Title *
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-transparent text-sm md:text-base md:px-4 md:py-3"
                      placeholder="e.g., 5 Herbal Teas for Better Sleep"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-1 md:mb-2 text-sm md:text-base" htmlFor="category">
                      Category *
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-transparent text-sm md:text-base md:px-4 md:py-3"
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
                    <label className="block text-gray-700 font-semibold mb-1 md:mb-2 text-sm md:text-base" htmlFor="excerpt">
                      Short Description/Excerpt *
                    </label>
                    <textarea
                      id="excerpt"
                      name="excerpt"
                      value={formData.excerpt}
                      onChange={handleChange}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-transparent text-sm md:text-base md:px-4 md:py-3"
                      placeholder="Brief summary shown on blog listing"
                      required
                    />
                    <p className="text-gray-500 text-xs mt-1 md:text-sm">Keep it concise (1-2 sentences)</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4 pb-3 border-b border-gray-200 md:text-xl md:mb-6 md:pb-4">
                  Content
                </h2>
                
                <div>
                  <label className="block text-gray-700 font-semibold mb-1 md:mb-2 text-sm md:text-base" htmlFor="content">
                    Full Content *
                  </label>
                  <textarea
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    rows={8}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-transparent font-mono text-xs md:text-sm md:px-4 md:py-3 md:rows-12"
                    placeholder="Write your blog post content here... You can use basic HTML for formatting."
                    required
                  />
                  <p className="text-gray-500 text-xs mt-1 md:text-sm">
                    You can use simple HTML tags like &lt;p&gt;, &lt;h2&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;a&gt;, &lt;strong&gt;, &lt;em&gt;
                  </p>
                </div>
              </div>

              {/* Media */}
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4 pb-3 border-b border-gray-200 md:text-xl md:mb-6 md:pb-4">
                  Media
                </h2>
                
                <div className="space-y-4 md:space-y-6">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1 md:mb-2 text-sm md:text-base">
                      Cover Image or Video
                    </label>
                    <div className="mb-2">
                      <ImageUpload
                        onImageUploaded={handleImageUploaded}
                        value={formData.cover_image}
                      />
                    </div>
                    <div className="space-y-2">
                      <p className="text-gray-500 text-xs md:text-sm">
                        Upload an image (.jpg, .png, .gif) or video (.mp4, .webm, .mov, .avi)
                      </p>
                      {formData.cover_image && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <div className="flex items-center">
                            <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium mr-2 ${
                              getMediaTypeFromUrl(formData.cover_image) === 'video' 
                                ? 'bg-purple-100 text-purple-800' 
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {getMediaTypeFromUrl(formData.cover_image) === 'video' ? '🎬 Video' : '🖼️ Image'}
                            </span>
                            <span className="text-xs text-gray-600 truncate flex-1">
                              {formData.cover_image}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Publishing */}
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4 pb-3 border-b border-gray-200 md:text-xl md:mb-6 md:pb-4">
                  Publishing
                </h2>
                
                <div>
                  <label className="block text-gray-700 font-semibold mb-1 md:mb-2 text-sm md:text-base" htmlFor="published">
                    Publish Status
                  </label>
                  <select
                    id="published"
                    name="published"
                    value={formData.published}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-transparent text-sm md:text-base md:px-4 md:py-3"
                  >
                    <option value="false">Save as Draft</option>
                    <option value="true">Publish Immediately</option>
                  </select>
                  <p className="text-gray-500 text-xs mt-1 md:text-sm">
                    Draft posts are only visible to you. Published posts are visible to everyone.
                  </p>
                </div>
              </div>

              {/* Form Actions */}
              <div className="pt-6 border-t border-gray-200 md:pt-8">
                <div className="flex flex-col-reverse md:flex-row md:items-center justify-between gap-3 md:gap-4">
                  <div className="md:order-1">
                    <p className="text-gray-600 text-xs text-center md:text-left md:text-sm">
                      Fields marked with * are required
                    </p>
                  </div>
                  
                  <div className="flex flex-col gap-3 w-full md:flex-row md:w-auto md:items-center md:space-x-4">
                    <button
                      type="button"
                      onClick={() => router.push('/admin/blog')}
                      className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm md:text-base md:px-6 md:py-3"
                    >
                      Cancel
                    </button>
                    
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-4 py-2.5 rounded-lg hover:from-rose-600 hover:to-pink-600 transition-all font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base md:px-8 md:py-3"
                    >
                      {loading ? 'Creating...' : 'Create Blog Post'}
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