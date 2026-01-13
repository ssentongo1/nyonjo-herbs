'use client';

import { useState } from 'react';

export default function CreatePost() {
  const [username, setUsername] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('sisterhood_username') || '';
    }
    return '';
  });
  const [content, setContent] = useState('');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [usernameError, setUsernameError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setMediaFile(e.target.files[0]);
    }
  };

  const validateUsername = async (inputUsername: string) => {
    if (!inputUsername.trim()) return 'Username is required';
    
    // Check if username is too short
    if (inputUsername.length < 2) return 'Username must be at least 2 characters';
    
    // Check if username is too long
    if (inputUsername.length > 20) return 'Username must be less than 20 characters';
    
    // Check for special characters (allow only letters, numbers, underscores)
    if (!/^[a-zA-Z0-9_]+$/.test(inputUsername)) {
      return 'Username can only contain letters, numbers, and underscores';
    }
    
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate username
    const error = await validateUsername(username);
    if (error) {
      setUsernameError(error);
      return;
    }
    
    if (!content.trim()) {
      alert('Please enter post content');
      return;
    }

    setLoading(true);
    let mediaUrl = '';

    // Save username to localStorage
    localStorage.setItem('sisterhood_username', username);

    // Upload media if exists
    if (mediaFile) {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', mediaFile);
      
      try {
        const uploadRes = await fetch('/api/sisterhood/upload', {
          method: 'POST',
          body: formData,
        });
        
        if (uploadRes.ok) {
          const { url } = await uploadRes.json();
          mediaUrl = url;
        } else {
          alert('Failed to upload media. Please try again.');
        }
      } catch (error) {
        console.error('Upload failed:', error);
        alert('Upload failed. Please try again.');
      } finally {
        setUploading(false);
      }
    }

    // Create post
    try {
      const res = await fetch('/api/sisterhood/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, content, media_url: mediaUrl }),
      });
      
      if (res.ok) {
        const post = await res.json();
        // Store post ownership
        localStorage.setItem(`post_${post.id}_owner`, username);
        
        setContent('');
        setMediaFile(null);
        setUsernameError('');
        // Hide form on mobile after posting
        const form = document.getElementById('create-post-form');
        if (window.innerWidth < 1024) {
          form?.classList.add('hidden');
        }
        window.location.reload();
      } else {
        const errorData = await res.json();
        alert(`Failed to create post: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Create post failed:', error);
      alert('Failed to create post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Your Username
        </label>
        <input
          type="text"
          placeholder="Choose a unique username"
          value={username}
          onChange={async (e) => {
            setUsername(e.target.value);
            setUsernameError('');
            const error = await validateUsername(e.target.value);
            if (error) setUsernameError(error);
          }}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-transparent"
          required
        />
        {usernameError ? (
          <p className="text-red-500 text-sm mt-1">{usernameError}</p>
        ) : (
          <p className="text-gray-500 text-xs mt-1">
            This username will be unique to you in this post
          </p>
        )}
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          What's on your mind?
        </label>
        <textarea
          placeholder="Share your thoughts..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-transparent"
          rows={3}
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Add photo or video (optional)
        </label>
        <div className="flex items-center space-x-4">
          <label className="flex-1 cursor-pointer">
            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleFileChange}
              className="hidden"
              id="media-upload"
            />
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-rose-400 transition-colors">
              <span className="text-gray-500">📁 Tap to add media</span>
              <p className="text-xs text-gray-400 mt-1">Max 10MB</p>
            </div>
          </label>
          {mediaFile && (
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-rose-100 rounded-lg flex items-center justify-center relative">
                <span className="text-rose-600 text-sm truncate px-2">
                  {mediaFile.name.length > 10 
                    ? `${mediaFile.name.substring(0, 10)}...` 
                    : mediaFile.name}
                </span>
                <button
                  type="button"
                  onClick={() => setMediaFile(null)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full text-xs"
                >
                  ×
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-rose-50 rounded-lg p-4">
        <p className="text-sm text-gray-600 mb-2">⚠️ Community Guidelines:</p>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• Be respectful and kind to others</li>
          <li>• No harassment or hate speech</li>
          <li>• Posts older than 2 weeks may be deleted</li>
          <li>• Usernames are unique per post</li>
        </ul>
      </div>
      
      <div className="flex space-x-3">
        <button
          type="submit"
          disabled={loading || uploading || !!usernameError}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-lg font-semibold disabled:opacity-50 hover:from-rose-600 hover:to-pink-600 transition-all"
        >
          {uploading ? 'Uploading...' : loading ? 'Posting...' : 'Create Post'}
        </button>
        <button
          type="button"
          onClick={() => {
            setContent('');
            setMediaFile(null);
            setUsernameError('');
            const form = document.getElementById('create-post-form');
            if (window.innerWidth < 1024) {
              form?.classList.add('hidden');
            }
          }}
          className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}