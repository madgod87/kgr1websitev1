'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

interface AdminSession {
  id: string
  userid: string
  role: string
  loginTime: string
  notification_access?: boolean
}

interface Notification {
  id: string
  title: string
  content: string
  created_by: string
  created_at: string
  updated_at: string
  is_active: boolean
}

export default function NotificationManagement() {
  const router = useRouter()
  const [adminData, setAdminData] = useState<AdminSession | null>(null)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check authentication and permissions
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
      loadNotifications()
    } catch (error) {
      console.error('Session error:', error)
      router.push('/login')
    }
  }, [router])

  const loadNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading notifications:', error)
        return
      }

      setNotifications(data || [])
    } catch (error) {
      console.error('Error loading notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleNotificationStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_active: !currentStatus })
        .eq('id', id)

      if (error) {
        console.error('Error updating notification:', error)
        return
      }

      // Refresh the list
      loadNotifications()
    } catch (error) {
      console.error('Error toggling notification status:', error)
    }
  }

  const deleteNotification = async (id: string) => {
    if (!confirm('Are you sure you want to delete this notification?')) {
      return
    }

    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting notification:', error)
        return
      }

      // Refresh the list
      loadNotifications()
    } catch (error) {
      console.error('Error deleting notification:', error)
    }
  }

  if (!adminData) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
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
              <Link href="/admin" className="text-blue-600 hover:text-blue-700">
                <span className="text-xl">←</span>
              </Link>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Notification Management</h1>
                <p className="text-sm text-gray-500">Create, edit, and manage notifications</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/admin/notifications/create"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm transition-colors"
              >
                Create New
              </Link>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{adminData.userid}</p>
                <p className="text-xs text-gray-500">Admin</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Notifications</p>
                  <p className="text-2xl font-bold text-gray-900">{notifications.length}</p>
                </div>
                <div className="p-3 rounded-lg bg-blue-500 text-blue-100">
                  <span className="text-2xl">📢</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Active Notifications</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {notifications.filter(n => n.is_active).length}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-green-500 text-green-100">
                  <span className="text-2xl">✅</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Draft Notifications</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {notifications.filter(n => !n.is_active).length}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-orange-500 text-orange-100">
                  <span className="text-2xl">📝</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">All Notifications</h3>
            </div>
            
            <div className="divide-y divide-gray-200">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading notifications...</p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-gray-500">No notifications found</p>
                  <Link
                    href="/admin/notifications/create"
                    className="inline-block mt-2 text-blue-600 hover:text-blue-700"
                  >
                    Create your first notification
                  </Link>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div key={notification.id} className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="text-lg font-medium text-gray-900">
                            {notification.title}
                          </h4>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              notification.is_active
                                ? 'bg-green-100 text-green-800'
                                : 'bg-orange-100 text-orange-800'
                            }`}
                          >
                            {notification.is_active ? 'Active' : 'Draft'}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-3 line-clamp-2">
                          {notification.content}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>Created: {new Date(notification.created_at).toLocaleDateString()}</span>
                          <span>Updated: {new Date(notification.updated_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <Link
                          href={`/admin/notifications/edit/${notification.id}`}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors text-sm"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => toggleNotificationStatus(notification.id, notification.is_active)}
                          className={`px-3 py-1 rounded-md transition-colors text-sm ${
                            notification.is_active
                              ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                        >
                          {notification.is_active ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
