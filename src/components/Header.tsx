'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Block Profile', href: '/block-profile' },
    { name: 'Image Gallery', href: '/gallery' },
    { name: 'Services', href: '/services' },
    { name: 'Contact', href: '/contact' },
    { name: 'Admin', href: '/login' },
  ]

  return (
    <header className="bg-gradient-to-r from-blue-600 via-blue-500 to-purple-500 shadow-lg sticky top-0 z-50">
      {/* Top banner with government info */}
      <div className="bg-blue-800 text-white py-2">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center space-x-4">
            <span>📧 bdo.krishnagar1@gmail.com</span>
            <span>📞 9733374108</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>🌐 Government of West Bengal</span>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo section */}
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center">
              <span className="text-2xl">🏛️</span>
            </div>
            <div className="text-white">
              <h1 className="text-2xl md:text-3xl font-bold">
                Krishnagar-I Development Block
              </h1>
              <p className="text-blue-100 text-sm md:text-base">
                Nadia District Administration Office
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-white hover:text-purple-200 font-medium transition-colors duration-200 px-3 py-2 rounded-md hover:bg-white/10"
              >
                {item.name}
              </Link>
            ))}
            
            {/* Notification Box */}
            <Link
              href="/notifications"
              className="relative bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2 shadow-lg"
            >
              <span className="text-lg">📢</span>
              <span className="font-medium">Notifications</span>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                •
              </span>
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            className="lg:hidden text-white p-2 rounded-md hover:bg-white/10 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="lg:hidden mt-4 py-4 border-t border-white/20">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-white hover:text-purple-200 font-medium transition-colors duration-200 px-3 py-2 rounded-md hover:bg-white/10"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Mobile Notification Link */}
              <Link
                href="/notifications"
                className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-2 rounded-md transition-colors duration-200 flex items-center space-x-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <span>📢</span>
                <span className="font-medium">Notifications</span>
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}

export default Header
