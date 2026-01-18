import { getProducts } from '@/lib/db'
import Link from 'next/link'
import ProductImage from '@/components/ProductImage'

export default async function ShopPage() {
  const products = await getProducts()
  
  return (
    <div className="min-h-screen">
      {/* Shop Hero - Mobile Optimized */}
      <section className="pt-20 pb-12 md:pt-32 md:pb-20 bg-gradient-to-br from-rose-50 to-white px-4 sm:px-6">
        <div className="container mx-auto max-w-7xl">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 md:mb-6">
            Herbal <span className="text-rose-600">Shop</span>
          </h1>
          <p className="text-base md:text-xl text-gray-700 max-w-3xl mb-8 md:mb-12">
            Carefully curated herbal products for women's wellness. All products come with detailed usage instructions and benefits.
          </p>

          {/* Product Categories - Mobile Optimized */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-12 md:mb-16">
            <div className="bg-white p-4 md:p-6 rounded-xl md:rounded-2xl shadow-lg border border-rose-100 text-center">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                <span className="text-2xl md:text-3xl">🌿</span>
              </div>
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3">Women's Wellness</h3>
              <p className="text-gray-700 text-sm md:text-base">Herbs specifically for women's health and hormonal balance</p>
            </div>
            
            <div className="bg-white p-4 md:p-6 rounded-xl md:rounded-2xl shadow-lg border border-rose-100 text-center">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                <span className="text-2xl md:text-3xl">💆‍♀️</span>
              </div>
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3">Stress & Relaxation</h3>
              <p className="text-gray-700 text-sm md:text-base">Natural solutions for stress relief and better sleep</p>
            </div>
            
            <div className="bg-white p-4 md:p-6 rounded-xl md:rounded-2xl shadow-lg border border-rose-100 text-center">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                <span className="text-2xl md:text-3xl">⚕️</span>
              </div>
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3">Immune Support</h3>
              <p className="text-gray-700 text-sm md:text-base">Herbs to support your immune system naturally</p>
            </div>
          </div>

          {/* Products Grid */}
          <div className="mb-12 md:mb-16">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 md:gap-4 mb-6 md:mb-8">
              <h2 className="text-2xl md:text-4xl font-bold text-gray-900">Our Herbal Collection</h2>
              <div className="text-base md:text-lg text-gray-600">
                {products.length} product{products.length !== 1 ? 's' : ''} available
              </div>
            </div>
            
            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {products.map((product) => (
                  <div key={product.id} className="bg-white rounded-xl md:rounded-2xl shadow-lg border border-rose-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
                    <div className="aspect-square bg-gradient-to-br from-rose-50 to-pink-50 p-4 md:p-5">
                      <ProductImage
                        src={product.images && product.images.length > 0 ? product.images[0] : ''}
                        alt={product.name}
                        className="w-full h-full object-cover rounded-lg md:rounded-xl"
                        fallback={
                          <div className="w-full h-full bg-gradient-to-br from-rose-100 to-pink-100 rounded-lg md:rounded-xl flex items-center justify-center">
                            <span className="text-4xl md:text-5xl">🌿</span>
                          </div>
                        }
                      />
                    </div>
                    
                    <div className="p-4 md:p-6">
                      <div className="flex justify-between items-start mb-3 md:mb-4">
                        <h3 className="text-lg md:text-xl font-bold text-gray-900">{product.name}</h3>
                        {product.featured && (
                          <span className="bg-rose-100 text-rose-700 text-xs md:text-sm px-2 py-1 md:px-3 md:py-1.5 rounded-full font-semibold">
                            Featured
                          </span>
                        )}
                      </div>
                      
                      <p className="text-gray-600 text-sm md:text-base mb-3 md:mb-4">
                        {product.short_description || product.description?.substring(0, 100)}...
                      </p>
                      
                      <div className="mb-3 md:mb-4">
                        <span className="text-2xl md:text-3xl font-bold text-rose-600">
                          ${product.price}
                        </span>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <span className={`text-sm md:text-base font-semibold ${product.in_stock ? 'text-green-600' : 'text-red-600'}`}>
                          {product.in_stock ? '✓ In Stock' : '✗ Out of Stock'}
                        </span>
                        
                        <Link 
                          href={`/shop/${product.id}`}
                          className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-4 py-2.5 md:px-5 md:py-3 rounded-lg hover:from-rose-600 hover:to-pink-600 transition-all text-sm md:text-base font-semibold text-center"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-2xl md:rounded-3xl p-6 md:p-10 text-center">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-rose-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8">
                  <span className="text-2xl md:text-3xl text-white">🛍️</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6">No Products Yet</h2>
                <p className="text-base md:text-xl text-gray-700 mb-6 md:mb-8 max-w-2xl mx-auto">
                  Our herbal collection is being carefully curated. Products will be available shortly!
                </p>
                <Link
                  href="/contact" 
                  className="inline-block bg-gradient-to-r from-rose-500 to-pink-500 text-white px-6 py-3 md:px-8 md:py-4 rounded-full hover:from-rose-600 hover:to-pink-600 transition-all font-semibold text-base md:text-lg shadow-lg"
                >
                  Contact for Early Access
                </Link>
              </div>
            )}
          </div>

          {/* Contact CTA */}
          <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-2xl md:rounded-3xl p-6 md:p-10 text-center">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-rose-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8">
              <span className="text-2xl md:text-3xl text-white">💬</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6">Questions About Our Herbs?</h2>
            <p className="text-base md:text-xl text-gray-700 mb-6 md:mb-8 max-w-2xl mx-auto">
              We're here to help you choose the right herbs for your wellness journey.
            </p>
            <Link
              href="/contact" 
              className="inline-block bg-gradient-to-r from-rose-500 to-pink-500 text-white px-6 py-3 md:px-8 md:py-4 rounded-full hover:from-rose-600 hover:to-pink-600 transition-all font-semibold text-base md:text-lg shadow-lg"
            >
              Contact Our Herbal Team
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}