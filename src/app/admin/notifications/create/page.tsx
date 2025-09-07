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

interface NotificationForm {
  title: string
  content: string
  is_active: boolean
  dynamicUrl: string
  urlTitle: string
}

export default function CreateNotification() {
  const router = useRouter()
  const [adminData, setAdminData] = useState<AdminSession | null>(null)
  const [formData, setFormData] = useState<NotificationForm>({
    title: '',
    content: '',
    is_active: true,
    dynamicUrl: '',
    urlTitle: ''
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
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
      
      setAdminData(session)
    } catch (error) {
      console.error('Session error:', error)
      router.push('/login')
    }
  }, [router])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    if (file) {
      const allowedTypes = ['text/html', 'application/pdf', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
      const allowedExtensions = ['html', 'pdf', 'xls', 'xlsx']
      const fileExt = file.name.split('.').pop()?.toLowerCase()
      
      if (!allowedTypes.includes(file.type) || !fileExt || !allowedExtensions.includes(fileExt)) {
        setError('Only HTML, PDF, XLS, and XLSX files are allowed')
        setSelectedFile(null)
        return
      }
      
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB')
        setSelectedFile(null)
        return
      }
      
      setError('')
    }
    setSelectedFile(file)
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
      // Create FormData for file upload
      const submitData = new FormData()
      submitData.append('title', formData.title.trim())
      submitData.append('content', formData.content.trim())
      submitData.append('is_active', formData.is_active.toString())
      submitData.append('adminId', adminData!.id)
      submitData.append('dynamicUrl', formData.dynamicUrl.trim())
      submitData.append('urlTitle', formData.urlTitle.trim())
      
      if (selectedFile) {
        submitData.append('file', selectedFile)
      }

      const response = await fetch('/api/notifications', {
        method: 'POST',
        body: submitData
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        setError(result.error || 'Failed to create notification. Please try again.')
        return
      }

      // Success - redirect back to notifications list
      router.push('/admin/notifications')
    } catch (error) {
      console.error('Error creating notification:', error)
      setError('Failed to create notification. Please try again.')
    } finally {
      setIsLoading(false)
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
              <Link href="/admin/notifications" className="text-blue-600 hover:text-blue-700">
                <span className="text-xl">←</span>
              </Link>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Create New Notification</h1>
                <p className="text-sm text-gray-500">Add a new notification for the website</p>
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

            {/* File Upload Section */}
            <div>
              <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-2">
                Attach File (Optional)
              </label>
              <input
                type="file"
                id="file"
                accept=".html,.pdf,.xls,.xlsx"
                onChange={handleFileChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={isLoading}
              />
              <p className="mt-1 text-sm text-gray-500">
                Upload HTML, PDF, or Excel files (max 10MB). Files will be available for direct download.
              </p>
              {selectedFile && (
                <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-sm text-blue-700">
                    Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                </div>
              )}
            </div>

            {/* Dynamic URL Section */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">External Link (Optional)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="urlTitle" className="block text-sm font-medium text-gray-700 mb-2">
                    Link Text
                  </label>
                  <input
                    type="text"
                    id="urlTitle"
                    value={formData.urlTitle}
                    onChange={(e) => setFormData({ ...formData, urlTitle: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., 'View Full Document', 'Read More'"
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <label htmlFor="dynamicUrl" className="block text-sm font-medium text-gray-700 mb-2">
                    URL
                  </label>
                  <input
                    type="url"
                    id="dynamicUrl"
                    value={formData.dynamicUrl}
                    onChange={(e) => setFormData({ ...formData, dynamicUrl: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://example.com"
                    disabled={isLoading}
                  />
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Add an external link that users can click to view additional information.
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
                Publish immediately (make this notification active)
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
                  {isLoading ? 'Creating...' : formData.is_active ? 'Create & Publish' : 'Create'}
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
                  <div className="ml-3 flex-1">
                    <h4 className="text-lg font-medium text-blue-900">
                      {formData.title || 'Notification Title'}
                    </h4>
                    <div className="mt-2 text-blue-700">
                      <p style={{ whiteSpace: 'pre-wrap' }}>
                        {formData.content || 'Notification content will appear here...'}
                      </p>
                    </div>
                    
                    {/* Preview file attachment */}
                    {selectedFile && (
                      <div className="mt-3 flex items-center space-x-2">
                        <span className="text-blue-600">📎</span>
                        <span className="text-sm text-blue-700">
                          {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                    )}
                    
                    {/* Preview dynamic URL */}
                    {formData.dynamicUrl && formData.urlTitle && (
                      <div className="mt-3">
                        <a 
                          href="#" 
                          className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
                          onClick={(e) => e.preventDefault()}
                        >
                          {formData.urlTitle} <span className="ml-1">→</span>
                        </a>
                      </div>
                    )}
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
