'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Post {
  id: string;
  username: string;
  content: string;
  media_url: string | null;
  media_type?: string;
  likes: number;
  comment_count: number;
  created_at: string;
  is_approved: boolean;
  featured: boolean;
  category: string;
}

export default function AdminSisterhoodPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [updating, setUpdating] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  useEffect(() => {
    const checkAuth = () => {
      const sessionStr = localStorage.getItem('nyonjo_admin_session');
      
      if (!sessionStr) {
        router.push('/admin');
        return;
      }

      try {
        const session = JSON.parse(sessionStr);
        if (session.expires > Date.now()) {
          setIsAuthenticated(true);
          fetchPosts();
        } else {
          localStorage.removeItem('nyonjo_admin_session');
          router.push('/admin');
        }
      } catch {
        router.push('/admin');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/admin/sisterhood');
      const data = await res.json();
      setPosts(data.posts || data);
      setFilteredPosts(data.posts || data);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    }
  };

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredPosts(posts);
    } else {
      const filtered = posts.filter(post =>
        post.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPosts(filtered);
    }
  }, [searchTerm, posts]);

  const handleDelete = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/sisterhood/${postId}`, {
        method: 'DELETE',
      });
      
      if (res.ok) {
        setPosts(posts.filter(post => post.id !== postId));
        alert('Post deleted successfully');
      } else {
        const error = await res.json();
        alert(`Delete failed: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Delete failed. Please try again.');
    }
  };

  const toggleApproval = async (postId: string, currentStatus: boolean) => {
    try {
      setUpdating(postId);
      const res = await fetch(`/api/admin/sisterhood/${postId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_approved: !currentStatus }),
      });
      
      if (res.ok) {
        setPosts(posts.map(post => 
          post.id === postId ? { ...post, is_approved: !currentStatus } : post
        ));
      } else {
        const error = await res.json();
        alert(`Failed to update: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Failed to toggle approval:', error);
      alert('Failed to update post approval status');
    } finally {
      setUpdating(null);
    }
  };

  const toggleFeatured = async (post: Post) => {
    if (!post.is_approved) {
      alert('Only approved posts can be featured on the homepage');
      return;
    }
    
    setUpdating(post.id);
    
    try {
      const response = await fetch(`/api/admin/sisterhood/${post.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          featured: !post.featured
        }),
      });

      if (response.ok) {
        // Update local state
        setPosts(posts.map(p => 
          p.id === post.id ? { ...p, featured: !p.featured } : p
        ))
        
        // If featuring this post and we already have a featured post, 
        // unfeature the current one (limit to 1 featured sisterhood post)
        if (!post.featured) {
          const currentFeatured = posts.find(p => p.featured && p.id !== post.id && p.is_approved)
          
          if (currentFeatured) {
            await fetch(`/api/admin/sisterhood/${currentFeatured.id}`, {
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
      } else {
        const error = await response.json();
        alert(`Failed to feature: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error updating featured status:', error)
      alert('Failed to update featured status')
    } finally {
      setUpdating(null)
    }
  };

  const isImage = (url: string) => {
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
  };

  const isVideo = (url: string) => {
    return /\.(mp4|webm|mov|avi)$/i.test(url);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('nyonjo_admin_session');
    router.push('/admin');
  };

  const featuredPost = posts.find(post => post.featured && post.is_approved);
  const approvedPosts = posts.filter(post => post.is_approved).length;
  const pendingPosts = posts.filter(post => !post.is_approved).length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
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
                  Sisterhood
                </span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-2">
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
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-white rounded-lg shadow border border-gray-200 p-3">
            <p className="text-gray-600 text-xs">Total Posts</p>
            <p className="text-xl font-bold text-gray-900">{posts.length}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow border border-gray-200 p-3">
            <p className="text-gray-600 text-xs">Approved</p>
            <p className="text-xl font-bold text-green-600">{approvedPosts}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow border border-gray-200 p-3">
            <p className="text-gray-600 text-xs">Pending</p>
            <p className="text-xl font-bold text-yellow-600">{pendingPosts}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow border border-gray-200 p-3">
            <p className="text-gray-600 text-xs">Featured</p>
            <p className="text-xl font-bold text-pink-600">{featuredPost ? 1 : 0}</p>
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
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-transparent text-sm"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
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
                <button 
                  onClick={fetchPosts}
                  className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium"
                >
                  Refresh
                </button>
                <Link
                  href="/admin/dashboard"
                  className="px-3 py-1.5 bg-rose-600 text-white rounded-lg hover:bg-rose-700 text-sm font-medium"
                >
                  ← Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Posts */}
        {filteredPosts.length === 0 ? (
          <div className="bg-white rounded-lg shadow border border-gray-200 p-8 text-center">
            <div className="text-4xl mb-4 text-gray-300">👭</div>
            <p className="text-gray-500">No posts found</p>
            <p className="text-gray-400 text-sm mt-1">
              {searchTerm ? 'Try a different search term' : 'No posts have been created yet'}
            </p>
          </div>
        ) : viewMode === 'list' ? (
          /* List View */
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <div key={post.id} className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                <div className="p-4">
                  {/* Post Header */}
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-r from-rose-400 to-pink-500 rounded-full flex items-center justify-center mr-2">
                        <span className="text-white text-xs font-bold">
                          {post.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 text-sm">{post.username}</div>
                        <div className="text-xs text-gray-500">{formatDate(post.created_at)}</div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-1">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${post.is_approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {post.is_approved ? '✓' : '⏳'}
                      </span>
                      {post.featured && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gradient-to-r from-pink-100 to-purple-100 text-pink-800">
                          ★
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Post Content */}
                  <div className="mb-3">
                    <p className="text-gray-800 text-sm line-clamp-2">{post.content}</p>
                    {post.content.length > 100 && (
                      <button className="text-xs text-rose-600 hover:text-rose-700 mt-1">
                        Show more
                      </button>
                    )}
                  </div>
                  
                  {/* Media Preview - FIXED FOR VIDEOS */}
                  {post.media_url && (
                    <div className="mb-3">
                      <div className="w-full h-48 bg-black rounded-lg overflow-hidden">
                        {isImage(post.media_url) ? (
                          <img 
                            src={post.media_url} 
                            alt="Post media" 
                            className="w-full h-full object-contain"
                          />
                        ) : isVideo(post.media_url) ? (
                          <video 
                            controls 
                            className="w-full h-full object-contain"
                          >
                            <source src={post.media_url} type={`video/${post.media_url.split('.').pop()}`} />
                            Your browser does not support videos.
                          </video>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-gray-400">📁 Media</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Stats */}
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center">
                        <span className="mr-1">❤️</span>
                        <span>{post.likes}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="mr-1">💬</span>
                        <span>{post.comment_count || 0}</span>
                      </div>
                    </div>
                    <span className="bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded-full">
                      {post.category || 'General'}
                    </span>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => toggleApproval(post.id, post.is_approved)}
                      disabled={updating === post.id}
                      className={`px-3 py-2 rounded-lg text-xs font-medium ${post.is_approved ? 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100' : 'bg-green-50 text-green-600 hover:bg-green-100'} disabled:opacity-50`}
                    >
                      {updating === post.id ? 'Updating...' : (post.is_approved ? 'Unapprove' : 'Approve')}
                    </button>
                    
                    <button
                      onClick={() => toggleFeatured(post)}
                      disabled={!post.is_approved || updating === post.id}
                      className={`px-3 py-2 rounded-lg text-xs font-medium ${post.featured ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} disabled:opacity-50`}
                    >
                      {post.featured ? '★ Featured' : '☆ Feature'}
                    </button>
                    
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="col-span-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 text-xs font-medium"
                    >
                      Delete Post
                    </button>
                  </div>
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
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-r from-rose-400 to-pink-500 rounded-full flex items-center justify-center mr-2">
                        <span className="text-white text-xs font-bold">
                          {post.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="text-xs">
                        <div className="font-medium text-gray-900">{post.username}</div>
                        <div className="text-gray-500">{formatDate(post.created_at)}</div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end space-y-1">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${post.is_approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {post.is_approved ? 'Approved' : 'Pending'}
                      </span>
                      {post.featured && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gradient-to-r from-pink-100 to-purple-100 text-pink-800">
                          Featured
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-gray-800 text-sm mb-3 line-clamp-3">{post.content}</p>
                  
                  {/* Media Preview in Grid View */}
                  {post.media_url && (
                    <div className="mb-3">
                      <div className="w-full h-32 bg-black rounded-lg overflow-hidden">
                        {isImage(post.media_url) ? (
                          <img 
                            src={post.media_url} 
                            alt="Post media" 
                            className="w-full h-full object-cover"
                          />
                        ) : isVideo(post.media_url) ? (
                          <video 
                            controls 
                            className="w-full h-full object-cover"
                          >
                            <source src={post.media_url} type={`video/${post.media_url.split('.').pop()}`} />
                            Your browser does not support videos.
                          </video>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-gray-400 text-sm">🎬 Media</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <div className="flex items-center space-x-2">
                      <span>❤️ {post.likes}</span>
                      <span>💬 {post.comment_count || 0}</span>
                    </div>
                    <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full">
                      {post.category || 'General'}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <button
                      onClick={() => toggleApproval(post.id, post.is_approved)}
                      disabled={updating === post.id}
                      className={`w-full px-3 py-2 rounded-lg text-xs font-medium ${post.is_approved ? 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100' : 'bg-green-50 text-green-600 hover:bg-green-100'} disabled:opacity-50`}
                    >
                      {updating === post.id ? 'Updating...' : (post.is_approved ? 'Unapprove' : 'Approve')}
                    </button>
                    
                    <button
                      onClick={() => toggleFeatured(post)}
                      disabled={!post.is_approved || updating === post.id}
                      className={`w-full px-3 py-2 rounded-lg text-xs font-medium ${post.featured ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} disabled:opacity-50`}
                    >
                      {post.featured ? '★ Featured' : '☆ Feature on Home'}
                    </button>
                    
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="w-full px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 text-xs font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info Box */}
        <div className="mt-6 bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">💡 Quick Guide</h3>
          <ul className="text-gray-700 text-xs space-y-1">
            <li className="flex items-start">
              <span className="text-pink-500 mr-1">•</span>
              <span><strong>Approve</strong> posts before featuring them</span>
            </li>
            <li className="flex items-start">
              <span className="text-pink-500 mr-1">•</span>
              <span>Only <strong>1 post</strong> can be featured on homepage</span>
            </li>
            <li className="flex items-start">
              <span className="text-pink-500 mr-1">•</span>
              <span>Featured posts appear in "Today's Sisterhood Story"</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}