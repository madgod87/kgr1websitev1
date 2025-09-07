'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

interface AdminSession {
  id: string
  userid: string
  role: string
  loginTime: string
}

interface GalleryImage {
  id: string
  filename: string
  url: string
  alt_text?: string
  category?: string
  uploaded_by: string
  uploaded_at: string
  file_size: number
}

interface SlideshowImage {
  id: string
  filename: string
  url: string
  title: string
  description?: string
  display_order: number
  uploaded_by: string
  uploaded_at: string
  file_size: number
  is_active: boolean
}

export default function PhotoManagement() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [adminData, setAdminData] = useState<AdminSession | null>(null)
  const [images, setImages] = useState<GalleryImage[]>([])
  const [slideshowImages, setSlideshowImages] = useState<SlideshowImage[]>([])
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set())
  const [selectedSlideImages, setSelectedSlideImages] = useState<Set<string>>(new Set())
  const [activeTab, setActiveTab] = useState<'gallery' | 'slideshow'>('gallery')
  const [selectedCategory, setSelectedCategory] = useState('general')
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
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
      
      setAdminData(session)
      loadImages()
      loadSlideshowImages()
    } catch (error) {
      console.error('Session error:', error)
      router.push('/login')
    }
  }, [router])

  const categories = [
    { value: 'general', label: 'General' },
    { value: 'overview', label: 'Overview' },
    { value: 'services', label: 'Services' },
    { value: 'digital', label: 'Digital India' },
    { value: 'community', label: 'Community' },
    { value: 'governance', label: 'Governance' },
    { value: 'development', label: 'Development' },
    { value: 'infrastructure', label: 'Infrastructure' },
    { value: 'welfare', label: 'Welfare' },
    { value: 'education', label: 'Education' },
    { value: 'environment', label: 'Environment' }
  ]

  const loadImages = async () => {
    try {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .order('uploaded_at', { ascending: false })

      if (error) {
        console.error('Error loading images:', error)
        setError('Failed to load images')
        return
      }

      setImages(data || [])
    } catch (error) {
      console.error('Error loading images:', error)
      setError('Failed to load images')
    }
  }

  const loadSlideshowImages = async () => {
    try {
      const { data, error } = await supabase
        .from('slideshow_images')
        .select('*')
        .order('display_order', { ascending: true })

      if (error) {
        console.error('Error loading slideshow images:', error)
        return
      }

      setSlideshowImages(data || [])
    } catch (error) {
      console.error('Error loading slideshow images:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = () => {
    fileInputRef.current?.click()
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    setError('')
    setSuccess('')

    try {
      const uploadPromises = Array.from(files).map(async (file, index) => {
        // Create FormData for server-side upload
        const formData = new FormData()
        formData.append('file', file)
        formData.append('adminId', adminData!.id)
        formData.append('type', activeTab)
        formData.append('category', selectedCategory)
        
        // For slideshow uploads, add title and display order
        if (activeTab === 'slideshow') {
          formData.append('title', file.name.split('.')[0])
          formData.append('displayOrder', (slideshowImages.length + index + 1).toString())
        }

        // Upload via server-side API (bypasses RLS)
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        })

        const result = await response.json()

        if (!response.ok || !result.success) {
          throw new Error(`Failed to upload ${file.name}: ${result.error || 'Unknown error'}`)
        }

        return file.name
      })

      const results = await Promise.all(uploadPromises)
      setSuccess(`Successfully uploaded ${results.length} image(s) to ${activeTab}`)
      
      if (activeTab === 'gallery') {
        loadImages()
      } else {
        loadSlideshowImages()
      }
      
      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (error) {
      console.error('Upload error:', error)
      setError(error instanceof Error ? error.message : 'Failed to upload images')
    } finally {
      setUploading(false)
    }
  }

  const handleSelectImage = (imageId: string) => {
    const newSelected = new Set(selectedImages)
    if (newSelected.has(imageId)) {
      newSelected.delete(imageId)
    } else {
      newSelected.add(imageId)
    }
    setSelectedImages(newSelected)
  }

  const handleSelectSlideImage = (imageId: string) => {
    const newSelected = new Set(selectedSlideImages)
    if (newSelected.has(imageId)) {
      newSelected.delete(imageId)
    } else {
      newSelected.add(imageId)
    }
    setSelectedSlideImages(newSelected)
  }

  const handleSelectAll = () => {
    if (activeTab === 'gallery') {
      if (selectedImages.size === images.length) {
        setSelectedImages(new Set())
      } else {
        setSelectedImages(new Set(images.map(img => img.id)))
      }
    } else {
      if (selectedSlideImages.size === slideshowImages.length) {
        setSelectedSlideImages(new Set())
      } else {
        setSelectedSlideImages(new Set(slideshowImages.map(img => img.id)))
      }
    }
  }

  const handleDeleteSelected = async () => {
    if (activeTab === 'gallery' && selectedImages.size === 0) return
    if (activeTab === 'slideshow' && selectedSlideImages.size === 0) return

    const selectedCount = activeTab === 'gallery' ? selectedImages.size : selectedSlideImages.size
    const confirmed = confirm(`Are you sure you want to delete ${selectedCount} selected ${activeTab} image(s)?`)
    if (!confirmed) return

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      if (activeTab === 'gallery') {
        const imagesToDelete = images.filter(img => selectedImages.has(img.id))
        
        // Delete from storage
        const filenames = imagesToDelete.map(img => img.filename)
        const { error: storageError } = await supabase.storage
          .from('gallery-images')
          .remove(filenames)

        if (storageError) {
          console.error('Storage deletion error:', storageError)
        }

        // Delete from database
        const { error: dbError } = await supabase
          .from('gallery_images')
          .delete()
          .in('id', Array.from(selectedImages))

        if (dbError) {
          throw new Error(`Failed to delete images: ${dbError.message}`)
        }

        setSuccess(`Successfully deleted ${selectedImages.size} gallery image(s)`)
        setSelectedImages(new Set())
        loadImages()
      } else {
        const imagesToDelete = slideshowImages.filter(img => selectedSlideImages.has(img.id))
        
        // Delete from storage
        const filenames = imagesToDelete.map(img => img.filename)
        const { error: storageError } = await supabase.storage
          .from('slideshow-images')
          .remove(filenames)

        if (storageError) {
          console.error('Storage deletion error:', storageError)
        }

        // Delete from database
        const { error: dbError } = await supabase
          .from('slideshow_images')
          .delete()
          .in('id', Array.from(selectedSlideImages))

        if (dbError) {
          throw new Error(`Failed to delete slideshow images: ${dbError.message}`)
        }

        setSuccess(`Successfully deleted ${selectedSlideImages.size} slideshow image(s)`)
        setSelectedSlideImages(new Set())
        loadSlideshowImages()
      }
    } catch (error) {
      console.error('Delete error:', error)
      setError(error instanceof Error ? error.message : 'Failed to delete images')
    } finally {
      setLoading(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  if (!adminData) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
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
              <Link href="/admin" className="text-purple-600 hover:text-purple-700">
                <span className="text-xl">←</span>
              </Link>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Photo Management</h1>
                <p className="text-sm text-gray-500">Upload and manage gallery photos</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleFileSelect}
                disabled={uploading}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm transition-colors disabled:opacity-50"
              >
                {uploading ? 'Uploading...' : 'Upload Photos'}
              </button>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{adminData.userid}</p>
                <p className="text-xs text-gray-500">Admin</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab('gallery')}
                className={`flex-1 px-6 py-4 text-sm font-medium rounded-tl-xl transition-colors ${
                  activeTab === 'gallery'
                    ? 'bg-purple-50 text-purple-600 border-b-2 border-purple-600'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                📷 Gallery Images ({images.length})
              </button>
              <button
                onClick={() => setActiveTab('slideshow')}
                className={`flex-1 px-6 py-4 text-sm font-medium rounded-tr-xl transition-colors ${
                  activeTab === 'slideshow'
                    ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                🎬 Slideshow Images ({slideshowImages.length})
              </button>
            </div>
          </div>

          {/* Category Selection (for gallery) */}
          {activeTab === 'gallery' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium text-gray-700">Category:</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                >
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
                <span className="text-xs text-gray-500">
                  New uploads will be categorized as "{categories.find(c => c.value === selectedCategory)?.label}"
                </span>
              </div>
            </div>
          )}

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    {activeTab === 'gallery' ? 'Gallery Images' : 'Slideshow Images'}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {activeTab === 'gallery' ? images.length : slideshowImages.length}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${
                  activeTab === 'gallery' ? 'bg-purple-500 text-purple-100' : 'bg-blue-500 text-blue-100'
                }`}>
                  <span className="text-2xl">{activeTab === 'gallery' ? '🖼️' : '🎬'}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Selected Images</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {activeTab === 'gallery' ? selectedImages.size : selectedSlideImages.size}
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
                  <p className="text-sm text-gray-600 mb-1">Storage Used</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatFileSize(
                      activeTab === 'gallery' 
                        ? images.reduce((total, img) => total + img.file_size, 0)
                        : slideshowImages.reduce((total, img) => total + img.file_size, 0)
                    )}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-orange-500 text-orange-100">
                  <span className="text-2xl">💾</span>
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

          {/* Actions Bar */}
          {((activeTab === 'gallery' && images.length > 0) || (activeTab === 'slideshow' && slideshowImages.length > 0)) && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleSelectAll}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm"
                  >
                    {activeTab === 'gallery' 
                      ? (selectedImages.size === images.length ? 'Deselect All' : 'Select All')
                      : (selectedSlideImages.size === slideshowImages.length ? 'Deselect All' : 'Select All')
                    }
                  </button>
                  <span className="text-sm text-gray-500">
                    {activeTab === 'gallery' 
                      ? `${selectedImages.size} of ${images.length} selected`
                      : `${selectedSlideImages.size} of ${slideshowImages.length} selected`
                    }
                  </span>
                </div>
                {((activeTab === 'gallery' && selectedImages.size > 0) || (activeTab === 'slideshow' && selectedSlideImages.size > 0)) && (
                  <button
                    onClick={handleDeleteSelected}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
                  >
                    Delete Selected ({activeTab === 'gallery' ? selectedImages.size : selectedSlideImages.size})
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Images Grid */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {activeTab === 'gallery' ? 'Gallery Images' : 'Slideshow Images'}
              </h3>
              {activeTab === 'slideshow' && (
                <p className="text-sm text-gray-500 mt-1">
                  Maximum 12 images recommended for optimal performance
                </p>
              )}
            </div>
            
            <div className="p-6">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading images...</p>
                </div>
              ) : (activeTab === 'gallery' ? images.length === 0 : slideshowImages.length === 0) ? (
                <div className="text-center py-12">
                  <span className="text-6xl mb-4 block">
                    {activeTab === 'gallery' ? '📷' : '🎬'}
                  </span>
                  <p className="text-gray-500 mb-4">
                    No {activeTab} images uploaded yet
                  </p>
                  <button
                    onClick={handleFileSelect}
                    className={`inline-block px-4 py-2 text-white rounded-md transition-colors ${
                      activeTab === 'gallery' 
                        ? 'bg-purple-600 hover:bg-purple-700' 
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    Upload Your First {activeTab === 'gallery' ? 'Gallery' : 'Slideshow'} Images
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {(activeTab === 'gallery' ? images : slideshowImages).map((image) => (
                    <div key={image.id} className="relative group">
                      <div className="relative aspect-square">
                        {/* Selection checkbox */}
                        <div className="absolute top-2 left-2 z-10">
                          <input
                            type="checkbox"
                            checked={activeTab === 'gallery' ? selectedImages.has(image.id) : selectedSlideImages.has(image.id)}
                            onChange={() => activeTab === 'gallery' ? handleSelectImage(image.id) : handleSelectSlideImage(image.id)}
                            className={`h-4 w-4 focus:ring-2 border-gray-300 rounded ${
                              activeTab === 'gallery' 
                                ? 'text-purple-600 focus:ring-purple-500' 
                                : 'text-blue-600 focus:ring-blue-500'
                            }`}
                          />
                        </div>
                        
                        {/* Display order for slideshow */}
                        {activeTab === 'slideshow' && 'display_order' in image && (
                          <div className="absolute top-2 right-2 z-10">
                            <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                              #{(image as SlideshowImage).display_order}
                            </span>
                          </div>
                        )}
                        
                        {/* Image */}
                        <img
                          src={image.url}
                          alt={activeTab === 'gallery' ? (image as GalleryImage).alt_text || 'Gallery image' : (image as SlideshowImage).title}
                          className="w-full h-full object-cover rounded-lg"
                          loading="lazy"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.style.display = 'none'
                          }}
                        />
                        
                        {/* Overlay with image info */}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-end">
                          <div className="p-3 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                            <p className="font-medium truncate">
                              {activeTab === 'gallery' 
                                ? ((image as GalleryImage).alt_text || 'Untitled')
                                : (image as SlideshowImage).title
                              }
                            </p>
                            {activeTab === 'gallery' && 'category' in image && (
                              <p className="text-purple-200">
                                {categories.find(c => c.value === (image as GalleryImage).category)?.label || 'General'}
                              </p>
                            )}
                            <p>{formatFileSize(image.file_size)}</p>
                            <p>{new Date(image.uploaded_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
