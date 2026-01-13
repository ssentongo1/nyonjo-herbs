'use client'

import { useState, useRef } from 'react'

interface ImageUploadProps {
  onImageUploaded: (url: string) => void
  value?: string
}

export default function ImageUpload({ onImageUploaded, value }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [preview, setPreview] = useState(value || '')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const isVideoFile = (file: File) => {
    const videoTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo']
    return videoTypes.includes(file.type)
  }

  const isImageFile = (file: File) => {
    const imageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    return imageTypes.includes(file.type)
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!isImageFile(file) && !isVideoFile(file)) {
      setError('Invalid file type. Only images (JPG, PNG, WebP, GIF) and videos (MP4, WebM, MOV, AVI) are allowed.')
      return
    }

    // Validate file size (max 50MB)
    const maxSize = 50 * 1024 * 1024 // 50MB
    if (file.size > maxSize) {
      setError('File too large. Maximum size is 50MB.')
      return
    }

    // Preview
    if (isImageFile(file)) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      // For videos, show a thumbnail placeholder
      setPreview('/video-thumbnail.png') // You can create a video icon image
    }

    // Upload
    await uploadFile(file)
  }

  const uploadFile = async (file: File) => {
    setUploading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('file', file)
      
      // Add file type info
      const isVideo = isVideoFile(file)
      formData.append('type', isVideo ? 'video' : 'image')
      formData.append('bucket', 'blog-media')

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed')
      }

      onImageUploaded(data.url)
      setError('')
      
      // Update preview with actual URL
      if (isVideoFile(file)) {
        setPreview('/video-thumbnail.png') // Use actual video thumbnail or placeholder
      } else {
        setPreview(data.url)
      }
      
    } catch (err: any) {
      setError(err.message || 'Upload failed. Please try again.')
      setPreview('')
    } finally {
      setUploading(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const file = e.dataTransfer.files[0]
    if (file && (file.type.startsWith('image/') || file.type.startsWith('video/'))) {
      await uploadFile(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleClick = () => {
    if (fileInputRef.current && !uploading) {
      fileInputRef.current.click()
    }
  }

  const removeImage = () => {
    setPreview('')
    onImageUploaded('')
    setError('')
  }

  const getFileTypeIcon = () => {
    if (!preview) return '📁'
    if (preview.includes('.mp4') || preview.includes('.webm') || preview.includes('.mov') || preview.includes('.avi')) {
      return '🎬'
    }
    return '🖼️'
  }

  const getFileTypeText = () => {
    if (!preview) return 'Click to upload or drag & drop'
    if (preview.includes('.mp4') || preview.includes('.webm') || preview.includes('.mov') || preview.includes('.avi')) {
      return 'Video Uploaded'
    }
    return 'Image Uploaded'
  }

  const getFileTypeSubText = () => {
    if (!preview) return 'Images: JPG, PNG, GIF, WebP | Videos: MP4, WebM, MOV, AVI up to 50MB'
    return preview.includes('/video-thumbnail.png') ? 'Video file uploaded' : 'Click to change file'
  }

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
          uploading 
            ? 'border-rose-300 bg-rose-50 cursor-wait' 
            : preview
            ? 'border-green-300 bg-green-50'
            : 'border-gray-300 hover:border-rose-400 hover:bg-rose-50'
        }`}
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <input
          ref={fileInputRef}
          type="file"
          id="file-upload"
          accept="image/*,video/*"
          onChange={handleFileChange}
          disabled={uploading}
          className="hidden"
        />
        
        <div className="space-y-3">
          <div className="w-12 h-12 mx-auto rounded-full flex items-center justify-center">
            {uploading ? (
              <div className="w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                preview ? 'bg-green-100' : 'bg-rose-100'
              }`}>
                <span className="text-xl">
                  {preview ? (getFileTypeIcon()) : '📁'}
                </span>
              </div>
            )}
          </div>
          <div>
            <p className="font-medium text-gray-900">
              {uploading ? 'Uploading...' : getFileTypeText()}
            </p>
            <p className="text-sm text-gray-600">
              {getFileTypeSubText()}
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {preview && !uploading && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <p className="text-sm text-gray-700 font-medium">Preview:</p>
              <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                preview.includes('.mp4') || preview.includes('.webm') || preview.includes('.mov') || preview.includes('.avi')
                  ? 'bg-purple-100 text-purple-800'
                  : 'bg-green-100 text-green-800'
              }`}>
                {preview.includes('.mp4') || preview.includes('.webm') || preview.includes('.mov') || preview.includes('.avi')
                  ? '🎬 Video'
                  : '🖼️ Image'
                }
              </span>
            </div>
            <button
              type="button"
              onClick={removeImage}
              className="text-sm text-red-600 hover:text-red-800 font-medium"
            >
              Remove
            </button>
          </div>
          <div className="relative w-full max-w-xs h-64 rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
            {preview.includes('.mp4') || preview.includes('.webm') || preview.includes('.mov') || preview.includes('.avi') || preview.includes('/video-thumbnail.png') ? (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl text-purple-600">🎬</span>
                </div>
                <p className="text-purple-700 font-medium">Video File Uploaded</p>
                <p className="text-purple-600 text-sm mt-1">This post will display as a video</p>
              </div>
            ) : (
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none'
                  const parent = e.currentTarget.parentElement
                  if (parent) {
                    const fallback = document.createElement('div')
                    fallback.className = 'w-full h-full bg-rose-100 flex items-center justify-center'
                    fallback.innerHTML = '<span class="text-2xl text-rose-600">🌿</span>'
                    parent.appendChild(fallback)
                  }
                }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  )
}