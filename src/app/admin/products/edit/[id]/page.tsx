'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import ImageUpload from '@/components/admin/ImageUpload'

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    name: '',
    short_description: '',
    description: '',
    price: '',
    category: '',
    benefits: '',
    usage_instructions: '',
    in_stock: 'true',
    featured: 'false',
    images: ['', '', ''] // Up to 3 images
  })

  useEffect(() => {
    if (id) {
      fetchProduct()
    }
  }, [id])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/products/${id}`)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch product')
      }

      const product = data.product
      
      if (product) {
        setFormData({
          name: product.name || '',
          short_description: product.short_description || '',
          description: product.description || '',
          price: product.price?.toString() || '0',
          category: product.category || '',
          benefits: Array.isArray(product.benefits) ? product.benefits.join('\n') : product.benefits || '',
          usage_instructions: product.usage_instructions || '',
          in_stock: product.in_stock ? 'true' : 'false',
          featured: product.featured ? 'true' : 'false',
          images: product.images ? [...product.images, '', '', ''].slice(0, 3) : ['', '', '']
        })
      }
    } catch (err: any) {
      console.error('Error fetching product:', err)
      setError('Failed to load product: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      // Filter out empty images
      const images = formData.images.filter(img => img.trim() !== '')
      
      const productData = {
        name: formData.name,
        short_description: formData.short_description,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        benefits: formData.benefits.split('\n').filter((b: string) => b.trim()),
        usage_instructions: formData.usage_instructions,
        in_stock: formData.in_stock === 'true',
        featured: formData.featured === 'true',
        images: images
      }

      console.log('Sending update:', productData)

      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update product')
      }

      alert('Product updated successfully!')
      router.push('/admin/products')
      router.refresh()
    } catch (err: any) {
      console.error('Update error:', err)
      setError(err.message || 'Failed to update product')
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...formData.images]
    newImages[index] = value
    setFormData(prev => ({ ...prev, images: newImages }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <a href="/admin/dashboard" className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-r from-rose-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold">NH</span>
                </div>
                <span className="text-xl font-bold text-gray-900">
                  Edit Product
                </span>
              </a>
            </div>
            
            <a href="/admin/products" className="text-gray-600 hover:text-gray-900">
              ← Back to Products
            </a>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow border border-gray-200 p-6 md:p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Product</h1>
              <p className="text-gray-600">Update the details for your herbal product</p>
            </div>

            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200">
                  Basic Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 font-semibold mb-2" htmlFor="name">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-transparent"
                      placeholder="e.g., Chamomile Relaxation Tea"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2" htmlFor="price">
                      Price ($) *
                    </label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-transparent"
                      placeholder="12.99"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2" htmlFor="category">
                      Category *
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-transparent"
                      required
                    >
                      <option value="">Select a category</option>
                      <option value="Tea">Tea</option>
                      <option value="Powder">Powder</option>
                      <option value="Women's Wellness">Women's Wellness</option>
                      <option value="Aromatherapy">Aromatherapy</option>
                      <option value="Tincture">Tincture</option>
                      <option value="Capsules">Capsules</option>
                      <option value="Topical">Topical</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2" htmlFor="in_stock">
                      Stock Status
                    </label>
                    <select
                      id="in_stock"
                      name="in_stock"
                      value={formData.in_stock}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-transparent"
                    >
                      <option value="true">In Stock</option>
                      <option value="false">Out of Stock</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2" htmlFor="featured">
                      Featured Product
                    </label>
                    <select
                      id="featured"
                      name="featured"
                      value={formData.featured}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-transparent"
                    >
                      <option value="false">No</option>
                      <option value="true">Yes (Show on homepage)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200">
                  Description
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2" htmlFor="short_description">
                      Short Description *
                    </label>
                    <textarea
                      id="short_description"
                      name="short_description"
                      value={formData.short_description}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-transparent"
                      placeholder="Brief description shown on product cards"
                      required
                    />
                    <p className="text-gray-500 text-sm mt-1">Keep it concise (1-2 sentences)</p>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2" htmlFor="description">
                      Full Description *
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-transparent"
                      placeholder="Detailed description shown on product page"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Benefits */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200">
                  Benefits
                </h2>
                
                <div>
                  <label className="block text-gray-700 font-semibold mb-2" htmlFor="benefits">
                    Key Benefits (One per line)
                  </label>
                  <textarea
                    id="benefits"
                    name="benefits"
                    value={formData.benefits}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-transparent"
                    placeholder="Promotes relaxation
Aids sleep
Reduces stress
Gentle on stomach"
                  />
                  <p className="text-gray-500 text-sm mt-1">Each line will become a separate benefit bullet point</p>
                </div>
              </div>

              {/* Usage Instructions */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200">
                  Usage Instructions
                </h2>
                
                <div>
                  <label className="block text-gray-700 font-semibold mb-2" htmlFor="usage_instructions">
                    How to Use
                  </label>
                  <textarea
                    id="usage_instructions"
                    name="usage_instructions"
                    value={formData.usage_instructions}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-transparent"
                    placeholder="Steep 1-2 teaspoons in hot water for 5-7 minutes. Best consumed before bedtime."
                  />
                </div>
              </div>

              {/* Images */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200">
                  Product Images (Upload Only)
                </h2>
                
                <div className="space-y-6">
                  <p className="text-gray-600">
                    Upload up to 3 images. First image will be the main display image.
                  </p>
                  
                  {[0, 1, 2].map((index) => (
                    <div key={index} className="space-y-3">
                      <label className="block text-gray-700 font-semibold">
                        Image {index + 1} {index === 0 && '(Main Image)*'}
                      </label>
                      
                      <ImageUpload
                        onImageUploaded={(url) => handleImageChange(index, url)}
                        value={formData.images[index]}
                      />
                      
                      {formData.images[index] && (
                        <div className="mt-2">
                          <div className="text-sm text-gray-500 mb-2">Preview:</div>
                          <div className="w-32 h-32 bg-gray-100 rounded-lg overflow-hidden border border-gray-300">
                            <img
                              src={formData.images[index]}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none'
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  <div className="bg-rose-50 border border-rose-200 rounded-lg p-4">
                    <h4 className="font-semibold text-rose-800 mb-2">Image Tips:</h4>
                    <ul className="text-sm text-rose-700 space-y-1">
                      <li>• Upload images directly from your device</li>
                      <li>• First image is used as the main product image</li>
                      <li>• Use high-quality images (minimum 800x800 pixels)</li>
                      <li>• Supported formats: JPG, PNG, WebP, GIF</li>
                      <li>• Maximum file size: 5MB per image</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="pt-8 border-t border-gray-200">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <p className="text-gray-600 text-sm">
                      Fields marked with * are required
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <button
                      type="button"
                      onClick={() => router.push('/admin/products')}
                      className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                    
                    <button
                      type="submit"
                      disabled={saving}
                      className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-8 py-3 rounded-lg hover:from-rose-600 hover:to-pink-600 transition-all font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saving ? 'Updating Product...' : 'Update Product'}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}