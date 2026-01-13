'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import ProductImage from '@/components/ProductImage'

type Product = {
  id: string
  name: string
  price: number
  category: string
  in_stock: boolean
  featured: boolean
  created_at: string
  images: string[]
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [updating, setUpdating] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/admin/products')
      const data = await response.json()
      if (response.ok) {
        setProducts(data.products)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(search.toLowerCase()) ||
    product.category.toLowerCase().includes(search.toLowerCase())
  )

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setProducts(products.filter(p => p.id !== id))
      }
    } catch (error) {
      console.error('Error deleting product:', error)
    }
  }

  const toggleFeatured = async (product: Product) => {
    setUpdating(product.id)
    
    try {
      const response = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          featured: !product.featured
        }),
      })

      if (response.ok) {
        // Update local state
        setProducts(products.map(p => 
          p.id === product.id ? { ...p, featured: !p.featured } : p
        ))
        
        // If featuring this product and we already have 2 featured products, 
        // unfeature the oldest one (limit to 2 featured products for homepage)
        if (!product.featured) {
          const featuredCount = products.filter(p => p.featured).length
          if (featuredCount >= 2) {
            const oldestFeatured = products
              .filter(p => p.featured && p.id !== product.id)
              .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())[0]
            
            if (oldestFeatured) {
              await fetch(`/api/admin/products/${oldestFeatured.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ featured: false }),
              })
              
              // Update local state for the unfeatured product
              setProducts(products.map(p => 
                p.id === oldestFeatured.id ? { ...p, featured: false } : p
              ))
            }
          }
        }
      }
    } catch (error) {
      console.error('Error updating featured status:', error)
      alert('Failed to update featured status')
    } finally {
      setUpdating(null)
    }
  }

  const featuredProducts = products.filter(p => p.featured)
  const canFeatureMore = featuredProducts.length < 2

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link href="/admin/dashboard" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-rose-500 to-pink-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">NH</span>
                </div>
                <span className="text-lg font-bold text-gray-900">
                  Products
                </span>
              </Link>
            </div>
            
            <Link href="/admin/dashboard" className="text-gray-600 hover:text-gray-900 text-sm">
              ← Dashboard
            </Link>
          </div>
        </div>
      </header>

      <div className="p-4">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-white rounded-lg shadow border border-gray-200 p-3">
            <p className="text-gray-600 text-xs">Total Products</p>
            <p className="text-xl font-bold text-gray-900">{products.length}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow border border-gray-200 p-3">
            <p className="text-gray-600 text-xs">In Stock</p>
            <p className="text-xl font-bold text-green-600">{products.filter(p => p.in_stock).length}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow border border-gray-200 p-3">
            <p className="text-gray-600 text-xs">Out of Stock</p>
            <p className="text-xl font-bold text-red-600">{products.filter(p => !p.in_stock).length}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow border border-gray-200 p-3">
            <p className="text-gray-600 text-xs">Featured</p>
            <p className="text-xl font-bold text-rose-600">{featuredProducts.length}/2</p>
          </div>
        </div>

        {/* Search and Controls */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-4 mb-6">
          <div className="space-y-4">
            <div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-transparent text-sm"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <span className="text-gray-400 text-sm">🔍</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex space-x-2">
                <button 
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium ${viewMode === 'list' ? 'bg-rose-100 text-rose-700' : 'bg-gray-100 text-gray-700'}`}
                >
                  List
                </button>
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium ${viewMode === 'grid' ? 'bg-rose-100 text-rose-700' : 'bg-gray-100 text-gray-700'}`}
                >
                  Grid
                </button>
              </div>
              
              <div className="flex space-x-2">
                <Link
                  href="/admin/products/new"
                  className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:from-rose-600 hover:to-pink-600 transition-all font-semibold text-sm"
                >
                  + New Product
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Products Display */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-lg shadow border border-gray-200 p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl text-gray-400">🌿</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-6 text-sm">
              {search ? 'Try a different search term' : 'Get started by adding your first product'}
            </p>
            <Link
              href="/admin/products/new"
              className="inline-flex items-center bg-gradient-to-r from-rose-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:from-rose-600 hover:to-pink-600 transition-all font-semibold text-sm"
            >
              + Add Your First Product
            </Link>
          </div>
        ) : viewMode === 'list' ? (
          /* List View */
          <div className="space-y-4">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start">
                      <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 mr-3 flex-shrink-0">
                        <ProductImage
                          src={product.images && product.images.length > 0 ? product.images[0] : ''}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          fallback={
                            <div className="w-full h-full bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center">
                              <span className="text-rose-600 text-sm">🌿</span>
                            </div>
                          }
                        />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{product.name}</div>
                        {product.featured && (
                          <span className="inline-block mt-1 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs px-2 py-1 rounded">
                            Featured
                          </span>
                        )}
                        <div className="text-xs text-gray-500 mt-1">
                          {product.images?.length || 0} image(s)
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</div>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${product.in_stock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {product.in_stock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                      {product.category}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => toggleFeatured(product)}
                      disabled={!product.in_stock || (updating === product.id) || (!product.featured && !canFeatureMore)}
                      className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                        product.featured 
                          ? 'bg-rose-100 text-rose-700 hover:bg-rose-200' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      } ${(!product.in_stock || (!product.featured && !canFeatureMore)) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {updating === product.id ? (
                        <>
                          <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin mr-2 inline-block"></div>
                          Updating...
                        </>
                      ) : product.featured ? (
                        '★ Featured'
                      ) : (
                        '☆ Feature'
                      )}
                    </button>
                    
                    <div className="flex space-x-2">
                      <Link
                        href={`/admin/products/edit/${product.id}`}
                        className="flex-1 text-center px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 text-xs font-medium"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="flex-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 text-xs font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  
                  {!product.featured && !canFeatureMore && (
                    <p className="text-xs text-amber-600 mt-2 text-center">
                      Max 2 featured products. Unfeature one first.
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                <div className="p-4">
                  <div className="mb-3">
                    <div className="w-full h-40 rounded-lg overflow-hidden border border-gray-200 mb-3">
                      <ProductImage
                        src={product.images && product.images.length > 0 ? product.images[0] : ''}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        fallback={
                          <div className="w-full h-full bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center">
                            <span className="text-rose-600 text-xl">🌿</span>
                          </div>
                        }
                      />
                    </div>
                    
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-medium text-gray-900">{product.name}</div>
                      {product.featured && (
                        <span className="bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs px-2 py-1 rounded">
                          Featured
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between mb-2">
                      <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                        {product.category}
                      </span>
                      <div className="text-sm font-bold text-gray-900">${product.price.toFixed(2)}</div>
                    </div>
                    
                    <div className="mb-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${product.in_stock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {product.in_stock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <button
                      onClick={() => toggleFeatured(product)}
                      disabled={!product.in_stock || (updating === product.id) || (!product.featured && !canFeatureMore)}
                      className={`w-full px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                        product.featured 
                          ? 'bg-rose-100 text-rose-700 hover:bg-rose-200' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      } ${(!product.in_stock || (!product.featured && !canFeatureMore)) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {updating === product.id ? (
                        <>
                          <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin mr-2 inline-block"></div>
                          Updating...
                        </>
                      ) : product.featured ? (
                        '★ Featured on Homepage'
                      ) : (
                        '☆ Feature on Homepage'
                      )}
                    </button>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        href={`/admin/products/edit/${product.id}`}
                        className="px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 text-xs font-medium text-center"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 text-xs font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 text-sm text-gray-500 text-center">
          Showing {filteredProducts.length} of {products.length} products • {featuredProducts.length} featured on homepage
        </div>
        
        <div className="mt-6 bg-rose-50 border border-rose-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">💡 Featured Products Guide</h3>
          <ul className="text-gray-700 text-xs space-y-1">
            <li className="flex items-start">
              <span className="text-rose-500 mr-1">•</span>
              <span>Up to <strong>2 products</strong> can be featured on the homepage</span>
            </li>
            <li className="flex items-start">
              <span className="text-rose-500 mr-1">•</span>
              <span>Only <strong>in-stock</strong> products can be featured</span>
            </li>
            <li className="flex items-start">
              <span className="text-rose-500 mr-1">•</span>
              <span>To feature a new product, first unfeature one of the current featured products</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}