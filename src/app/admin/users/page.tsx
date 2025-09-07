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
}

interface AdminUser {
  id: string
  userid: string
  role: 'main_admin' | 'sub_admin'
  created_by?: string | null
  created_at: string
  updated_at: string
  is_active: boolean
  notification_access: boolean
  photo_access: boolean
}

export default function UserManagement() {
  const router = useRouter()
  const [adminData, setAdminData] = useState<AdminSession | null>(null)
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

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
      
      // Only main admins can access user management
      if (session.role !== 'main_admin') {
        router.push('/admin')
        return
      }
      
      setAdminData(session)
      loadUsers()
    } catch (error) {
      console.error('Session error:', error)
      router.push('/login')
    }
  }, [router])

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('admins')
        .select('id, userid, role, created_by, created_at, updated_at, is_active, notification_access, photo_access')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading users:', error)
        setError('Failed to load users')
        return
      }

      setUsers(data || [])
    } catch (error) {
      console.error('Error loading users:', error)
      setError('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    console.log('Toggling user status:', userId, 'from', currentStatus, 'to', !currentStatus)
    setError('')
    setSuccess('')
    
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userid: users.find(u => u.id === userId)?.userid || '',
          role: users.find(u => u.id === userId)?.role || 'sub_admin',
          notification_access: users.find(u => u.id === userId)?.notification_access || false,
          photo_access: users.find(u => u.id === userId)?.photo_access || false,
          is_active: !currentStatus
        })
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        setError(result.error || 'Failed to update user status')
        return
      }

      setSuccess('User status updated successfully')
      loadUsers() // Refresh the list
    } catch (error) {
      console.error('Error toggling user status:', error)
      setError('Failed to update user status')
    }
  }

  const deleteUser = async (userId: string, userRole: string) => {
    if (userRole === 'main_admin') {
      setError('Cannot delete main admin user')
      return
    }

    const confirmed = confirm('Are you sure you want to delete this user? This action cannot be undone.')
    if (!confirmed) return

    setError('')
    setSuccess('')

    try {
      console.log('Deleting user:', userId)
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE'
      })

      console.log('Delete response status:', response.status)
      const result = await response.json()
      console.log('Delete result:', result)

      if (!response.ok || !result.success) {
        setError(result.error || 'Failed to delete user')
        return
      }

      setSuccess('User deleted successfully')
      loadUsers() // Refresh the list
    } catch (error) {
      console.error('Error deleting user:', error)
      setError('Failed to delete user')
    }
  }

  const updateUserPermissions = async (userId: string, permissions: { notification_access: boolean, photo_access: boolean }) => {
    setError('')
    setSuccess('')
    
    try {
      const user = users.find(u => u.id === userId)
      if (!user) {
        setError('User not found')
        return
      }

      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userid: user.userid,
          role: user.role,
          notification_access: permissions.notification_access,
          photo_access: permissions.photo_access,
          is_active: user.is_active
        })
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        setError(result.error || 'Failed to update permissions')
        return
      }

      setSuccess('Permissions updated successfully')
      loadUsers() // Refresh the list
    } catch (error) {
      console.error('Error updating permissions:', error)
      setError('Failed to update permissions')
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
              <Link href="/admin" className="text-green-600 hover:text-green-700">
                <span className="text-xl">←</span>
              </Link>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">User Management</h1>
                <p className="text-sm text-gray-500">Manage admin users and permissions</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/admin/users/create"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm transition-colors"
              >
                Create New User
              </Link>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{adminData.userid}</p>
                <p className="text-xs text-gray-500">Main Admin</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                </div>
                <div className="p-3 rounded-lg bg-green-500 text-green-100">
                  <span className="text-2xl">👥</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Active Users</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {users.filter(u => u.is_active).length}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-blue-500 text-blue-100">
                  <span className="text-2xl">✅</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Main Admins</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {users.filter(u => u.role === 'main_admin').length}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-purple-500 text-purple-100">
                  <span className="text-2xl">👑</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Sub Admins</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {users.filter(u => u.role === 'sub_admin').length}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-orange-500 text-orange-100">
                  <span className="text-2xl">👤</span>
                </div>
              </div>
            </div>
          </div>

          {/* Alerts */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-600">{success}</p>
            </div>
          )}

          {/* Users List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">All Users</h3>
            </div>
            
            <div className="divide-y divide-gray-200">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading users...</p>
                </div>
              ) : users.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-gray-500">No users found</p>
                  <Link
                    href="/admin/users/create"
                    className="inline-block mt-2 text-green-600 hover:text-green-700"
                  >
                    Create your first sub-admin
                  </Link>
                </div>
              ) : (
                users.map((user) => (
                  <div key={user.id} className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <h4 className="text-lg font-medium text-gray-900">
                            {user.userid}
                          </h4>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              user.role === 'main_admin'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-orange-100 text-orange-800'
                            }`}
                          >
                            {user.role.replace('_', ' ').toUpperCase()}
                          </span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              user.is_active
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {user.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        
                        {/* Permissions */}
                        <div className="flex items-center space-x-4 mb-3">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">Permissions:</span>
                            <div className="flex space-x-2">
                              <label className="flex items-center space-x-1">
                                <input
                                  type="checkbox"
                                  checked={user.notification_access}
                                  onChange={(e) => updateUserPermissions(user.id, {
                                    notification_access: e.target.checked,
                                    photo_access: user.photo_access
                                  })}
                                  disabled={user.role === 'main_admin'}
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <span className="text-sm text-gray-700">Notifications</span>
                              </label>
                              <label className="flex items-center space-x-1">
                                <input
                                  type="checkbox"
                                  checked={user.photo_access}
                                  onChange={(e) => updateUserPermissions(user.id, {
                                    notification_access: user.notification_access,
                                    photo_access: e.target.checked
                                  })}
                                  disabled={user.role === 'main_admin'}
                                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                                />
                                <span className="text-sm text-gray-700">Photos</span>
                              </label>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>Created: {new Date(user.created_at).toLocaleDateString()}</span>
                          <span>Updated: {new Date(user.updated_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        {user.role !== 'main_admin' && (
                          <>
                            <Link
                              href={`/admin/users/edit/${user.id}`}
                              className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors text-sm"
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() => toggleUserStatus(user.id, user.is_active)}
                              className={`px-3 py-1 rounded-md transition-colors text-sm ${
                                user.is_active
                                  ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                                  : 'bg-green-100 text-green-700 hover:bg-green-200'
                              }`}
                            >
                              {user.is_active ? 'Deactivate' : 'Activate'}
                            </button>
                            <button
                              onClick={() => deleteUser(user.id, user.role)}
                              className="px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors text-sm"
                            >
                              Delete
                            </button>
                          </>
                        )}
                        {user.role === 'main_admin' && (
                          <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-md text-sm">
                            System User
                          </span>
                        )}
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
