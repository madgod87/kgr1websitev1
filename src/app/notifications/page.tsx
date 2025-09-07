'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

interface Notification {
  id: string
  title: string
  content: string
  created_by: string
  created_at: string
  updated_at: string
  is_active: boolean
  file_url?: string | null
  file_name?: string | null
  file_type?: string | null
  file_size?: number | null
  dynamic_url?: string | null
  url_title?: string | null
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
      const response = await fetch('/api/notifications')
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch notifications')
      }
      
      // Filter only active notifications
      const activeNotifications = result.notifications.filter((n: Notification) => n.is_active)
      setNotifications(activeNotifications)
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
    if (notification.file_url) {
      window.open(notification.file_url, '_blank')
    }
  }

  const openUrl = (notification: Notification) => {
    if (notification.dynamic_url) {
      window.open(notification.dynamic_url, '_blank')
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
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
                        <div className="text-blue-600 mb-3 leading-relaxed whitespace-pre-wrap">
                          {notification.content}
                        </div>
                        
                        {/* File attachment */}
                        {notification.file_url && notification.file_name && (
                          <div className="mb-3">
                            <button
                              onClick={() => openFile(notification)}
                              className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                notification.file_type === 'pdf'
                                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                  : notification.file_type === 'html'
                                  ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                  : 'bg-green-100 text-green-700 hover:bg-green-200'
                              }`}
                            >
                              {notification.file_type === 'pdf' && '📄'}
                              {notification.file_type === 'html' && '🌐'}
                              {(notification.file_type === 'xlsx' || notification.file_type === 'xls') && '📊'}
                              <span className="ml-2">
                                {notification.file_name}
                                {notification.file_size && (
                                  <span className="text-xs ml-1 opacity-75">
                                    ({formatFileSize(notification.file_size)})
                                  </span>
                                )}
                              </span>
                            </button>
                          </div>
                        )}
                        
                        {/* Dynamic URL */}
                        {notification.dynamic_url && notification.url_title && (
                          <div className="mb-3">
                            <button
                              onClick={() => openUrl(notification)}
                              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors"
                            >
                              {notification.url_title}
                              <span className="ml-2">→</span>
                            </button>
                          </div>
                        )}
                      </div>
                      
                      <div className="ml-4 flex-shrink-0 flex flex-col space-y-2">
                        {notification.file_url && (
                          <button
                            onClick={() => openFile(notification)}
                            className={`inline-flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                              notification.file_type === 'pdf'
                                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                : notification.file_type === 'html'
                                ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                            }`}
                          >
                            {notification.file_type === 'pdf' && '📄 View PDF'}
                            {notification.file_type === 'html' && '🌐 View HTML'}
                            {(notification.file_type === 'xlsx' || notification.file_type === 'xls') && '📊 View Excel'}
                          </button>
                        )}
                        
                        {notification.dynamic_url && (
                          <button
                            onClick={() => openUrl(notification)}
                            className="inline-flex items-center px-4 py-2 rounded-lg font-medium bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors"
                          >
                            🔗 {notification.url_title || 'External Link'}
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="mr-2">📅</span>
                        <span>{formatDate(notification.created_at)}</span>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        {notification.file_url && (
                          <div className="flex items-center">
                            <span className="mr-1">
                              {notification.file_type === 'pdf' && '📄'}
                              {notification.file_type === 'html' && '🌐'}
                              {(notification.file_type === 'xlsx' || notification.file_type === 'xls') && '📊'}
                            </span>
                            <span className="capitalize">{notification.file_type} attachment</span>
                          </div>
                        )}
                        {notification.dynamic_url && (
                          <div className="flex items-center">
                            <span className="mr-1">🔗</span>
                            <span>External link</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Visual indicator for new notifications (less than 7 days old) */}
                  {new Date().getTime() - new Date(notification.created_at).getTime() < 7 * 24 * 60 * 60 * 1000 && (
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
