'use client'

import { useEffect, useState } from 'react'

interface DashboardStats {
  totalNotifications: number
  activeNotifications: number
  totalGalleryImages: number
  totalFiles: number
  totalAdmins: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalNotifications: 0,
    activeNotifications: 0,
    totalGalleryImages: 0,
    totalFiles: 0,
    totalAdmins: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: Fetch actual stats from API
    // For now, using dummy data
    setTimeout(() => {
      setStats({
        totalNotifications: 12,
        activeNotifications: 8,
        totalGalleryImages: 25,
        totalFiles: 45,
        totalAdmins: 3
      })
      setLoading(false)
    }, 1000)
  }, [])

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

  const QuickActions = () => (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button className="flex items-center space-x-3 p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors text-left">
          <span className="text-xl">📢</span>
          <span className="text-sm font-medium text-blue-900">Create Notification</span>
        </button>
        <button className="flex items-center space-x-3 p-3 rounded-lg bg-green-50 hover:bg-green-100 transition-colors text-left">
          <span className="text-xl">📁</span>
          <span className="text-sm font-medium text-green-900">Upload File</span>
        </button>
        <button className="flex items-center space-x-3 p-3 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors text-left">
          <span className="text-xl">🖼️</span>
          <span className="text-sm font-medium text-purple-900">Add Gallery Image</span>
        </button>
        <button className="flex items-center space-x-3 p-3 rounded-lg bg-orange-50 hover:bg-orange-100 transition-colors text-left">
          <span className="text-xl">👥</span>
          <span className="text-sm font-medium text-orange-900">Manage Admins</span>
        </button>
      </div>
    </div>
  )

  return (
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

      {/* Quick Actions and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <QuickActions />
        
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
              <span className="text-lg">📢</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">New notification created</p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
              <span className="text-lg">🖼️</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">Gallery image uploaded</p>
                <p className="text-xs text-gray-500">1 day ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
              <span className="text-lg">👥</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">New sub-admin created</p>
                <p className="text-xs text-gray-500">3 days ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
