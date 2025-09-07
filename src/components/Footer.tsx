'use client'

import React from 'react'
import Link from 'next/link'

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-r from-blue-900 via-blue-800 to-purple-800 text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Office Information */}
          <div className="col-span-1 lg:col-span-2">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">🏛️</span>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold">Krishnagar-I Development Block</h3>
                <p className="text-blue-200">Nadia District Administration Office</p>
              </div>
            </div>
            <p className="text-blue-100 mb-6 leading-relaxed">
              Serving the community of Krishnagar-I Block, Nadia District, with transparency, efficiency, and dedication. 
              We are committed to providing quality government services to all citizens.
            </p>
            
            {/* Contact Information */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center">
                  📍
                </div>
                <span className="text-blue-100">
                  Krishnagar-I Development Block Office, Nadia, West Bengal - 741101
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center">
                  📞
                </div>
                <span className="text-blue-100">9733374108</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center">
                  📧
                </div>
                <span className="text-blue-100">bdo.krishnagar1@gmail.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-bold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { name: 'Home', href: '/' },
                { name: 'Block Profile', href: '/block-profile' },
                { name: 'Services', href: '/services' },
                { name: 'Image Gallery', href: '/gallery' },
                { name: 'Notifications', href: '/notifications' },
                { name: 'Contact Us', href: '/contact' },
                { name: 'Admin', href: '/login' },
              ].map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="text-blue-200 hover:text-white transition-colors duration-200 flex items-center space-x-2"
                  >
                    <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Important Links */}
          <div>
            <h4 className="text-xl font-bold mb-6">Government Portals</h4>
            <ul className="space-y-3">
              {[
                { name: 'West Bengal Govt', href: 'https://wb.gov.in' },
                { name: 'India.gov.in', href: 'https://india.gov.in' },
                { name: 'Digital India', href: 'https://digitalindia.gov.in' },
                { name: 'MyGov', href: 'https://mygov.in' },
                { name: 'Aadhaar', href: 'https://uidai.gov.in' },
                { name: 'PM Kisan', href: 'https://pmkisan.gov.in' },
                { name: 'MGNREGA', href: 'https://nrega.nic.in' },
                { name: 'Lakshmir Bhandar', href: 'https://socialsecurity.wb.gov.in' },
              ].map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-200 hover:text-white transition-colors duration-200 flex items-center space-x-2"
                  >
                    <span className="w-2 h-2 bg-indigo-400 rounded-full"></span>
                    <span>{link.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Office Hours & Social Media */}
        <div className="mt-12 pt-8 border-t border-blue-700">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            
            {/* Office Hours */}
            <div>
              <h4 className="text-xl font-bold mb-4">Office Hours</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-blue-700/50 rounded-lg p-4">
                  <h5 className="font-semibold text-blue-100 mb-2">Monday to Friday</h5>
                  <p className="text-white">10:30 AM - 5:30 PM IST</p>
                  <p className="text-blue-200 text-xs mt-1">Except Government Holidays</p>
                </div>
                <div className="bg-blue-700/50 rounded-lg p-4">
                  <h5 className="font-semibold text-blue-100 mb-2">Saturday & Sunday</h5>
                  <p className="text-white">Closed</p>
                  <p className="text-blue-200 text-xs mt-1">Weekend Holiday</p>
                </div>
              </div>
              <p className="text-blue-200 text-xs mt-3">
                * Closed on weekends and Government Holidays
              </p>
            </div>

            {/* Social Media & Newsletter */}
            <div className="text-center lg:text-right">
              <h4 className="text-xl font-bold mb-4">Stay Connected</h4>
              
              {/* Social Media Icons */}
              <div className="flex justify-center lg:justify-end space-x-4 mb-6">
                <a
                  href="https://x.com/Krishnagarbdo1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-blue-700 hover:bg-blue-600 rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-110"
                  title="X (Twitter)"
                >
                  <span className="text-xl text-white">𝕏</span>
                </a>
              </div>
              <div className="text-blue-200 text-sm mt-2">
                X handle: <a href="https://x.com/Krishnagarbdo1" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">@Krishnagarbdo1</a>
              </div>

              {/* Newsletter Signup */}
              <div className="max-w-md mx-auto lg:mx-0 lg:ml-auto">
                <p className="text-blue-200 text-sm mb-3">
                  Subscribe for updates and notifications
                </p>
                <div className="flex">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-2 rounded-l-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                  <button className="bg-purple-500 hover:bg-purple-600 px-6 py-2 rounded-r-lg font-semibold transition-colors">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="bg-blue-900 py-6 border-t border-blue-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm">
            <div className="text-blue-200 mb-4 md:mb-0">
              <p>
                © {currentYear} Krishnagar-I Development Block, Nadia. All rights reserved.
              </p>
              <p className="text-xs mt-1">
                Developed as part of Digital India Initiative
              </p>
            </div>
            <div className="flex flex-wrap justify-center md:justify-end space-x-6 text-blue-300">
              <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link href="#" className="hover:text-white transition-colors">Accessibility</Link>
              <Link href="#" className="hover:text-white transition-colors">RTI</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
