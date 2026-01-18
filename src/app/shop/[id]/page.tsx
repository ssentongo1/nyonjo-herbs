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
      <section className="bg-gradient-to-br from-rose-50 to-white py-6 md:py-8 lg:py-12">
        <div className="container mx-auto px-4 md:px-6">
          <Link href="/shop" className="inline-flex items-center text-rose-600 hover:text-rose-700 mb-3 md:mb-4 text-sm md:text-base">
            ← Back to Shop
          </Link>
          
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
              {/* Product Images */}
              <div>
                <div className="bg-white rounded-xl md:rounded-2xl shadow-lg border border-rose-100 p-4 md:p-6">
                  {product.images && product.images.length > 0 ? (
                    <ImageSlider images={product.images} productName={product.name} />
                  ) : (
                    <div className="aspect-square bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl md:rounded-2xl flex items-center justify-center p-4 md:p-8">
                      <ProductImage
                        src=""
                        alt={product.name}
                        className="w-full h-full rounded-lg"
                        fallback={
                          <div className="w-full h-full bg-gradient-to-br from-rose-100 to-pink-100 rounded-lg flex items-center justify-center">
                            <span className="text-4xl md:text-6xl lg:text-8xl">🌿</span>
                          </div>
                        }
                      />
                    </div>
                  )}
                  
                  {product.images && product.images.length > 1 && (
                    <div className="mt-3 md:mt-4">
                      <p className="text-xs md:text-sm text-gray-600 mb-1 text-center">
                        {product.images.length} images available
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Product Info */}
              <div>
                {/* Tags */}
                <div className="mb-3 md:mb-4 lg:mb-6 flex flex-wrap gap-2">
                  {product.category && (
                    <span className="bg-rose-100 text-rose-700 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-semibold">
                      {product.category}
                    </span>
                  )}
                  {product.featured && (
                    <span className="ml-0 md:ml-2 bg-pink-100 text-pink-700 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-semibold">
                      Featured
                    </span>
                  )}
                </div>
                
                {/* Product Title */}
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 md:mb-4 lg:mb-6">
                  {product.name}
                </h1>
                
                {/* Price */}
                <p className="text-lg md:text-xl lg:text-2xl text-rose-600 font-bold mb-4 md:mb-6 lg:mb-8">
                  ${product.price.toFixed(2)}
                </p>
                
                {/* Stock Status */}
                <div className="mb-4 md:mb-6 lg:mb-8">
                  <span className={`text-base md:text-lg font-semibold ${product.in_stock ? 'text-green-600' : 'text-red-600'}`}>
                    {product.in_stock ? '✅ In Stock' : '❌ Out of Stock'}
                  </span>
                </div>
                
                {/* Short Description */}
                {product.short_description && (
                  <div className="bg-rose-50 rounded-xl md:rounded-2xl p-4 md:p-6 lg:p-8 mb-4 md:mb-6 lg:mb-8">
                    <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3 lg:mb-4">Quick Overview</h3>
                    <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                      {product.short_description}
                    </p>
                  </div>
                )}
                
                {/* Full Description */}
                {product.description && (
                  <div className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-rose-100 p-4 md:p-6 lg:p-8 mb-4 md:mb-6 lg:mb-8">
                    <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3 lg:mb-4">Full Description</h3>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line text-sm md:text-base">
                      {product.description}
                    </p>
                  </div>
                )}
                
                {/* Benefits */}
                {product.benefits && product.benefits.length > 0 && (
                  <div className="mb-4 md:mb-6 lg:mb-8">
                    <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4">Key Benefits</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
                      {product.benefits.map((benefit: string, index: number) => (
                        <div key={index} className="flex items-center bg-white rounded-lg p-2 md:p-3 border border-rose-100">
                          <div className="w-6 h-6 md:w-8 md:h-8 bg-rose-100 rounded-lg flex items-center justify-center mr-2 md:mr-3 flex-shrink-0">
                            <span className="text-rose-600 text-sm md:text-base">✓</span>
                          </div>
                          <span className="text-gray-700 text-sm md:text-base">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Usage Instructions */}
                {product.usage_instructions && (
                  <div className="bg-rose-50 rounded-xl md:rounded-2xl p-4 md:p-6 lg:p-8 mb-4 md:mb-6 lg:mb-8">
                    <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3 lg:mb-4">Usage Instructions</h3>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line text-sm md:text-base">
                      {product.usage_instructions}
                    </p>
                  </div>
                )}
                
                {/* Action Buttons */}
                <div className="space-y-3 md:space-y-4">
                  <a 
                    href={`/contact?product=${encodeURIComponent(product.name)}`}
                    className="block w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white text-center py-3 md:py-4 rounded-xl hover:from-rose-600 hover:to-pink-600 transition-all font-bold text-base md:text-lg shadow-lg hover:shadow-xl"
                  >
                    Contact to Purchase
                  </a>
                  
                  <a 
                    href="/contact"
                    className="block w-full bg-white text-gray-800 border-2 border-rose-300 text-center py-3 md:py-4 rounded-xl hover:bg-rose-50 transition-all font-semibold text-base md:text-lg"
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