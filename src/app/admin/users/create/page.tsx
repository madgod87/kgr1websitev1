'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface AdminSession {
  id: string
  userid: string
  role: string
  loginTime: string
}

interface UserForm {
  userid: string
  password: string
  confirmPassword: string
  role: 'sub_admin'
  notification_access: boolean
  photo_access: boolean
}

export default function CreateUser() {
  const router = useRouter()
  const [adminData, setAdminData] = useState<AdminSession | null>(null)
  const [formData, setFormData] = useState<UserForm>({
    userid: '',
    password: '',
    confirmPassword: '',
    role: 'sub_admin',
    notification_access: true,
    photo_access: true
  })
  const [isLoading, setIsLoading] = useState(false)
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
      
      // Only main admins can create users
      if (session.role !== 'main_admin') {
        router.push('/admin')
        return
      }
      
      setAdminData(session)
    } catch (error) {
      console.error('Session error:', error)
      router.push('/login')
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!formData.userid.trim()) {
      setError('User ID is required')
      return
    }
    
    if (formData.userid.length < 3) {
      setError('User ID must be at least 3 characters')
      return
    }
    
    if (!formData.password) {
      setError('Password is required')
      return
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    
    setIsLoading(true)
    setError('')

    try {
      // Call API to create user
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userid: formData.userid.trim(),
          password: formData.password,
          role: formData.role,
          notification_access: formData.notification_access,
          photo_access: formData.photo_access,
          created_by: adminData!.id
        })
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        setError(result.error || 'Failed to create user')
        return
      }

      // Success - redirect back to users list
      router.push('/admin/users')
    } catch (error) {
      console.error('Error creating user:', error)
      setError('Failed to create user. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!adminData) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
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
              <Link href="/admin/users" className="text-green-600 hover:text-green-700">
                <span className="text-xl">←</span>
              </Link>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Create New User</h1>
                <p className="text-sm text-gray-500">Add a new sub-admin user</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{adminData.userid}</p>
              <p className="text-xs text-gray-500">Main Admin</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div>
              <label htmlFor="userid" className="block text-sm font-medium text-gray-700 mb-2">
                User ID *
              </label>
              <input
                type="text"
                id="userid"
                value={formData.userid}
                onChange={(e) => setFormData({ ...formData, userid: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Enter unique user ID"
                required
                disabled={isLoading}
              />
              <p className="mt-1 text-sm text-gray-500">
                This will be used for login. Must be unique and at least 3 characters.
              </p>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password *
              </label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Enter secure password"
                required
                disabled={isLoading}
              />
              <p className="mt-1 text-sm text-gray-500">
                Minimum 6 characters. Use a combination of letters, numbers, and symbols.
              </p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password *
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Confirm the password"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                User Permissions
              </label>
              <div className="space-y-3">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.notification_access}
                    onChange={(e) => setFormData({ ...formData, notification_access: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    disabled={isLoading}
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-700">Notification Management</span>
                    <p className="text-xs text-gray-500">Can create, edit, and manage notifications</p>
                  </div>
                </label>
                
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.photo_access}
                    onChange={(e) => setFormData({ ...formData, photo_access: e.target.checked })}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    disabled={isLoading}
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-700">Photo Management</span>
                    <p className="text-xs text-gray-500">Can upload, delete, and manage gallery photos</p>
                  </div>
                </label>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Select the permissions this user should have. You can change these later.
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div className="flex items-center justify-between pt-4">
              <Link
                href="/admin/users"
                className="px-4 py-2 text-gray-600 hover:text-gray-700 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating User...' : 'Create User'}
              </button>
            </div>
          </form>
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <span className="text-blue-400 text-xl">💡</span>
            </div>
            <div className="ml-3">
              <h4 className="text-sm font-medium text-blue-900">User Management Tips</h4>
              <div className="mt-2 text-sm text-blue-700">
                <ul className="list-disc list-inside space-y-1">
                  <li>Sub-admins can only access features they have permissions for</li>
                  <li>You can change permissions anytime from the user management page</li>
                  <li>Users can be temporarily deactivated instead of deleted</li>
                  <li>All user activities are tracked for security purposes</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
