'use client'

import { useEffect, useState } from 'react'

export default function Footer() {
  const [logoUrl, setLogoUrl] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLogo()
  }, [])

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

  const renderLogo = () => {
    if (loading) {
      return (
        <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg md:rounded-xl flex items-center justify-center animate-pulse">
          <div className="w-3 h-3 md:w-4 md:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )
    }

    if (logoUrl) {
      return (
        <img 
          src={logoUrl} 
          alt="Nyonjo Herbs Logo" 
          className="w-full h-full object-contain rounded-lg md:rounded-xl"
          onError={() => setLogoUrl('')}
        />
      )
    }

    return (
      <div className="w-full h-full bg-gradient-to-br from-rose-500 to-pink-600 rounded-lg md:rounded-xl flex items-center justify-center">
        <span className="text-base md:text-lg lg:text-xl text-white font-bold">NH</span>
      </div>
    )
  }

  return (
    <footer className="bg-gradient-to-br from-gray-900 to-rose-900 text-white">
      <div className="container mx-auto px-4 py-6 md:py-8 lg:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-2 lg:col-span-2">
            <div className="flex items-center space-x-3 md:space-x-4 mb-3 md:mb-4">
              <div className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14">
                {renderLogo()}
              </div>
              <div>
                <h2 className="text-lg md:text-xl lg:text-2xl font-bold mb-1">Nyonjo Herbs</h2>
                <p className="text-rose-200 text-xs md:text-sm">Empowering women through natural wellness</p>
              </div>
            </div>
            <p className="text-rose-100 text-xs md:text-sm max-w-2xl">
              A safe, judgment-free space where women worldwide can discover herbal wellness, 
              shop quality products, and connect in an anonymous, supportive community.
            </p>
          </div>
          
          {/* Explore Links */}
          <div>
            <h3 className="text-sm md:text-base lg:text-lg font-bold mb-2 md:mb-3 lg:mb-4">Explore</h3>
            <ul className="space-y-1 md:space-y-2">
              <li><a href="/shop" className="text-rose-200 hover:text-white transition-colors text-xs md:text-sm block py-1">Shop Herbs</a></li>
              <li><a href="/blog" className="text-rose-200 hover:text-white transition-colors text-xs md:text-sm block py-1">Wellness Blog</a></li>
              <li><a href="/sisterhood" className="text-rose-200 hover:text-white transition-colors text-xs md:text-sm block py-1">Sisterhood</a></li>
              <li><a href="/faq" className="text-rose-200 hover:text-white transition-colors text-xs md:text-sm block py-1">FAQ</a></li>
            </ul>
          </div>
          
          {/* Connect Links */}
          <div>
            <h3 className="text-sm md:text-base lg:text-lg font-bold mb-2 md:mb-3 lg:mb-4">Connect</h3>
            <ul className="space-y-1 md:space-y-2 mb-4 md:mb-6">
              <li><a href="/contact" className="text-rose-200 hover:text-white transition-colors text-xs md:text-sm block py-1">Contact Us</a></li>
              <li><a href="/privacy" className="text-rose-200 hover:text-white transition-colors text-xs md:text-sm block py-1">Privacy Policy</a></li>
              <li><a href="/terms" className="text-rose-200 hover:text-white transition-colors text-xs md:text-sm block py-1">Terms & Conditions</a></li>
            </ul>
            <div className="pt-3 md:pt-4 border-t border-rose-800">
              <p className="text-rose-300 text-xs md:text-sm">
                © 2026 Nyonjo Herbs. All rights reserved.<br />
                Created with ❤️ for women everywhere.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}