'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

interface AdminSession {
  id: string
  userid: string
  role: string
  loginTime: string
}

interface NotificationForm {
  title: string
  content: string
  is_active: boolean
}

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

export default function EditNotification() {
  const router = useRouter()
  const params = useParams()
  const notificationId = params.id as string
  
  const [adminData, setAdminData] = useState<AdminSession | null>(null)
  const [formData, setFormData] = useState<NotificationForm>({
    title: '',
    content: '',
    is_active: true
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    // Check authentication
    const sessionData = localStorage.getItem('admin-session')
    if (!sessionData) {
      router.push('/login')
      return
    }

    try {
      const session = JSON.parse(sessionData) as AdminSession
      
      // Check session validity
      const loginTime = new Date(session.loginTime)
      const now = new Date()
      const hoursDiff = (now.getTime() - loginTime.getTime()) / (1000 * 3600)
      
      if (hoursDiff > 24) {
        localStorage.removeItem('admin-session')
        router.push('/login')
        return
      }
      
      setAdminData(session)
      loadNotification()
    } catch (error) {
      console.error('Session error:', error)
      router.push('/login')
    }
  }, [router, notificationId])

  const loadNotification = async () => {
    try {
      // Use API route to get notifications
      const response = await fetch('/api/notifications')
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to load notifications')
      }
      
      // Find the specific notification
      const notification = result.notifications.find((n: Notification) => n.id === notificationId)
      
      if (!notification) {
        setError('Notification not found')
        return
      }

      setFormData({
        title: notification.title,
        content: notification.content,
        is_active: notification.is_active
      })
    } catch (error) {
      console.error('Error loading notification:', error)
      setError('Failed to load notification')
    } finally {
      setIsLoadingData(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim() || !formData.content.trim()) {
      setError('Please fill in all required fields')
      return
    }
    
    setIsLoading(true)
    setError('')

    try {
      // Use API route instead of direct supabase call
      const response = await fetch('/api/notifications', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: notificationId,
          title: formData.title.trim(),
          content: formData.content.trim(),
          is_active: formData.is_active
        })
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        console.error('Error updating notification:', result.error)
        setError(result.error || 'Failed to update notification. Please try again.')
        return
      }

      // Success - redirect back to notifications list
      router.push('/admin/notifications')
    } catch (error) {
      console.error('Error updating notification:', error)
      setError('Failed to update notification. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!adminData || isLoadingData) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (error && isLoadingData) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Link
            href="/admin/notifications"
            className="text-blue-600 hover:text-blue-700"
          >
            ← Back to Notifications
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/admin/notifications" className="text-blue-600 hover:text-blue-700">
                <span className="text-xl">←</span>
              </Link>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Edit Notification</h1>
                <p className="text-sm text-gray-500">Modify notification details</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{adminData.userid}</p>
              <p className="text-xs text-gray-500">Admin</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Notification Title *
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter notification title"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Notification Content *
              </label>
              <textarea
                id="content"
                rows={8}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter notification content"
                required
                disabled={isLoading}
              />
              <p className="mt-1 text-sm text-gray-500">
                You can use line breaks and basic formatting in your notification content.
              </p>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                disabled={isLoading}
              />
              <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700">
                Active (visible on website)
              </label>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div className="flex items-center justify-between pt-4">
              <Link
                href="/admin/notifications"
                className="px-4 py-2 text-gray-600 hover:text-gray-700 transition-colors"
              >
                Cancel
              </Link>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, is_active: false })}
                  disabled={isLoading}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors disabled:opacity-50"
                >
                  Save as Draft
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Updating...' : 'Update Notification'}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Preview Section */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Preview</h3>
            <p className="text-sm text-gray-500">This is how your notification will appear on the website</p>
          </div>
          <div className="p-6">
            {formData.title || formData.content ? (
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <span className="text-blue-400 text-xl">📢</span>
                  </div>
                  <div className="ml-3">
                    <h4 className="text-lg font-medium text-blue-900">
                      {formData.title || 'Notification Title'}
                    </h4>
                    <div className="mt-2 text-blue-700">
                      <p style={{ whiteSpace: 'pre-wrap' }}>
                        {formData.content || 'Notification content will appear here...'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <span className="text-4xl mb-4 block">📢</span>
                <p>Start typing to see preview...</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
