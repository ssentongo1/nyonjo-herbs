import { getProductsStatic, getProductById } from '@/lib/db'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ImageSlider from '@/components/ImageSlider'
import ProductImage from '@/components/ProductImage'

export async function generateStaticParams() {
  const products = await getProductsStatic()
  return products.map((product) => ({
    id: product.id,
  }))
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await getProductById(id)
  
  if (!product) {
    notFound()
  }
  
  return (
    <div className="min-h-screen">
      {/* Product Hero */}
      <section className="bg-gradient-to-br from-rose-50 to-white py-8 md:py-12">
        <div className="container mx-auto px-4 md:px-6">
          <Link href="/shop" className="inline-flex items-center text-rose-600 hover:text-rose-700 mb-4 md:mb-6">
            ← Back to Shop
          </Link>
          
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
              {/* Product Images */}
              <div>
                <div className="bg-white rounded-2xl md:rounded-3xl shadow-lg border border-rose-100 p-4 md:p-6">
                  {product.images && product.images.length > 0 ? (
                    <ImageSlider images={product.images} productName={product.name} />
                  ) : (
                    <div className="aspect-square bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl md:rounded-2xl flex items-center justify-center p-8">
                      <ProductImage
                        src=""
                        alt={product.name}
                        className="w-full h-full rounded-lg"
                        fallback={
                          <div className="w-full h-full bg-gradient-to-br from-rose-100 to-pink-100 rounded-lg flex items-center justify-center">
                            <span className="text-6xl md:text-8xl">🌿</span>
                          </div>
                        }
                      />
                    </div>
                  )}
                  
                  {product.images && product.images.length > 1 && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-600 mb-2 text-center">
                        {product.images.length} images available
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Product Info */}
              <div>
                <div className="mb-4 md:mb-6">
                  {product.category && (
                    <span className="bg-rose-100 text-rose-700 px-3 py-1 rounded-full text-sm font-semibold">
                      {product.category}
                    </span>
                  )}
                  {product.featured && (
                    <span className="ml-2 bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm font-semibold">
                      Featured
                    </span>
                  )}
                </div>
                
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 md:mb-6">
                  {product.name}
                </h1>
                
                <p className="text-xl md:text-2xl text-rose-600 font-bold mb-6 md:mb-8">
                  ${product.price.toFixed(2)}
                </p>
                
                <div className="mb-8">
                  <span className={`text-lg font-semibold ${product.in_stock ? 'text-green-600' : 'text-red-600'}`}>
                    {product.in_stock ? '✅ In Stock' : '❌ Out of Stock'}
                  </span>
                </div>
                
                {product.short_description && (
                  <div className="bg-rose-50 rounded-xl md:rounded-2xl p-6 md:p-8 mb-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Overview</h3>
                    <p className="text-gray-700 leading-relaxed">
                      {product.short_description}
                    </p>
                  </div>
                )}
                
                {product.description && (
                  <div className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-rose-100 p-6 md:p-8 mb-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Full Description</h3>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {product.description}
                    </p>
                  </div>
                )}
                
                {/* Benefits */}
                {product.benefits && product.benefits.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Key Benefits</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {product.benefits.map((benefit: string, index: number) => (
                        <div key={index} className="flex items-center bg-white rounded-lg p-3 border border-rose-100">
                          <div className="w-8 h-8 bg-rose-100 rounded-lg flex items-center justify-center mr-3">
                            <span className="text-rose-600">✓</span>
                          </div>
                          <span className="text-gray-700">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Usage Instructions */}
                {product.usage_instructions && (
                  <div className="bg-rose-50 rounded-xl md:rounded-2xl p-6 md:p-8 mb-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Usage Instructions</h3>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {product.usage_instructions}
                    </p>
                  </div>
                )}
                
                {/* Action Buttons */}
                <div className="space-y-4">
                  <a 
                    href={`/contact?product=${encodeURIComponent(product.name)}`}
                    className="block w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white text-center py-4 rounded-xl hover:from-rose-600 hover:to-pink-600 transition-all font-bold text-lg shadow-lg hover:shadow-xl"
                  >
                    Contact to Purchase
                  </a>
                  
                  <a 
                    href="/contact"
                    className="block w-full bg-white text-gray-800 border-2 border-rose-300 text-center py-4 rounded-xl hover:bg-rose-50 transition-all font-semibold text-lg"
                  >
                    Ask a Question
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}