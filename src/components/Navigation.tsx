'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [logoUrl, setLogoUrl] = useState('')
  const [loading, setLoading] = useState(true)
  const pathname = usePathname()

  useEffect(() => {
    fetchLogo()
  }, [])

  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  const fetchLogo = async () => {
    try {
      const response = await fetch('/api/admin/logo')
      const data = await response.json()
      if (response.ok) {
        setLogoUrl(data.logoUrl || '')
      }
    } catch (error) {
      console.error('Error fetching logo:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const menu = document.getElementById('mobile-menu')
      const button = document.getElementById('mobile-menu-button')
      if (isMenuOpen && menu && button && 
          !menu.contains(event.target as Node) && 
          !button.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    
    return () => {
      document.removeEventListener('click', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isMenuOpen])

  const renderLogo = () => {
    if (loading) {
      return (
        <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl md:rounded-2xl flex items-center justify-center animate-pulse">
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )
    }

    if (logoUrl) {
      return (
        <img 
          src={logoUrl} 
          alt="Nyonjo Herbs Logo" 
          className="w-full h-full object-contain rounded-xl md:rounded-2xl"
          onError={() => setLogoUrl('')}
        />
      )
    }

    return (
      <div className="w-full h-full bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl md:rounded-2xl flex items-center justify-center">
        <span className="text-lg md:text-xl text-white font-bold">NH</span>
      </div>
    )
  }

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-pink-200 shadow-sm">
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 md:space-x-3">
              {/* Logo */}
              <div className="relative w-10 h-10 md:w-12 md:h-12">
                {renderLogo()}
              </div>
              <span className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">
                Nyonjo <span className="text-rose-600">Herbs</span>
              </span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <a href="/" className="text-base font-semibold text-gray-700 hover:text-rose-600 transition-colors">Home</a>
              <a href="/shop" className="text-base font-semibold text-gray-700 hover:text-rose-600 transition-colors">Shop</a>
              <a href="/blog" className="text-base font-semibold text-gray-700 hover:text-rose-600 transition-colors">Blog</a>
              <a href="/sisterhood" className="text-base font-semibold text-gray-700 hover:text-rose-600 transition-colors">Sisterhood</a>
              <a href="/about" className="text-base font-semibold text-gray-700 hover:text-rose-600 transition-colors">About</a>
              <a href="/contact" className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-5 py-2 md:px-6 md:py-3 rounded-full hover:from-rose-600 hover:to-pink-600 transition-all font-semibold text-sm md:text-base shadow-md">
                Contact
              </a>
            </div>
            
            {/* Mobile menu button */}
            <button 
              className="lg:hidden p-2 focus:outline-none" 
              id="mobile-menu-button"
              aria-label="Menu"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <div className="space-y-1.5">
                <div className={`w-6 h-0.5 bg-rose-600 transition-transform ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></div>
                <div className={`w-6 h-0.5 bg-rose-600 ${isMenuOpen ? 'opacity-0' : ''}`}></div>
                <div className={`w-6 h-0.5 bg-rose-600 transition-transform ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></div>
              </div>
            </button>
          </div>
          
          {/* Mobile Navigation Menu */}
          <div className={`lg:hidden mt-4 transition-all duration-300 ${isMenuOpen ? 'block' : 'hidden'}`} id="mobile-menu">
            <div className="flex flex-col space-y-3 pb-4">
              <a href="/" className="text-base font-semibold text-gray-700 hover:text-rose-600 py-2 px-2 hover:bg-rose-50 rounded-lg transition-colors">Home</a>
              <a href="/shop" className="text-base font-semibold text-gray-700 hover:text-rose-600 py-2 px-2 hover:bg-rose-50 rounded-lg transition-colors">Shop</a>
              <a href="/blog" className="text-base font-semibold text-gray-700 hover:text-rose-600 py-2 px-2 hover:bg-rose-50 rounded-lg transition-colors">Blog</a>
              <a href="/sisterhood" className="text-base font-semibold text-gray-700 hover:text-rose-600 py-2 px-2 hover:bg-rose-50 rounded-lg transition-colors">Sisterhood</a>
              <a href="/about" className="text-base font-semibold text-gray-700 hover:text-rose-600 py-2 px-2 hover:bg-rose-50 rounded-lg transition-colors">About</a>
              <a href="/contact" className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-4 py-2.5 rounded-full text-center font-semibold text-base mt-2 shadow-md hover:from-rose-600 hover:to-pink-600 transition-all">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}