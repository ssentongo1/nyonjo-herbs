'use client'

import { useState } from 'react'
import ProductImage from './ProductImage'

interface ImageSliderProps {
  images: string[]
  productName: string
}

export default function ImageSlider({ images, productName }: ImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl md:rounded-2xl flex items-center justify-center">
        <ProductImage
          src=""
          alt={productName}
          className="w-full h-full rounded-lg"
          fallback={
            <div className="w-full h-full bg-gradient-to-br from-rose-100 to-pink-100 rounded-lg flex items-center justify-center">
              <span className="text-6xl md:text-8xl">🌿</span>
            </div>
          }
        />
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Main Image */}
      <div className="aspect-square bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl md:rounded-2xl overflow-hidden">
        <ProductImage
          src={images[currentIndex]}
          alt={`${productName} - Image ${currentIndex + 1}`}
          className="w-full h-full object-cover"
          fallback={
            <div className="w-full h-full bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center">
              <span className="text-6xl md:text-8xl">🌿</span>
            </div>
          }
        />
      </div>

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all"
            aria-label="Previous image"
          >
            <span className="text-xl text-gray-700">←</span>
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all"
            aria-label="Next image"
          >
            <span className="text-xl text-gray-700">→</span>
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {images.length > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-rose-600 w-6'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Image Counter */}
      {images.length > 1 && (
        <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
          {currentIndex + 1} / {images.length}
        </div>
      )}

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2 mt-4">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                index === currentIndex
                  ? 'border-rose-500'
                  : 'border-transparent hover:border-rose-300'
              }`}
            >
              <ProductImage
                src={image}
                alt={`${productName} thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
                fallback={
                  <div className="w-full h-full bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center">
                    <span className="text-xl">🌿</span>
                  </div>
                }
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}