'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

// Note: Since this is a client component, metadata should be set in layout.tsx
// or we need to create a separate server component wrapper

interface LoginForm {
  userid: string
  password: string
  captcha: string
}

interface LoginAttempt {
  count: number
  lastAttempt: number
  timeoutUntil?: number
}

export default function LoginPage() {
  const [formData, setFormData] = useState<LoginForm>({
    userid: '',
    password: '',
    captcha: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [captchaQuestion, setCaptchaQuestion] = useState('')
  const [captchaAnswer, setCaptchaAnswer] = useState(0)
  const [failedAttempts, setFailedAttempts] = useState<LoginAttempt>({ count: 0, lastAttempt: 0 })
  const [timeoutRemaining, setTimeoutRemaining] = useState(0)
  const [showCaptcha, setShowCaptcha] = useState(false)
  const router = useRouter()

  // Generate simple math captcha
  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10) + 1
    const num2 = Math.floor(Math.random() * 10) + 1
    const operators = ['+', '-', '*']
    const operator = operators[Math.floor(Math.random() * operators.length)]
    
    let answer: number
    let question: string
    
    switch (operator) {
      case '+':
        answer = num1 + num2
        question = `${num1} + ${num2} = ?`
        break
      case '-':
        // Ensure positive result
        const larger = Math.max(num1, num2)
        const smaller = Math.min(num1, num2)
        answer = larger - smaller
        question = `${larger} - ${smaller} = ?`
        break
      case '*':
        answer = num1 * num2
        question = `${num1} × ${num2} = ?`
        break
      default:
        answer = num1 + num2
        question = `${num1} + ${num2} = ?`
    }
    
    setCaptchaQuestion(question)
    setCaptchaAnswer(answer)
  }

  // Check and manage failed attempts
  const checkFailedAttempts = () => {
    const stored = localStorage.getItem('login-attempts')
    if (stored) {
      const attempts: LoginAttempt = JSON.parse(stored)
      const now = Date.now()
      
      // Check if still in timeout
      if (attempts.timeoutUntil && now < attempts.timeoutUntil) {
        const remaining = Math.ceil((attempts.timeoutUntil - now) / 1000)
        setTimeoutRemaining(remaining)
        setShowCaptcha(true)
        generateCaptcha()
        
        // Start countdown timer
        const timer = setInterval(() => {
          const newRemaining = Math.ceil((attempts.timeoutUntil! - Date.now()) / 1000)
          if (newRemaining <= 0) {
            setTimeoutRemaining(0)
            clearInterval(timer)
            // Reset attempts after timeout
            localStorage.removeItem('login-attempts')
            setFailedAttempts({ count: 0, lastAttempt: 0 })
          } else {
            setTimeoutRemaining(newRemaining)
          }
        }, 1000)
        
        return timer
      } else {
        // Timeout expired, reset
        if (attempts.timeoutUntil && now >= attempts.timeoutUntil) {
          localStorage.removeItem('login-attempts')
          setFailedAttempts({ count: 0, lastAttempt: 0 })
        } else {
          setFailedAttempts(attempts)
          if (attempts.count >= 3) {
            setShowCaptcha(true)
            generateCaptcha()
          }
        }
      }
    } else {
      setFailedAttempts({ count: 0, lastAttempt: 0 })
    }
    return null
  }

  // Record failed attempt
  const recordFailedAttempt = () => {
    const now = Date.now()
    const newCount = failedAttempts.count + 1
    
    const newAttempts: LoginAttempt = {
      count: newCount,
      lastAttempt: now,
      timeoutUntil: newCount >= 5 ? now + (100 * 1000) : undefined
    }
    
    if (newCount >= 5) {
      // 100 second timeout after 5 failed attempts
      setTimeoutRemaining(100)
      
      // Start countdown
      const timer = setInterval(() => {
        const remaining = Math.ceil((newAttempts.timeoutUntil! - Date.now()) / 1000)
        if (remaining <= 0) {
          setTimeoutRemaining(0)
          clearInterval(timer)
          localStorage.removeItem('login-attempts')
          setFailedAttempts({ count: 0, lastAttempt: 0 })
          setShowCaptcha(false)
        } else {
          setTimeoutRemaining(remaining)
        }
      }, 1000)
    } else if (newCount >= 3) {
      setShowCaptcha(true)
      generateCaptcha()
    }
    
    setFailedAttempts(newAttempts)
    localStorage.setItem('login-attempts', JSON.stringify(newAttempts))
  }

  // Initialize on component mount
  React.useEffect(() => {
    const timer = checkFailedAttempts()
    return () => {
      if (timer) clearInterval(timer)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Check if in timeout
    if (timeoutRemaining > 0) {
      setError(`Too many failed attempts. Try again in ${timeoutRemaining} seconds.`)
      return
    }
    
    // Validate captcha if required
    if (showCaptcha) {
      const userAnswer = parseInt(formData.captcha)
      if (isNaN(userAnswer) || userAnswer !== captchaAnswer) {
        setError('Incorrect captcha answer. Please try again.')
        generateCaptcha() // Generate new captcha
        setFormData({ ...formData, captcha: '' })
        return
      }
    }
    
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
        body: JSON.stringify({
          userid: formData.userid,
          password: formData.password
        })
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        console.log('Login failed:', result.error)
        recordFailedAttempt()
        setError(result.error || 'Invalid credentials')
        
        // Reset captcha field and generate new question
        if (showCaptcha) {
          generateCaptcha()
          setFormData({ ...formData, captcha: '' })
        }
        return
      }

      console.log('Login successful:', result.admin)
      
      // Clear failed attempts on successful login
      localStorage.removeItem('login-attempts')
      setFailedAttempts({ count: 0, lastAttempt: 0 })
      setShowCaptcha(false)
      setTimeoutRemaining(0)

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
              disabled={isLoading || timeoutRemaining > 0}
            />
          </div>

          {/* Security Info */}
          {failedAttempts.count > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-700">
                ⚠️ {failedAttempts.count} failed attempt{failedAttempts.count > 1 ? 's' : ''}. 
                {failedAttempts.count >= 3 && 'Captcha required after 3 failed attempts.'}
                {failedAttempts.count >= 5 && ' Account will be locked for 100 seconds after 5 failed attempts.'}
              </p>
            </div>
          )}

          {/* Timeout Display */}
          {timeoutRemaining > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-red-400 text-xl">🔒</span>
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-red-800">Account Temporarily Locked</h4>
                  <p className="text-sm text-red-700 mt-1">
                    Too many failed login attempts. Please wait {Math.floor(timeoutRemaining / 60)}:{(timeoutRemaining % 60).toString().padStart(2, '0')} before trying again.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Captcha */}
          {showCaptcha && timeoutRemaining === 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <label htmlFor="captcha" className="block text-sm font-medium text-blue-800 mb-2">
                Security Verification
              </label>
              <p className="text-blue-700 mb-3 font-medium text-lg">
                {captchaQuestion}
              </p>
              <input
                id="captcha"
                type="number"
                value={formData.captcha}
                onChange={(e) => setFormData({ ...formData, captcha: e.target.value })}
                className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your answer"
                required={showCaptcha}
                disabled={isLoading}
              />
              <p className="text-xs text-blue-600 mt-1">
                Please solve the math problem above to continue
              </p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || timeoutRemaining > 0}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading 
              ? 'Signing in...' 
              : timeoutRemaining > 0 
              ? `Locked (${Math.floor(timeoutRemaining / 60)}:${(timeoutRemaining % 60).toString().padStart(2, '0')})` 
              : 'Sign In'
            }
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
