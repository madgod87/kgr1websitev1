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

interface DashboardStats {
  totalNotifications: number
  activeNotifications: number
  totalGalleryImages: number
  totalFiles: number
  totalAdmins: number
}

export default function AdminDashboard() {
  const router = useRouter()
  const [adminData, setAdminData] = useState<AdminSession | null>(null)
  const [stats, setStats] = useState<DashboardStats>({
    totalNotifications: 0,
    activeNotifications: 0,
    totalGalleryImages: 0,
    totalFiles: 0,
    totalAdmins: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log('Admin page loaded, checking session...')
    
    // Check for stored session
    const sessionData = localStorage.getItem('admin-session')
    
    if (!sessionData) {
      console.log('No session found, redirecting to login')
      router.push('/login')
      return
    }

    try {
      const session = JSON.parse(sessionData) as AdminSession
      console.log('Session found:', session.userid, session.role)
      
      // Check if session is still valid (24 hours)
      const loginTime = new Date(session.loginTime)
      const now = new Date()
      const timeDiff = now.getTime() - loginTime.getTime()
      const hoursDiff = timeDiff / (1000 * 3600)
      
      if (hoursDiff > 24) {
        console.log('Session expired, redirecting to login')
        localStorage.removeItem('admin-session')
        router.push('/login')
        return
      }
      
      setAdminData(session)
      
      // Load dashboard stats (mock data for now)
      setTimeout(() => {
        setStats({
          totalNotifications: 12,
          activeNotifications: 8,
          totalGalleryImages: 25,
          totalFiles: 45,
          totalAdmins: 3
        })
        setLoading(false)
      }, 500)
    } catch (error) {
      console.error('Session parse error:', error)
      localStorage.removeItem('admin-session')
      router.push('/login')
    }
  }, [router])

  const handleLogout = () => {
    console.log('Logging out')
    localStorage.removeItem('admin-session')
    router.push('/login')
  }

  const StatCard = ({ 
    title, 
    value, 
    icon, 
    color = 'blue' 
  }: { 
    title: string
    value: number
    icon: string
    color?: string
  }) => {
    const colorClasses = {
      blue: 'bg-blue-500 text-blue-100',
      green: 'bg-green-500 text-green-100',
      purple: 'bg-purple-500 text-purple-100',
      orange: 'bg-orange-500 text-orange-100',
      red: 'bg-red-500 text-red-100'
    }

    return (
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">{title}</p>
            <p className="text-2xl font-bold text-gray-900">
              {loading ? '...' : value}
            </p>
          </div>
          <div className={`p-3 rounded-lg ${colorClasses[color as keyof typeof colorClasses]}`}>
            <span className="text-2xl">{icon}</span>
          </div>
        </div>
      </div>
    )
  }

  if (!adminData) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-blue-600 hover:text-blue-700">
                <span className="text-2xl">🏛️</span>
              </Link>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-500">Krishnagar-I Development Block</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{adminData.userid}</p>
                <p className="text-xs text-gray-500 capitalize">{adminData.role.replace('_', ' ')}</p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Overview of your website management system
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <StatCard
              title="Total Notifications"
              value={stats.totalNotifications}
              icon="📢"
              color="blue"
            />
            <StatCard
              title="Active Notifications"
              value={stats.activeNotifications}
              icon="✅"
              color="green"
            />
            <StatCard
              title="Gallery Images"
              value={stats.totalGalleryImages}
              icon="🖼️"
              color="purple"
            />
            <StatCard
              title="Total Files"
              value={stats.totalFiles}
              icon="📁"
              color="orange"
            />
            <StatCard
              title="Admin Users"
              value={stats.totalAdmins}
              icon="👥"
              color="red"
            />
          </div>

          {/* Management Options */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Management Options</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link href="/admin/notifications" className="flex flex-col items-center space-y-3 p-6 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors text-center group">
                <div className="p-4 rounded-full bg-blue-500 text-blue-100 group-hover:bg-blue-600 transition-colors">
                  <span className="text-3xl">📢</span>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-900">Notification Management</h4>
                  <p className="text-sm text-blue-700 mt-1">Create, edit & manage notifications</p>
                </div>
              </Link>
              
              <Link href="/admin/photos" className="flex flex-col items-center space-y-3 p-6 rounded-xl bg-purple-50 hover:bg-purple-100 transition-colors text-center group">
                <div className="p-4 rounded-full bg-purple-500 text-purple-100 group-hover:bg-purple-600 transition-colors">
                  <span className="text-3xl">🖼️</span>
                </div>
                <div>
                  <h4 className="font-semibold text-purple-900">Photo Management</h4>
                  <p className="text-sm text-purple-700 mt-1">Upload & manage gallery photos</p>
                </div>
              </Link>
              
              <Link href="/admin/users" className="flex flex-col items-center space-y-3 p-6 rounded-xl bg-green-50 hover:bg-green-100 transition-colors text-center group">
                <div className="p-4 rounded-full bg-green-500 text-green-100 group-hover:bg-green-600 transition-colors">
                  <span className="text-3xl">👥</span>
                </div>
                <div>
                  <h4 className="font-semibold text-green-900">User Management</h4>
                  <p className="text-sm text-green-700 mt-1">Manage admin users & permissions</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/" className="flex items-center space-x-2 p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors">
                <span className="text-xl">🏠</span>
                <span className="text-sm font-medium text-blue-900">Main Website</span>
              </Link>
              <Link href="/notifications" className="flex items-center space-x-2 p-3 rounded-lg bg-green-50 hover:bg-green-100 transition-colors">
                <span className="text-xl">📢</span>
                <span className="text-sm font-medium text-green-900">Notifications</span>
              </Link>
              <Link href="/gallery" className="flex items-center space-x-2 p-3 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors">
                <span className="text-xl">🖼️</span>
                <span className="text-sm font-medium text-purple-900">Gallery</span>
              </Link>
              <Link href="/block-profile" className="flex items-center space-x-2 p-3 rounded-lg bg-orange-50 hover:bg-orange-100 transition-colors">
                <span className="text-xl">🏛️</span>
                <span className="text-sm font-medium text-orange-900">Block Profile</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
