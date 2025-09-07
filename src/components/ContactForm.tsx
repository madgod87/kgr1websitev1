'use client'

import React, { useState } from 'react'

const ContactForm: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const reset = () => {
    setError('')
    setSuccess('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    reset() // Clear previous messages
    setLoading(true)
    
    try {
      // Simulate form submission - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSuccess('Message sent successfully! We will get back to you soon.')
      
      // Reset form on success
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: ''
      })
    } catch (err) {
      setError('Failed to send message. Please try again.')
      console.error('Form submission failed:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="contact" className="py-16 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Contact Us
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Have questions or need assistance? We're here to help. Send us a message 
              and we'll get back to you as soon as possible.
            </p>
            <div className="mt-8 w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            
            {/* Contact Information */}
            <div className="space-y-8">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">
                  Get in Touch
                </h3>
                
                <div className="space-y-6">
                  {/* Office Address */}
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">📍</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">Office Address</h4>
                      <p className="text-gray-600">
                        Krishnagar-I Development Block Office<br />
                        Nadia, West Bengal - 741101
                      </p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">📞</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">Mobile</h4>
                      <p className="text-gray-600">9733374108</p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">📧</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">Email</h4>
                      <p className="text-gray-600">bdo.krishnagar1@gmail.com</p>
                    </div>
                  </div>

                  {/* Office Hours */}
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">🕒</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">Office Hours</h4>
                      <p className="text-gray-600">
                        Monday - Friday: 10:30 AM - 5:30 PM IST<br />
                        Saturday & Sunday: Closed (Weekend Holiday)<br />
                        Except Government Holidays
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">
                Send Message
              </h3>

              {/* Status Messages */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 font-medium">{error}</p>
                </div>
              )}

              {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-600 font-medium">{success}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter your email address"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter your phone number"
                  />
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    placeholder="Enter your message or inquiry"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full font-semibold py-4 rounded-lg transition-all duration-200 transform hover:scale-105 ${
                    loading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white hover:shadow-lg'
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Sending...</span>
                    </div>
                  ) : (
                    'Send Message'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ContactForm
