'use client';

import { useEffect, useState } from 'react';
import DeleteModal from './DeleteModal';
import Comments from './Comments';

interface Post {
  id: string;
  username: string;
  content: string;
  media_url: string | null;
  likes: number;
  created_at: string;
}

export default function PostsFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [deleteModal, setDeleteModal] = useState<{isOpen: boolean; postId: string; username: string}>({
    isOpen: false,
    postId: '',
    username: ''
  });
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [editPost, setEditPost] = useState<{id: string; content: string} | null>(null);
  const [showComments, setShowComments] = useState<string | null>(null);
  const [commentCounts, setCommentCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    fetchPosts();
    const saved = localStorage.getItem('sisterhood-liked-posts');
    if (saved) {
      setLikedPosts(new Set(JSON.parse(saved)));
    }
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/sisterhood/posts');
      const data = await res.json();
      setPosts(data);
      
      // Fetch comment counts for each post
      data.forEach(async (post: Post) => {
        const commentsRes = await fetch(`/api/sisterhood/posts/${post.id}/comments`);
        const comments = await commentsRes.json();
        setCommentCounts(prev => ({
          ...prev,
          [post.id]: comments.length
        }));
      });
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const isPostOwner = (postId: string, postUsername: string) => {
    const savedUsername = localStorage.getItem('sisterhood_username');
    const postOwner = localStorage.getItem(`post_${postId}_owner`);
    return savedUsername === postUsername || postOwner === postUsername;
  };

  const handleLike = async (postId: string) => {
    const isCurrentlyLiked = likedPosts.has(postId);
    const action = isCurrentlyLiked ? 'unlike' : 'like';
    
    try {
      const res = await fetch(`/api/sisterhood/posts/${postId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      
      if (res.ok) {
        const updatedPost = await res.json();
        
        setPosts(posts.map(post => 
          post.id === postId 
            ? { ...post, likes: updatedPost.likes }
            : post
        ));
        
        let newLiked;
        if (isCurrentlyLiked) {
          newLiked = new Set([...likedPosts]);
          newLiked.delete(postId);
        } else {
          newLiked = new Set([...likedPosts, postId]);
        }
        setLikedPosts(newLiked);
        localStorage.setItem('sisterhood-liked-posts', JSON.stringify([...newLiked]));
      }
    } catch (error) {
      console.error('Like request failed:', error);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/sisterhood/posts/${deleteModal.postId}`, {
        method: 'DELETE',
      });
      
      if (res.ok) {
        setPosts(posts.filter(post => post.id !== deleteModal.postId));
        setDeleteModal({ isOpen: false, postId: '', username: '' });
        setOpenDropdown(null);
      } else {
        const error = await res.json();
        alert(`Delete failed: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Delete request failed:', error);
    }
  };

  const handleEdit = async () => {
    if (!editPost || !editPost.content.trim()) return;
    
    try {
      const res = await fetch(`/api/sisterhood/posts/${editPost.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editPost.content }),
      });
      
      if (res.ok) {
        const updatedPost = await res.json();
        setPosts(posts.map(post => 
          post.id === editPost.id 
            ? { ...post, content: updatedPost.content }
            : post
        ));
        setEditPost(null);
      }
    } catch (error) {
      console.error('Edit failed:', error);
    }
  };

  const isImage = (url: string) => {
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
  };

  const isVideo = (url: string) => {
    return /\.(mp4|webm|mov|avi)$/i.test(url);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as Element).closest('.post-dropdown')) {
        setOpenDropdown(null);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  if (loading) return (
    <div className="text-center py-8">
      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600"></div>
      <p className="mt-2 text-gray-500">Loading posts...</p>
    </div>
  );

  return (
    <>
      <div className="space-y-6">
        {posts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-6xl mb-4">👭</div>
            <p className="text-lg">No posts yet. Be the first to share!</p>
            <p className="text-sm mt-2">Your story could inspire someone today.</p>
          </div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="p-4 md:p-6 border border-gray-200 rounded-xl shadow-sm bg-white relative">
              {editPost?.id === post.id ? (
                /* Edit Mode */
                <div className="space-y-4">
                  <textarea
                    value={editPost.content}
                    onChange={(e) => setEditPost({...editPost, content: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg break-words"
                    rows={3}
                  />
                  <div className="flex space-x-3">
                    <button
                      onClick={handleEdit}
                      className="px-4 py-2 bg-rose-600 text-white rounded-lg"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditPost(null)}
                      className="px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                /* View Mode */
                <>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-r from-rose-400 to-pink-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <span className="text-white font-bold">
                          {post.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-900 block">{post.username}</span>
                        <p className="text-xs text-gray-500">
                          {new Date(post.created_at).toLocaleDateString()} •{' '}
                          {new Date(post.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                    
                    {/* Post Actions Menu - Only show if owner */}
                    {isPostOwner(post.id, post.username) && (
                      <div className="relative post-dropdown">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenDropdown(openDropdown === post.id ? null : post.id);
                          }}
                          className="text-gray-400 hover:text-gray-600 p-1"
                        >
                          <span className="text-xl">⋯</span>
                        </button>
                        
                        {openDropdown === post.id && (
                          <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                            <button 
                              onClick={() => {
                                setEditPost({ id: post.id, content: post.content });
                                setOpenDropdown(null);
                              }}
                              className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center"
                            >
                              <span className="mr-2">✏️</span>
                              Edit Post
                            </button>
                            <button 
                              onClick={() => {
                                setDeleteModal({
                                  isOpen: true,
                                  postId: post.id,
                                  username: post.username
                                });
                                setOpenDropdown(null);
                              }}
                              className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center"
                            >
                              <span className="mr-2">🗑️</span>
                              Delete Post
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <p className="mb-4 text-gray-800 whitespace-pre-line break-words overflow-wrap-anywhere">
                    {post.content}
                  </p>
                  
                  {post.media_url && (
                    <div className="mb-4 overflow-hidden rounded-lg">
                      {isImage(post.media_url) && (
                        <img 
                          src={post.media_url} 
                          alt="Post media" 
                          className="w-full h-auto max-h-80 md:max-h-96 object-contain bg-gray-50"
                          loading="lazy"
                        />
                      )}
                      {isVideo(post.media_url) && (
                        <video 
                          controls 
                          className="w-full h-auto max-h-80 md:max-h-96 bg-black rounded-lg"
                        >
                          <source src={post.media_url} type={`video/${post.media_url.split('.').pop()}`} />
                          Your browser does not support videos.
                        </video>
                      )}
                    </div>
                  )}
                  
                  {/* Engagement Stats */}
                  <div className="pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center">
                          <span className="mr-1">❤️</span>
                          {post.likes} likes
                        </span>
                        <span>•</span>
                        <button 
                          onClick={() => setShowComments(post.id)}
                          className="hover:text-rose-600 hover:underline"
                        >
                          {commentCounts[post.id] || 0} comments
                        </button>
                      </div>
                    </div>
                    
                    {/* Action Buttons - Only Like and Comment */}
                    <div className="flex border-t border-gray-100 pt-3">
                      <button
                        onClick={() => handleLike(post.id)}
                        className={`flex-1 flex items-center justify-center py-2 rounded-lg transition-colors ${
                          likedPosts.has(post.id)
                            ? 'text-rose-600 bg-rose-50'
                            : 'text-gray-600 hover:text-rose-600 hover:bg-rose-50'
                        }`}
                      >
                        <span className="mr-2 text-xl">{likedPosts.has(post.id) ? '❤️' : '🤍'}</span>
                        <span className="font-medium">
                          {likedPosts.has(post.id) ? 'Liked' : 'Like'}
                        </span>
                      </button>
                      
                      <button 
                        onClick={() => setShowComments(post.id)}
                        className="flex-1 flex items-center justify-center py-2 text-gray-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      >
                        <span className="mr-2 text-xl">💬</span>
                        <span className="font-medium">Comment</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>

      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, postId: '', username: '' })}
        onConfirm={handleDelete}
        postUsername={deleteModal.username}
      />

      {showComments && (
        <Comments 
          postId={showComments} 
          onClose={() => setShowComments(null)} 
          postUsername={posts.find(p => p.id === showComments)?.username || ''}
        />
      )}
    </>
  );
}