import Link from 'next/link'
import { getFeaturedBlogPost, getFeaturedProducts, getFeaturedCommunityPost } from '@/lib/db'

export default async function Home() {
  const [featuredBlogPost, featuredProducts, featuredSisterhoodPost] = await Promise.all([
    getFeaturedBlogPost(),
    getFeaturedProducts(),
    getFeaturedCommunityPost()
  ])

  const isImage = (url: string) => {
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
  };

  const isVideo = (url: string) => {
    return /\.(mp4|webm|mov|avi)$/i.test(url);
  };

  // Simple date formatting for server - no locale
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      // Simple format without locale
      const month = date.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' });
      const day = date.getUTCDate();
      const year = date.getUTCFullYear();
      return `${month} ${day}, ${year}`;
    } catch {
      return '';
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section - Mobile Optimized */}
      <section className="relative min-h-[70vh] md:min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-rose-50 via-white to-pink-50 px-4">
        <div className="container mx-auto relative z-10">
          <div className="max-w-5xl">
            <div className="inline-block mb-3 md:mb-4">
              <span className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-3 py-1.5 md:px-4 md:py-1.5 rounded-full text-xs md:text-sm font-semibold shadow-md">
                For Women's Wellness
              </span>
            </div>
            
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-4 leading-tight text-gray-900">
              <span className="block">Herbal Wellness</span>
              <span className="block text-rose-600 mt-1 md:mt-2">Made Simple</span>
            </h1>
            
            <p className="text-base md:text-lg text-gray-700 mb-4 md:mb-6 max-w-3xl font-medium leading-relaxed">
              Discover natural solutions in a safe, anonymous space. 
              No accounts needed. No judgment. Just support.
            </p>
            
            <div className="flex flex-col sm:flex-row flex-wrap gap-2 md:gap-3 items-start sm:items-center">
              <Link 
                href="/shop" 
                className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-4 py-2.5 md:px-6 md:py-3 rounded-full hover:from-rose-600 hover:to-pink-600 transition-all text-sm md:text-base font-semibold shadow-lg hover:shadow-xl w-full sm:w-auto text-center"
              >
                Explore Herbal Shop →
              </Link>
              <Link 
                href="/sisterhood" 
                className="bg-white text-gray-800 border border-rose-300 md:border-2 px-4 py-2.5 md:px-6 md:py-3 rounded-full hover:bg-rose-50 transition-all text-sm md:text-base font-semibold shadow-md hover:shadow-lg w-full sm:w-auto text-center mt-2 sm:mt-0"
              >
                Join Our Sisterhood
              </Link>
            </div>
            
            <div className="mt-6 md:mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 max-w-3xl">
              <div className="text-center bg-white/50 rounded-lg md:rounded-xl p-2 md:p-3">
                <div className="text-lg md:text-xl font-bold text-rose-600 mb-0.5 md:mb-1">100%</div>
                <div className="text-gray-700 text-xs md:text-sm">Anonymous</div>
              </div>
              <div className="text-center bg-white/50 rounded-lg md:rounded-xl p-2 md:p-3">
                <div className="text-lg md:text-xl font-bold text-rose-600 mb-0.5 md:mb-1">Women-Only</div>
                <div className="text-gray-700 text-xs md:text-sm">Safe Space</div>
              </div>
              <div className="text-center bg-white/50 rounded-lg md:rounded-xl p-2 md:p-3">
                <div className="text-lg md:text-xl font-bold text-rose-600 mb-0.5 md:mb-1">Natural</div>
                <div className="text-gray-700 text-xs md:text-sm">Herbal Solutions</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-1/4 right-0 w-32 h-32 md:w-96 md:h-96 bg-rose-100/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-0 w-28 h-28 md:w-80 md:h-80 bg-pink-100/30 rounded-full blur-3xl"></div>
      </section>

      {/* Featured Blog Post Section */}
      <section className="py-6 md:py-12 bg-white px-3 md:px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 md:mb-8">
            <div>
              <div className="inline-flex items-center mb-1 md:mb-2">
                <span className="w-4 h-4 md:w-5 md:h-5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-1 md:mr-2">
                  <span className="text-white text-[10px] md:text-xs">★</span>
                </span>
                <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Featured Blog</span>
              </div>
              <h2 className="text-xl md:text-3xl font-bold text-gray-900">
                Today's <span className="text-blue-600">Wellness Wisdom</span>
              </h2>
            </div>
            <Link
              href="/blog"
              className="mt-1 md:mt-0 text-rose-600 hover:text-rose-700 font-semibold text-xs md:text-sm"
            >
              View All Blog Posts →
            </Link>
          </div>
          
          {featuredBlogPost ? (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl md:rounded-2xl overflow-hidden shadow-lg">
              <div className="flex flex-col lg:flex-row">
                {featuredBlogPost.cover_image && featuredBlogPost.cover_image.trim() !== '' && (
                  <div className="relative lg:w-1/2">
                    {isVideo(featuredBlogPost.cover_image) || featuredBlogPost.media_type === 'video' ? (
                      <div className="w-full rounded-lg md:rounded-xl overflow-hidden bg-black">
                        <video 
                          controls 
                          className="w-full h-auto max-h-[300px] md:max-h-[500px] bg-black"
                          playsInline
                          preload="metadata"
                          key={featuredBlogPost.cover_image}
                        >
                          <source 
                            src={featuredBlogPost.cover_image} 
                            type={`video/${featuredBlogPost.cover_image.split('.').pop()?.toLowerCase() || 'mp4'}`} 
                          />
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    ) : isImage(featuredBlogPost.cover_image) ? (
                      <div className="w-full h-48 md:h-64 lg:h-full">
                        <img
                          src={featuredBlogPost.cover_image}
                          alt={featuredBlogPost.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-48 md:h-64 lg:h-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                        <span className="text-2xl md:text-3xl text-white">📝</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20"></div>
                  </div>
                )}
                <div className={`p-3 md:p-6 lg:p-8 ${featuredBlogPost.cover_image && featuredBlogPost.cover_image.trim() !== '' ? 'lg:w-1/2' : 'w-full'}`}>
                  <div className="flex flex-wrap items-center gap-1 md:gap-2 mb-2 md:mb-3">
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-semibold">
                      {featuredBlogPost.category}
                    </span>
                    <span className="text-gray-500 text-xs">
                      {formatDate(featuredBlogPost.published_at)}
                    </span>
                  </div>
                  
                  <h3 className="text-base md:text-xl font-bold text-gray-900 mb-2 md:mb-3">
                    {featuredBlogPost.title}
                  </h3>
                  
                  <p className="text-gray-700 text-sm mb-3 md:mb-4 line-clamp-2 md:line-clamp-3">
                    {featuredBlogPost.excerpt || featuredBlogPost.content?.substring(0, 120)}...
                  </p>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 md:gap-3">
                    <Link
                      href={`/blog/${featuredBlogPost.id}`}
                      className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all font-semibold text-xs md:text-sm shadow-md w-full sm:w-auto text-center"
                    >
                      Read Full Article
                    </Link>
                    <div className="flex items-center text-gray-600 text-xs md:text-sm mt-1 sm:mt-0">
                      <span className="flex items-center mr-2 md:mr-3">
                        <span className="mr-0.5 md:mr-1">👁️</span>
                        {featuredBlogPost.view_count || 0} views
                      </span>
                      <span className="flex items-center">
                        <span className="mr-0.5 md:mr-1">❤️</span>
                        {featuredBlogPost.like_count || 0} likes
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl md:rounded-2xl p-4 md:p-6 text-center">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                <span className="text-lg md:text-xl text-white">📝</span>
              </div>
              <h3 className="text-base md:text-lg font-bold text-gray-900 mb-2 md:mb-3">No Featured Blog Post Yet</h3>
              <p className="text-gray-700 text-xs md:text-sm mb-3 md:mb-4">
                Admin will feature a blog post here soon.
              </p>
              <Link
                href="/blog"
                className="inline-block bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all font-semibold text-xs md:text-sm"
              >
                Browse All Blog Posts
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-6 md:py-12 bg-gradient-to-br from-rose-50 to-white px-3 md:px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 md:mb-8">
            <div>
              <div className="inline-flex items-center mb-1 md:mb-2">
                <span className="w-4 h-4 md:w-5 md:h-5 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full flex items-center justify-center mr-1 md:mr-2">
                  <span className="text-white text-[10px] md:text-xs">★</span>
                </span>
                <span className="text-xs font-semibold text-rose-600 uppercase tracking-wide">Featured Products</span>
              </div>
              <h2 className="text-xl md:text-3xl font-bold text-gray-900">
                Top <span className="text-rose-600">Herbal Picks</span>
              </h2>
            </div>
            <Link
              href="/shop"
              className="mt-1 md:mt-0 text-rose-600 hover:text-rose-700 font-semibold text-xs md:text-sm"
            >
              Shop All Products →
            </Link>
          </div>
          
          {featuredProducts && featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
              {featuredProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-lg md:rounded-xl shadow-lg border border-rose-100 overflow-hidden">
                  <div className="flex flex-col sm:flex-row">
                    <div className="w-full sm:w-1/3 aspect-square bg-gradient-to-br from-rose-50 to-pink-50 p-2 md:p-4">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-rose-100 to-pink-100 rounded-lg flex items-center justify-center">
                          <span className="text-2xl md:text-3xl text-rose-600">🌿</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="w-full sm:w-2/3 p-3 md:p-4">
                      <div className="flex justify-between items-start mb-1 md:mb-2">
                        <h3 className="text-sm md:text-lg font-bold text-gray-900">{product.name}</h3>
                        <span className="bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[10px] md:text-xs px-1.5 py-0.5 md:px-2 md:py-1 rounded-full font-semibold">
                          Featured
                        </span>
                      </div>
                      
                      <p className="text-gray-600 text-xs md:text-sm mb-2 md:mb-3 line-clamp-2">
                        {product.short_description || product.description?.substring(0, 80)}...
                      </p>
                      
                      <div className="mb-2 md:mb-3">
                        <span className="text-lg md:text-xl font-bold text-rose-600">
                          ${product.price}
                        </span>
                      </div>
                      
                      <div className="mb-2 md:mb-3">
                        <span className={`inline-flex items-center px-1.5 py-0.5 md:px-2 md:py-1 rounded-full text-[10px] md:text-xs font-medium ${product.in_stock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {product.in_stock ? '✓ In Stock' : 'Out of Stock'}
                        </span>
                      </div>
                      
                      <Link 
                        href={`/shop/${product.id}`}
                        className="block w-full text-center bg-gradient-to-r from-rose-500 to-pink-500 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-lg hover:from-rose-600 hover:to-pink-600 transition-all font-semibold text-xs md:text-sm shadow-md"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl md:rounded-2xl p-4 md:p-6 text-center">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-rose-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                <span className="text-lg md:text-xl text-white">🌿</span>
              </div>
              <h3 className="text-base md:text-lg font-bold text-gray-900 mb-2 md:mb-3">No Featured Products Yet</h3>
              <p className="text-gray-700 text-xs md:text-sm mb-3 md:mb-4">
                Admin will feature top herbal products here soon.
              </p>
              <Link
                href="/shop"
                className="inline-block bg-gradient-to-r from-rose-500 to-pink-500 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-lg hover:from-rose-600 hover:to-pink-600 transition-all font-semibold text-xs md:text-sm"
              >
                Browse All Products
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Featured Sisterhood Story Section */}
      <section className="py-6 md:py-12 bg-white px-3 md:px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 md:mb-8">
            <div>
              <div className="inline-flex items-center mb-1 md:mb-2">
                <span className="w-4 h-4 md:w-5 md:h-5 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mr-1 md:mr-2">
                  <span className="text-white text-[10px] md:text-xs">★</span>
                </span>
                <span className="text-xs font-semibold text-pink-600 uppercase tracking-wide">Featured Community Story</span>
              </div>
              <h2 className="text-xl md:text-3xl font-bold text-gray-900">
                Today's <span className="text-pink-600">Sisterhood Story</span>
              </h2>
            </div>
            <Link
              href="/sisterhood"
              className="mt-1 md:mt-0 text-pink-600 hover:text-pink-700 font-semibold text-xs md:text-sm"
            >
              Join the Conversation →
            </Link>
          </div>
          
          {featuredSisterhoodPost ? (
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl md:rounded-2xl overflow-hidden shadow-lg">
              <div className="p-3 md:p-6">
                <div className="flex items-center justify-between mb-3 md:mb-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center mr-2 md:mr-3">
                      <span className="text-white font-bold text-xs md:text-sm">
                        {featuredSisterhoodPost.username?.charAt(0).toUpperCase() || 'A'}
                      </span>
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 text-xs md:text-sm">Anonymous Sister</div>
                      <div className="text-xs text-gray-500">
                        {formatDate(featuredSisterhoodPost.created_at)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-pink-600">
                    <span className="mr-0.5 md:mr-1 text-xs md:text-sm">❤️</span>
                    <span className="font-semibold text-xs md:text-sm">{featuredSisterhoodPost.likes || 0}</span>
                  </div>
                </div>
                
                {/* Show media if exists - Match blog video structure */}
                {featuredSisterhoodPost.media_url && (
                  <div className="mb-3 md:mb-4">
                    {isImage(featuredSisterhoodPost.media_url) ? (
                      <div className="w-full h-48 md:h-64 bg-black rounded-lg overflow-hidden">
                        <img 
                          src={featuredSisterhoodPost.media_url} 
                          alt="Featured story media" 
                          className="w-full h-full object-contain"
                        />
                      </div>
                    ) : isVideo(featuredSisterhoodPost.media_url) ? (
                      <div className="w-full rounded-lg md:rounded-xl overflow-hidden bg-black">
                        <video 
                          controls 
                          className="w-full h-auto max-h-[300px] md:max-h-[500px] bg-black"
                          playsInline
                          preload="metadata"
                          key={featuredSisterhoodPost.media_url}
                        >
                          <source 
                            src={featuredSisterhoodPost.media_url} 
                            type={`video/${featuredSisterhoodPost.media_url.split('.').pop()?.toLowerCase() || 'mp4'}`} 
                          />
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    ) : (
                      <div className="w-full h-48 md:h-64 bg-black rounded-lg overflow-hidden flex items-center justify-center">
                        <span className="text-gray-400 text-sm">📁 Media</span>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="mb-3 md:mb-4">
                  <p className="text-gray-800 text-sm md:text-base leading-relaxed line-clamp-3 md:line-clamp-4">
                    "{featuredSisterhoodPost.content}"
                  </p>
                  {featuredSisterhoodPost.content && featuredSisterhoodPost.content.length > 150 && (
                    <span className="text-xs text-gray-500 mt-1 block">(story continues...)</span>
                  )}
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 md:gap-3">
                  <Link
                    href="/sisterhood"
                    className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-lg hover:from-pink-600 hover:to-purple-600 transition-all font-semibold text-xs md:text-sm shadow-md w-full sm:w-auto text-center"
                  >
                    Read More Stories
                  </Link>
                  <div className="text-gray-600 mt-1 sm:mt-0">
                    <span className="bg-pink-100 text-pink-700 px-1.5 py-0.5 md:px-2 md:py-1 rounded-full text-xs font-semibold">
                      {featuredSisterhoodPost.category || 'Support'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl md:rounded-2xl p-4 md:p-6 text-center">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                <span className="text-lg md:text-xl text-white">👭</span>
              </div>
              <h3 className="text-base md:text-lg font-bold text-gray-900 mb-2 md:mb-3">No Featured Story Yet</h3>
              <p className="text-gray-700 text-xs md:text-sm mb-3 md:mb-4">
                Admin will feature an inspiring community story here soon.
              </p>
              <Link
                href="/sisterhood"
                className="inline-block bg-gradient-to-r from-pink-500 to-purple-500 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-lg hover:from-pink-600 hover:to-purple-600 transition-all font-semibold text-xs md:text-sm"
              >
                Join Our Community
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-6 md:py-12 bg-gradient-to-br from-gray-50 to-white px-3 md:px-4">
        <div className="container mx-auto">
          <h2 className="text-xl md:text-3xl font-bold text-center text-gray-900 mb-4 md:mb-8">
            Why Our Community <span className="text-rose-600">Trusts Us</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
            <div className="bg-white p-3 md:p-4 rounded-lg md:rounded-xl shadow-lg border border-rose-100">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-rose-100 rounded-lg flex items-center justify-center mb-2 md:mb-3">
                <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-r from-rose-400 to-pink-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs md:text-sm">👤</span>
                </div>
              </div>
              <h3 className="text-sm md:text-lg font-bold text-gray-900 mb-1 md:mb-2">Total Anonymity</h3>
              <p className="text-gray-700 text-xs md:text-sm">
                No registration required. Your privacy is our priority.
              </p>
            </div>
            
            <div className="bg-white p-3 md:p-4 rounded-lg md:rounded-xl shadow-lg border border-rose-100">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-rose-100 rounded-lg flex items-center justify-center mb-2 md:mb-3">
                <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-r from-rose-400 to-pink-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs md:text-sm">🌿</span>
                </div>
              </div>
              <h3 className="text-sm md:text-lg font-bold text-gray-900 mb-1 md:mb-2">Quality Herbs</h3>
              <p className="text-gray-700 text-xs md:text-sm">
                Carefully sourced, traditionally used herbs with modern quality standards.
              </p>
            </div>
            
            <div className="bg-white p-3 md:p-4 rounded-lg md:rounded-xl shadow-lg border border-rose-100">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-rose-100 rounded-lg flex items-center justify-center mb-2 md:mb-3">
                <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-r from-rose-400 to-pink-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs md:text-sm">💝</span>
                </div>
              </div>
              <h3 className="text-sm md:text-lg font-bold text-gray-900 mb-1 md:mb-2">Supportive Sisterhood</h3>
              <p className="text-gray-700 text-xs md:text-sm">
                Connect with women worldwide in our anonymous community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-6 md:py-12 overflow-hidden px-3 md:px-4">
        <div className="absolute inset-0 bg-gradient-to-r from-rose-600 to-pink-700"></div>
        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-xl md:text-3xl font-bold text-white mb-3 md:mb-4">
              Begin Your Wellness Journey Today
            </h2>
            <p className="text-rose-100 text-xs md:text-base mb-4 md:mb-6">
              Whether you're seeking herbal solutions or supportive community, 
              we're here for you. Anonymously.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-2 md:gap-3">
              <Link 
                href="/shop" 
                className="bg-white text-rose-700 px-3 py-2 md:px-4 md:py-3 rounded-full hover:bg-rose-50 transition-all text-xs md:text-sm font-semibold shadow-lg"
              >
                Browse Herbal Collection
              </Link>
              <Link 
                href="/blog" 
                className="bg-transparent border border-white md:border-2 text-white px-3 py-2 md:px-4 md:py-3 rounded-full hover:bg-white/10 transition-all text-xs md:text-sm font-semibold mt-2 sm:mt-0"
              >
                Explore Wellness Blog
              </Link>
            </div>
            
            <p className="mt-4 md:mt-6 text-rose-200 text-xs">
              No sign-up required • 100% anonymous • Women-focused
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}