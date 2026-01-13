'use client';

import { useState, useEffect, useRef } from 'react';

interface Comment {
  id: string;
  post_id: string;
  username: string;
  content: string;
  parent_id: string | null;
  likes: number;
  created_at: string;
}

interface CommentsProps {
  postId: string;
  onClose: () => void;
  postUsername?: string;
}

export default function Comments({ postId, onClose, postUsername = '' }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());
  const [visibleReplies, setVisibleReplies] = useState<Record<string, number>>({});
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());
  const [usedUsernames, setUsedUsernames] = useState<Set<string>>(new Set());
  const [usernameError, setUsernameError] = useState('');
  const commentInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    fetchComments();
    const savedUsername = localStorage.getItem('sisterhood_username') || '';
    setUsername(savedUsername);
    
    const savedLikedComments = localStorage.getItem('sisterhood-liked-comments');
    if (savedLikedComments) {
      setLikedComments(new Set(JSON.parse(savedLikedComments)));
    }
  }, [postId]);

  useEffect(() => {
    // Focus comment input when modal opens
    if (commentInputRef.current) {
      setTimeout(() => {
        commentInputRef.current?.focus();
      }, 100);
    }
  }, []);

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/sisterhood/posts/${postId}/comments`);
      const data = await res.json();
      setComments(data);
      
      // Collect all usernames used in this post's comments
      const usernames = new Set<string>();
      data.forEach((comment: Comment) => {
        usernames.add(comment.username.toLowerCase());
      });
      setUsedUsernames(usernames);
      
      // Initialize visible replies count (show 2 by default)
      const initialVisible: Record<string, number> = {};
      data.forEach((comment: Comment) => {
        const replyCount = data.filter((c: Comment) => c.parent_id === comment.id).length;
        if (replyCount > 2) {
          initialVisible[comment.id] = 2;
        }
      });
      setVisibleReplies(initialVisible);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    }
  };

  const validateUsername = (inputUsername: string) => {
    if (!inputUsername.trim()) return 'Username is required';
    
    // Check if username already used in this post
    if (usedUsernames.has(inputUsername.toLowerCase())) {
      return 'This username is already taken in this post. Please choose another.';
    }
    
    return '';
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const error = validateUsername(username);
    if (error) {
      setUsernameError(error);
      return;
    }
    
    if (!newComment.trim() || !username.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/sisterhood/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          username, 
          content: newComment,
          parent_id: null 
        }),
      });

      if (res.ok) {
        setNewComment('');
        // Save username for future use
        localStorage.setItem('sisterhood_username', username);
        fetchComments();
        // Keep focus on input
        if (commentInputRef.current) {
          commentInputRef.current.focus();
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (parentId: string, parentUsername: string) => {
    const error = validateUsername(username);
    if (error) {
      setUsernameError(error);
      return;
    }
    
    if (!replyContent.trim() || !username.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/sisterhood/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          username, 
          content: replyContent,
          parent_id: parentId 
        }),
      });

      if (res.ok) {
        setReplyContent('');
        setReplyTo(null);
        // Save username for future use
        localStorage.setItem('sisterhood_username', username);
        fetchComments();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLikeComment = async (commentId: string, isCurrentlyLiked: boolean) => {
    const action = isCurrentlyLiked ? 'unlike' : 'like';
    
    try {
      const res = await fetch(`/api/sisterhood/comments/${commentId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });

      if (res.ok) {
        const newLiked = new Set([...likedComments]);
        if (isCurrentlyLiked) {
          newLiked.delete(commentId);
        } else {
          newLiked.add(commentId);
        }
        setLikedComments(newLiked);
        localStorage.setItem('sisterhood-liked-comments', JSON.stringify([...newLiked]));
        fetchComments();
      }
    } catch (error) {
      console.error('Failed to like comment:', error);
    }
  };

  const getReplies = (commentId: string) => {
    return comments.filter(comment => comment.parent_id === commentId);
  };

  const toggleReplies = (commentId: string) => {
    setExpandedReplies(prev => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };

  const showMoreReplies = (commentId: string) => {
    setVisibleReplies(prev => ({
      ...prev,
      [commentId]: (prev[commentId] || 2) + 5
    }));
  };

  const isOriginalPoster = (commentUsername: string) => {
    return postUsername.toLowerCase() === commentUsername.toLowerCase();
  };

  const isCommentAuthor = (commentUsername: string, parentCommentUsername?: string) => {
    return commentUsername.toLowerCase() === parentCommentUsername?.toLowerCase();
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const renderComment = (comment: Comment, depth = 0, parentComment?: Comment) => {
    const replies = getReplies(comment.id);
    const isReply = depth > 0;
    const visibleCount = visibleReplies[comment.id] || 2;
    const hasMoreReplies = replies.length > visibleCount;
    const visibleRepliesList = replies.slice(0, visibleCount);
    const isExpanded = expandedReplies.has(comment.id);
    const isOP = isOriginalPoster(comment.username);
    const isSelfReply = parentComment && isCommentAuthor(comment.username, parentComment.username);
    const isCurrentlyLiked = likedComments.has(comment.id);
    const maxDepth = 3; // Limit nesting depth for mobile

    return (
      <div key={comment.id} className={`${isReply && depth < maxDepth ? 'ml-3 border-l-2 border-gray-200 pl-3' : ''}`}>
        <div className={`bg-gray-50 rounded-lg p-3 ${isReply ? 'mt-2' : 'mt-3'}`}>
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center">
              <div className="w-6 h-6 bg-gradient-to-r from-rose-400 to-pink-500 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                <span className="text-white text-xs font-bold">
                  {comment.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <div className="flex items-center flex-wrap gap-1">
                  <span className="font-medium text-sm text-gray-900">{comment.username}</span>
                  {isOP && (
                    <span className="px-1.5 py-0.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs rounded-full">
                      OP
                    </span>
                  )}
                  {isSelfReply && (
                    <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                      Author
                    </span>
                  )}
                </div>
              </div>
            </div>
            <span className="text-xs text-gray-500 whitespace-nowrap">
              {formatTime(comment.created_at)}
            </span>
          </div>
          
          <p className="text-gray-800 text-sm break-words overflow-wrap-anywhere whitespace-pre-line">
            {comment.content}
          </p>
          
          <div className="mt-3 flex items-center space-x-3">
            <button
              onClick={() => handleLikeComment(comment.id, isCurrentlyLiked)}
              className={`flex items-center space-x-1 text-xs ${
                isCurrentlyLiked 
                  ? 'text-rose-600' 
                  : 'text-gray-500 hover:text-rose-600'
              }`}
            >
              <span>{isCurrentlyLiked ? '❤️' : '🤍'}</span>
              <span>{comment.likes}</span>
            </button>
            <button
              onClick={() => {
                setReplyTo(replyTo === comment.id ? null : comment.id);
                setUsernameError('');
              }}
              className="text-xs text-gray-500 hover:text-rose-600"
            >
              Reply
            </button>
            {replies.length > 0 && (
              <button
                onClick={() => toggleReplies(comment.id)}
                className="text-xs text-gray-500 hover:text-rose-600"
              >
                {isExpanded ? 'Hide' : `${replies.length} repl${replies.length === 1 ? 'y' : 'ies'}`}
              </button>
            )}
          </div>

          {/* Reply form */}
          {replyTo === comment.id && depth < maxDepth && (
            <div className="mt-3">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-gradient-to-r from-rose-400 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">
                      {username ? username.charAt(0).toUpperCase() : '?'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value);
                        setUsernameError('');
                      }}
                      placeholder="Your username"
                      className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg"
                    />
                    {usernameError && (
                      <p className="text-red-500 text-xs mt-1">{usernameError}</p>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder={`Reply to ${comment.username}...`}
                    className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg resize-none min-h-[44px] max-h-24"
                    rows={1}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleReply(comment.id, comment.username);
                      }
                    }}
                  />
                  <button
                    onClick={() => handleReply(comment.id, comment.username)}
                    disabled={loading || !replyContent.trim()}
                    className="px-3 py-1.5 bg-rose-600 text-white text-sm rounded-lg disabled:opacity-50 disabled:cursor-not-allowed self-end h-[44px] min-w-[60px]"
                  >
                    {loading ? '...' : 'Post'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Render replies if expanded */}
        {isExpanded && depth < maxDepth && (
          <div className="mt-2">
            {visibleRepliesList.map(reply => renderComment(reply, depth + 1, comment))}
            
            {/* Show more button if there are more replies */}
            {hasMoreReplies && (
              <button
                onClick={() => showMoreReplies(comment.id)}
                className="ml-3 text-xs text-rose-600 hover:text-rose-700 mt-2 px-3 py-1 bg-rose-50 rounded-lg"
              >
                Show more replies
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  const topLevelComments = comments.filter(comment => !comment.parent_id);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-2 md:p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-3 md:p-4 border-b">
          <div>
            <h3 className="text-base md:text-lg font-bold text-gray-900">Comments</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Note: Usernames are unique per post
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
            aria-label="Close comments"
          >
            ×
          </button>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-2 md:p-4">
          {topLevelComments.length === 0 ? (
            <div className="text-center py-8 px-4 text-gray-500">
              <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-rose-500 text-xl">💬</span>
              </div>
              <p className="text-base mb-1">No comments yet</p>
              <p className="text-sm mb-4">Be the first to share your thoughts!</p>
              <div className="p-3 bg-rose-50 rounded-lg text-xs text-gray-600 text-left">
                <p className="font-medium mb-1">⚠️ Username Policy:</p>
                <ul className="space-y-1">
                  <li className="flex items-start">
                    <span className="text-rose-500 mr-1">•</span>
                    <span>First commenter claims the username</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-rose-500 mr-1">•</span>
                    <span>No duplicates allowed in same post</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-rose-500 mr-1">•</span>
                    <span>Choose a unique name to participate</span>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {topLevelComments.map(comment => renderComment(comment))}
            </div>
          )}
        </div>

        {/* New comment form - Mobile optimized */}
        <div className="border-t p-3 md:p-4 space-y-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-rose-400 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">
                {username ? username.charAt(0).toUpperCase() : '?'}
              </span>
            </div>
            <div className="flex-1">
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setUsernameError('');
                }}
                placeholder="Your unique username"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                required
              />
              {usernameError && (
                <p className="text-red-500 text-xs mt-1">{usernameError}</p>
              )}
            </div>
          </div>
          
          <div className="flex space-x-2">
            <textarea
              ref={commentInputRef}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg resize-none min-h-[44px] max-h-24"
              rows={1}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmitComment(e as any);
                }
              }}
            />
            <button
              onClick={handleSubmitComment}
              disabled={loading || !newComment.trim() || !username.trim()}
              className="px-3 md:px-4 py-2 bg-rose-600 text-white rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed self-end h-[44px] min-w-[60px]"
            >
              {loading ? '...' : 'Post'}
            </button>
          </div>
          
          <div className="text-xs text-gray-500 text-center">
            Press Enter to post • Shift+Enter for new line
          </div>
        </div>
      </div>
    </div>
  );
}