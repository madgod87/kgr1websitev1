'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface LoginForm {
  userid: string
  password: string
}

export default function LoginPage() {
  const [formData, setFormData] = useState<LoginForm>({
    userid: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      console.log('Attempting login with:', formData.userid)
      
      // Call authentication API
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        console.log('Login failed:', result.error)
        setError(result.error || 'Invalid credentials')
        return
      }

      console.log('Login successful:', result.admin)

      // Store admin data in localStorage (simple session management)
      const sessionData = {
        id: result.admin.id,
        userid: result.admin.userid,
        role: result.admin.role,
        loginTime: new Date().toISOString()
      }
      
      localStorage.setItem('admin-session', JSON.stringify(sessionData))
      console.log('Session stored, redirecting to admin')

      // Redirect to admin dashboard
      router.push('/admin')
    } catch (error) {
      console.error('Login error:', error)
      setError('Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Login</h1>
          <p className="text-gray-600">Krishnagar-I Development Block</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="userid" className="block text-sm font-medium text-gray-700 mb-2">
              User ID
            </label>
            <input
              id="userid"
              type="text"
              value={formData.userid}
              onChange={(e) => setFormData({ ...formData, userid: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Authorized personnel only
          </p>
        </div>
      </div>
    </div>
  )
}
