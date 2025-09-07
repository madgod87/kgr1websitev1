'use client'

import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface SlideshowImage {
  id: string
  filename: string
  url: string
  title: string
  description?: string
  display_order: number
  uploaded_by: string
  uploaded_at: string
  file_size: number
  is_active: boolean
}

const Hero: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [slides, setSlides] = useState<SlideshowImage[]>([])
  const [loading, setLoading] = useState(true)

  // Default fallback slides if no slideshow images are uploaded
  const defaultSlides = [
    {
      id: 'default-1',
      filename: 'default1.jpg',
      url: '/api/placeholder/800/600',
      title: 'Welcome to Krishnagar-I Development Block',
      description: 'Serving the community of Nadia District with dedication and transparency',
      display_order: 1,
      uploaded_by: 'system',
      uploaded_at: new Date().toISOString(),
      file_size: 0,
      is_active: true
    },
    {
      id: 'default-2',
      filename: 'default2.jpg',
      url: '/api/placeholder/800/600',
      title: 'Government Services',
      description: 'Access various government schemes and services online',
      display_order: 2,
      uploaded_by: 'system',
      uploaded_at: new Date().toISOString(),
      file_size: 0,
      is_active: true
    },
    {
      id: 'default-3',
      filename: 'default3.jpg',
      url: '/api/placeholder/800/600',
      title: 'Digital India Initiative',
      description: 'Empowering citizens through digital transformation',
      display_order: 3,
      uploaded_by: 'system',
      uploaded_at: new Date().toISOString(),
      file_size: 0,
      is_active: true
    }
  ]

  useEffect(() => {
    loadSlideshowImages()
  }, [])

  const loadSlideshowImages = async () => {
    try {
      const { data, error } = await supabase
        .from('slideshow_images')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true })

      if (error) {
        console.error('Error loading slideshow images:', error)
        // Use default slides if there's an error
        setSlides(defaultSlides)
      } else if (data && data.length > 0) {
        setSlides(data)
      } else {
        // Use default slides if no slideshow images are uploaded
        setSlides(defaultSlides)
      }
    } catch (error) {
      console.error('Error loading slideshow images:', error)
      setSlides(defaultSlides)
    } finally {
      setLoading(false)
    }
  }

  // Auto-slide functionality
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [slides.length])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  if (loading) {
    return (
      <section className="relative h-screen md:h-[70vh] bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p>Loading slideshow...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="relative h-screen md:h-[70vh] bg-gray-900 overflow-hidden">
      {/* Slideshow */}
      <div className="relative h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div
              className="w-full h-full bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${slide.url})`,
              }}
            />
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-200 z-10"
        aria-label="Previous slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-200 z-10"
        aria-label="Next slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Slide indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${
              index === currentSlide 
                ? 'bg-white scale-125' 
                : 'bg-white/50 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Floating Action Buttons */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-4 z-20">
        <button
          onClick={() => {
            const element = document.getElementById('services')
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-6 py-3 rounded-lg transform hover:scale-105 transition-all shadow-lg backdrop-blur-sm bg-opacity-90"
        >
          Explore Services
        </button>
        <button
          onClick={() => {
            const element = document.getElementById('contact')
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }
          }}
          className="border-2 border-white text-white hover:bg-white hover:text-blue-600 text-lg px-6 py-3 rounded-lg transform hover:scale-105 transition-all shadow-lg backdrop-blur-sm bg-black bg-opacity-20 hover:bg-opacity-100"
        >
          Contact Us
        </button>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 right-6 text-white animate-bounce">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  )
}

export default Hero
