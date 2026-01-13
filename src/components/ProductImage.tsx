'use client'

import { useState } from 'react'

interface ProductImageProps {
  src: string
  alt: string
  className?: string
  fallback?: React.ReactNode
}

export default function ProductImage({ 
  src, 
  alt, 
  className = '', 
  fallback 
}: ProductImageProps) {
  const [error, setError] = useState(false)

  if (!src || error) {
    return fallback ? (
      <>{fallback}</>
    ) : (
      <div className={`bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center ${className}`}>
        <span className="text-4xl">🌿</span>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
    />
  )
}