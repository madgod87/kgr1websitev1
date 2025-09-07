'use client'

import React, { useState, useEffect } from 'react'

const Hero: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0)

  // Slideshow content - using placeholder images for now
  const slides = [
    {
      id: 1,
      image: '/slideshow/slide1.jpg',
      title: 'Welcome to Krishnagar-I Development Block',
      description: 'Serving the community of Nadia District with dedication and transparency',
    },
    {
      id: 2,
      image: '/slideshow/slide2.jpg',
      title: 'Government Services',
      description: 'Access various government schemes and services online',
    },
    {
      id: 3,
      image: '/slideshow/slide3.jpg',
      title: 'Digital India Initiative',
      description: 'Empowering citizens through digital transformation',
    },
    {
      id: 4,
      image: '/slideshow/slide4.jpg',
      title: 'Community Support',
      description: 'We are here to help you with all government services and procedures',
    },
    {
      id: 5,
      image: '/slideshow/slide5.jpg',
      title: 'Transparency & Efficiency',
      description: 'Committed to providing quality government services to all citizens',
    },
    {
      id: 6,
      image: '/slideshow/slide6.jpg',
      title: 'Development Initiatives',
      description: 'Driving progress and development in Nadia District',
    },
  ]

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
                backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${slide.image})`,
              }}
            />
            {/* Content overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white px-4 max-w-4xl">
                <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
                  {slide.title}
                </h1>
                <p className="text-xl md:text-2xl mb-8 text-gray-200">
                  {slide.description}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-3 rounded-lg transform hover:scale-105 transition-transform">
                    Explore Services
                  </button>
                  <button className="border-2 border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-3 rounded-lg transform hover:scale-105 transition-all">
                    Contact Us
                  </button>
                </div>
              </div>
            </div>
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
