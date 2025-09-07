'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

interface Notification {
  id: number
  title: string
  description: string
  fileUrl: string
  fileType: 'pdf' | 'html' | 'none'
  createdAt: string
}

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      // Simulate API call - replace with actual API endpoint
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Sample notifications data
      const sampleNotifications: Notification[] = [
        {
          id: 1,
          title: 'New Scheme: Pradhan Mantri Awas Yojana Application Process',
          description: 'Applications are now open for the Pradhan Mantri Awas Yojana (Rural) scheme. Eligible beneficiaries can apply online or visit our office.',
          fileUrl: '/documents/pmay-guidelines.pdf',
          fileType: 'pdf',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        },
        {
          id: 2,
          title: 'Office Holiday Notice - Republic Day',
          description: 'Our office will remain closed on 26th January 2025 (Republic Day). Emergency services will be available.',
          fileUrl: '',
          fileType: 'none',
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
        },
        {
          id: 3,
          title: 'Lakshmir Bhandar Status Update Process',
          description: 'New online process for checking Lakshmir Bhandar application status. Click here to view the detailed guide.',
          fileUrl: '/documents/lakshmir-bhandar-guide.html',
          fileType: 'html',
          createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
        },
      ]
      
      setNotifications(sampleNotifications)
    } catch (err: any) {
      setError('Failed to fetch notifications')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const openFile = (notification: Notification) => {
    if (notification.fileUrl) {
      window.open(notification.fileUrl, '_blank')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
          <div className="container mx-auto px-4">
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-blue-600">Loading notifications...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-blue-800 mb-4">
              📢 Notifications
            </h1>
            <p className="text-lg text-blue-600 max-w-2xl mx-auto">
              Stay updated with the latest announcements and important information from Krishnagar-I Block
            </p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-8">
              <p>{error}</p>
            </div>
          )}

          {notifications.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📭</div>
              <h2 className="text-2xl font-semibold text-gray-600 mb-2">No Notifications Yet</h2>
              <p className="text-gray-500">Check back later for important updates and announcements.</p>
            </div>
          ) : (
            <div className="grid gap-6 max-w-4xl mx-auto">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-blue-100"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-blue-800 mb-2">
                          {notification.title}
                        </h3>
                        <p className="text-blue-600 mb-3 leading-relaxed">
                          {notification.description}
                        </p>
                      </div>
                      
                      {notification.fileType !== 'none' && (
                        <div className="ml-4 flex-shrink-0">
                          <button
                            onClick={() => openFile(notification)}
                            className={`inline-flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                              notification.fileType === 'pdf'
                                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                            }`}
                          >
                            {notification.fileType === 'pdf' ? (
                              <>
                                📄 View PDF
                              </>
                            ) : (
                              <>
                                🌐 View HTML
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="mr-2">📅</span>
                        <span>{formatDate(notification.createdAt)}</span>
                      </div>
                      
                      {notification.fileType !== 'none' && (
                        <div className="flex items-center text-sm text-gray-500">
                          <span className="mr-1">
                            {notification.fileType === 'pdf' ? '📄' : '🌐'}
                          </span>
                          <span className="capitalize">{notification.fileType} attachment</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Visual indicator for new notifications (less than 7 days old) */}
                  {new Date().getTime() - new Date(notification.createdAt).getTime() < 7 * 24 * 60 * 60 * 1000 && (
                    <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-center py-2 text-sm font-medium">
                      ✨ New
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Back to Home Button */}
          <div className="text-center mt-12">
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default NotificationsPage
