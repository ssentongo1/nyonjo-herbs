'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminDashboard() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [unreadMessages, setUnreadMessages] = useState(0)
  const [stats, setStats] = useState({
    totalProducts: 0,
    publishedPosts: 0,
    sisterhoodPosts: 0,
    featuredProducts: 0,
    featuredBlog: false,
    featuredSisterhood: false
  })
  
  // Logo upload states
  const [logoPreview, setLogoPreview] = useState('')
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [uploadSuccess, setUploadSuccess] = useState(false)

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = () => {
      const sessionStr = localStorage.getItem('nyonjo_admin_session')
      
      if (!sessionStr) {
        router.push('/admin')
        return
      }

      try {
        const session = JSON.parse(sessionStr)
        if (session.expires > Date.now()) {
          setIsAuthenticated(true)
        } else {
          localStorage.removeItem('nyonjo_admin_session')
          router.push('/admin')
        }
      } catch {
        router.push('/admin')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  useEffect(() => {
    if (isAuthenticated) {
      fetchStats()
      fetchUnreadMessages()
      fetchCurrentLogo()
    }
  }, [isAuthenticated])

  const fetchStats = async () => {
    try {
      const [productsRes, blogRes, sisterhoodRes] = await Promise.all([
        fetch('/api/admin/products'),
        fetch('/api/admin/blog'),
        fetch('/api/admin/sisterhood')
      ])
      
      const productsData = await productsRes.json()
      const blogData = await blogRes.json()
      const sisterhoodData = await sisterhoodRes.json()

      if (productsRes.ok && blogRes.ok && sisterhoodRes.ok) {
        const products = productsData.products || []
        const blogPosts = blogData.posts || []
        const sisterhoodPosts = sisterhoodData.posts || sisterhoodData
        
        setStats({
          totalProducts: products.length,
          publishedPosts: blogPosts.filter((post: any) => post.published).length,
          sisterhoodPosts: sisterhoodPosts.length,
          featuredProducts: products.filter((product: any) => product.featured).length,
          featuredBlog: blogPosts.some((post: any) => post.featured),
          featuredSisterhood: sisterhoodPosts.some((post: any) => post.featured)
        })
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const fetchUnreadMessages = async () => {
    try {
      const response = await fetch('/api/admin/messages')
      const data = await response.json()
      if (response.ok) {
        const unread = data.messages.filter((msg: any) => msg.status === 'unread').length
        setUnreadMessages(unread)
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }

  const fetchCurrentLogo = async () => {
    try {
      const response = await fetch('/api/admin/logo')
      const data = await response.json()
      if (response.ok && data.logoUrl) {
        setLogoPreview(data.logoUrl)
      }
    } catch (error) {
      console.error('Error fetching logo:', error)
    }
  }

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    
    setUploadError('')
    setUploadSuccess(false)
    
    // Get session from localStorage
    const sessionStr = localStorage.getItem('nyonjo_admin_session')
    if (!sessionStr) {
      setUploadError('Please login again')
      return
    }
    
    // Preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setLogoPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
    
    // Upload
    setUploadingLogo(true)
    
    const formData = new FormData()
    formData.append('logo', file)
    
    try {
      const response = await fetch('/api/admin/logo', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${sessionStr}`
        }
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Upload failed')
      }
      
      setUploadSuccess(true)
      setTimeout(() => setUploadSuccess(false), 3000)
      
      // Update preview with actual URL from server
      if (data.logoUrl) {
        setLogoPreview(data.logoUrl)
      }
      
    } catch (error: any) {
      setUploadError(error.message || 'Failed to upload logo')
      console.error('Upload error:', error)
    } finally {
      setUploadingLogo(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('nyonjo_admin_session')
    router.push('/admin')
    router.refresh()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-rose-500 to-pink-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">NH</span>
                </div>
                <span className="text-lg font-bold text-gray-900">
                  Nyonjo <span className="text-rose-600">Admin</span>
                </span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-3">
              <Link
                href="/admin/messages"
                className="relative px-3 py-1.5 bg-rose-50 text-rose-700 rounded-lg hover:bg-rose-100 transition-colors font-medium text-sm"
              >
                Messages
                {unreadMessages > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadMessages}
                  </span>
                )}
              </Link>
              
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="p-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Admin Dashboard</h1>
          <p className="text-gray-600 text-sm">Welcome to your management dashboard</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-lg shadow border border-gray-200 p-3">
            <p className="text-gray-600 text-xs">Products</p>
            <p className="text-xl font-bold text-gray-900">{stats.totalProducts}</p>
            <p className="text-rose-600 text-xs mt-1">{stats.featuredProducts} featured</p>
          </div>
          
          <div className="bg-white rounded-lg shadow border border-gray-200 p-3">
            <p className="text-gray-600 text-xs">Blog Posts</p>
            <p className="text-xl font-bold text-gray-900">{stats.publishedPosts}</p>
            <p className="text-blue-600 text-xs mt-1">{stats.featuredBlog ? '1 featured' : 'None featured'}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow border border-gray-200 p-3">
            <p className="text-gray-600 text-xs">Sisterhood</p>
            <p className="text-xl font-bold text-gray-900">{stats.sisterhoodPosts}</p>
            <p className="text-pink-600 text-xs mt-1">{stats.featuredSisterhood ? '1 featured' : 'None featured'}</p>
          </div>
        </div>

        {/* Quick Actions - Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
          <Link href="/admin/products" className="block">
            <div className="bg-white rounded-lg shadow border border-gray-200 p-4 hover:shadow-md transition-shadow h-full">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-rose-600">🌿</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">Manage Products</h3>
                  <p className="text-gray-600 text-xs">Add, edit, or remove herbal products</p>
                </div>
              </div>
            </div>
          </Link>
          
          <Link href="/admin/blog" className="block">
            <div className="bg-white rounded-lg shadow border border-gray-200 p-4 hover:shadow-md transition-shadow h-full">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-blue-600">📝</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">Manage Blog</h3>
                  <p className="text-gray-600 text-xs">Create and edit blog posts</p>
                </div>
              </div>
            </div>
          </Link>
          
          <Link href="/admin/messages" className="block">
            <div className="bg-white rounded-lg shadow border border-gray-200 p-4 hover:shadow-md transition-shadow h-full relative">
              {unreadMessages > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                  {unreadMessages}
                </span>
              )}
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-green-600">💬</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">Messages</h3>
                  <p className="text-gray-600 text-xs">{unreadMessages > 0 ? `${unreadMessages} unread` : 'View customer messages'}</p>
                </div>
              </div>
            </div>
          </Link>
          
          <Link href="/admin/sisterhood" className="block">
            <div className="bg-white rounded-lg shadow border border-gray-200 p-4 hover:shadow-md transition-shadow h-full">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-pink-600">👭</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">Sisterhood Posts</h3>
                  <p className="text-gray-600 text-xs">Manage community posts</p>
                </div>
              </div>
            </div>
          </Link>
          
          <Link href="/" target="_blank" className="block sm:col-span-2 lg:col-span-1">
            <div className="bg-white rounded-lg shadow border border-gray-200 p-4 hover:shadow-md transition-shadow h-full">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-purple-600">👀</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">View Live Site</h3>
                  <p className="text-gray-600 text-xs">See how your site looks to visitors</p>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Logo Management Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">🎨 Site Logo</h3>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden bg-gray-50">
                {logoPreview ? (
                  <img 
                    src={logoPreview} 
                    alt="Logo preview" 
                    className="w-full h-full object-contain"
                    onError={() => setLogoPreview('')}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">NH</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex-1">
              <p className="text-gray-600 text-xs mb-2">
                Upload a logo for your site. Recommended: 200x200px, PNG or SVG.
              </p>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp,image/svg+xml"
                    className="hidden"
                    onChange={handleLogoUpload}
                    disabled={uploadingLogo}
                  />
                  <div className={`px-3 py-1.5 rounded-lg transition-colors text-xs font-medium ${uploadingLogo ? 'bg-gray-400 cursor-not-allowed' : 'bg-rose-500 hover:bg-rose-600 cursor-pointer'} text-white`}>
                    {uploadingLogo ? 'Uploading...' : 'Choose File'}
                  </div>
                </label>
                
                {uploadError && (
                  <p className="text-red-600 text-xs">{uploadError}</p>
                )}
                
                {uploadSuccess && (
                  <p className="text-green-600 text-xs">✓ Logo updated successfully!</p>
                )}
              </div>
            </div>
          </div>
          
          <div className="pt-3 border-t border-gray-200">
            <p className="text-gray-500 text-xs">
              The logo will appear in the navigation bar and footer across your entire site.
              Refresh the live site to see changes.
            </p>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-4 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Getting Started</h2>
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="w-6 h-6 bg-rose-100 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                <span className="text-rose-600 text-xs">1</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm mb-0.5">Add Products</h3>
                <p className="text-gray-600 text-xs">Start by adding your herbal products to the shop</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-6 h-6 bg-rose-100 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                <span className="text-rose-600 text-xs">2</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm mb-0.5">Create Blog Content</h3>
                <p className="text-gray-600 text-xs">Share educational content about herbal wellness</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-6 h-6 bg-rose-100 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                <span className="text-rose-600 text-xs">3</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm mb-0.5">Check Messages</h3>
                <p className="text-gray-600 text-xs">
                  {unreadMessages > 0 
                    ? `You have ${unreadMessages} unread message${unreadMessages > 1 ? 's' : ''} to respond to`
                    : 'Respond to customer inquiries from the contact form'
                  }
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-6 h-6 bg-rose-100 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                <span className="text-rose-600 text-xs">4</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm mb-0.5">Monitor Sisterhood</h3>
                <p className="text-gray-600 text-xs">Review and manage anonymous community posts</p>
              </div>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <Link 
              href={unreadMessages > 0 ? "/admin/messages" : "/admin/products"}
              className="inline-flex items-center bg-gradient-to-r from-rose-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:from-rose-600 hover:to-pink-600 transition-all font-semibold text-sm"
            >
              {unreadMessages > 0 ? 'Check Messages →' : 'Get Started →'}
            </Link>
          </div>
        </div>

        {/* Featured Items Status */}
        <div className="bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">📊 Homepage Featured Items</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-700 text-xs">Featured Blog Post:</span>
              <span className={`text-xs font-medium ${stats.featuredBlog ? 'text-green-600' : 'text-amber-600'}`}>
                {stats.featuredBlog ? '✓ Active' : 'Not set'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700 text-xs">Featured Products:</span>
              <span className="text-xs font-medium text-rose-600">{stats.featuredProducts}/2</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700 text-xs">Featured Sisterhood Story:</span>
              <span className={`text-xs font-medium ${stats.featuredSisterhood ? 'text-green-600' : 'text-amber-600'}`}>
                {stats.featuredSisterhood ? '✓ Active' : 'Not set'}
              </span>
            </div>
          </div>
          <p className="text-gray-600 text-xs mt-3">
            Tip: Feature items from their respective management pages to showcase them on the homepage.
          </p>
        </div>
      </div>
    </div>
  )
}