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

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
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
      <section className="pt-20 pb-12 md:pt-32 md:pb-20 bg-gradient-to-br from-rose-50 via-white to-pink-50 px-4 sm:px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="max-w-5xl">
            <div className="inline-block mb-4 md:mb-6">
              <span className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-full text-sm md:text-base font-semibold shadow-md">
                For Women's Wellness
              </span>
            </div>
            
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 text-gray-900">
              <span className="block">Herbal Wellness</span>
              <span className="block text-rose-600 mt-2 md:mt-3">Made Simple</span>
            </h1>
            
            <p className="text-base md:text-xl text-gray-700 mb-6 md:mb-8 max-w-3xl">
              Discover natural solutions in a safe, anonymous space. 
              No accounts needed. No judgment. Just support.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-8 md:mb-12">
              <Link 
                href="/shop" 
                className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-5 py-3 md:px-6 md:py-4 rounded-full hover:from-rose-600 hover:to-pink-600 transition-all text-sm md:text-base font-semibold shadow-lg text-center"
              >
                Explore Herbal Shop →
              </Link>
              <Link 
                href="/sisterhood" 
                className="bg-white text-gray-800 border-2 border-rose-300 px-5 py-3 md:px-6 md:py-4 rounded-full hover:bg-rose-50 transition-all text-sm md:text-base font-semibold shadow-md text-center"
              >
                Join Our Sisterhood
              </Link>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4 max-w-3xl">
              <div className="text-center bg-white/80 rounded-xl p-3 md:p-5 border border-rose-100">
                <div className="text-xl md:text-2xl font-bold text-rose-600 mb-1 md:mb-2">100%</div>
                <div className="text-xs md:text-sm text-gray-700">Anonymous</div>
              </div>
              <div className="text-center bg-white/80 rounded-xl p-3 md:p-5 border border-rose-100">
                <div className="text-xl md:text-2xl font-bold text-rose-600 mb-1 md:mb-2">Women-Only</div>
                <div className="text-xs md:text-sm text-gray-700">Safe Space</div>
              </div>
              <div className="text-center bg-white/80 rounded-xl p-3 md:p-5 border border-rose-100 col-span-2 sm:col-span-1">
                <div className="text-xl md:text-2xl font-bold text-rose-600 mb-1 md:mb-2">Natural</div>
                <div className="text-xs md:text-sm text-gray-700">Herbal Solutions</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Blog Post Section */}
      <section className="py-8 md:py-12 bg-white px-4 sm:px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8">
            <div>
              <div className="inline-flex items-center mb-2 md:mb-3">
                <span className="w-5 h-5 md:w-6 md:h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-2 md:mr-3">
                  <span className="text-white text-xs md:text-sm">★</span>
                </span>
                <span className="text-xs md:text-base font-semibold text-blue-600 uppercase tracking-wide">Featured Blog</span>
              </div>
              <h2 className="text-2xl md:text-4xl font-bold text-gray-900">
                Today's <span className="text-blue-600">Wellness Wisdom</span>
              </h2>
            </div>
            <Link
              href="/blog"
              className="mt-2 md:mt-0 text-rose-600 hover:text-rose-700 font-semibold text-sm md:text-base"
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
                      <div className="w-full rounded-t-xl md:rounded-t-2xl lg:rounded-l-2xl lg:rounded-tr-none overflow-hidden bg-black">
                        <video 
                          controls 
                          className="w-full h-auto max-h-[200px] sm:max-h-[250px] md:max-h-[300px] lg:max-h-[400px] bg-black"
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
                      <div className="w-full h-48 sm:h-56 md:h-64">
                        <img
                          src={featuredBlogPost.cover_image}
                          alt={featuredBlogPost.title}
                          className="w-full h-full object-cover rounded-t-xl md:rounded-t-2xl lg:rounded-l-2xl lg:rounded-tr-none"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-48 sm:h-56 md:h-64 bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center rounded-t-xl md:rounded-t-2xl lg:rounded-l-2xl lg:rounded-tr-none">
                        <span className="text-2xl md:text-3xl text-white">📝</span>
                      </div>
                    )}
                  </div>
                )}
                <div className={`p-4 sm:p-6 md:p-8 ${featuredBlogPost.cover_image && featuredBlogPost.cover_image.trim() !== '' ? 'lg:w-1/2' : 'w-full'}`}>
                  <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-3 md:mb-4">
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 md:px-4 md:py-2 rounded-full text-xs md:text-base font-semibold">
                      {featuredBlogPost.category}
                    </span>
                    <span className="text-gray-500 text-xs md:text-base">
                      {formatDate(featuredBlogPost.published_at)}
                    </span>
                  </div>
                  
                  <h3 className="text-lg md:text-2xl font-bold text-gray-900 mb-3 md:mb-4">
                    {featuredBlogPost.title}
                  </h3>
                  
                  <p className="text-gray-700 text-sm md:text-base mb-4 md:mb-6 line-clamp-2 md:line-clamp-3">
                    {featuredBlogPost.excerpt || featuredBlogPost.content?.substring(0, 120)}...
                  </p>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 md:gap-4">
                    <Link
                      href={`/blog/${featuredBlogPost.id}`}
                      className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2.5 md:px-5 md:py-3 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all font-semibold text-sm md:text-base shadow-md text-center"
                    >
                      Read Full Article
                    </Link>
                    <div className="flex items-center text-gray-600 text-xs md:text-base">
                      <span className="flex items-center mr-3 md:mr-4">
                        <span className="mr-1 md:mr-2">👁️</span>
                        {featuredBlogPost.view_count || 0} views
                      </span>
                      <span className="flex items-center">
                        <span className="mr-1 md:mr-2">❤️</span>
                        {featuredBlogPost.like_count || 0} likes
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl md:rounded-2xl p-6 md:p-8 text-center">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                <span className="text-xl md:text-2xl text-white">📝</span>
              </div>
              <h3 className="text-lg md:text-2xl font-bold text-gray-900 mb-3 md:mb-4">No Featured Blog Post Yet</h3>
              <p className="text-gray-700 text-sm md:text-base mb-4 md:mb-6">
                Admin will feature a blog post here soon.
              </p>
              <Link
                href="/blog"
                className="inline-block bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2.5 md:px-5 md:py-3 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all font-semibold text-sm md:text-base"
              >
                Browse All Blog Posts
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-8 md:py-12 bg-gradient-to-br from-rose-50 to-white px-4 sm:px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8">
            <div>
              <div className="inline-flex items-center mb-2 md:mb-3">
                <span className="w-5 h-5 md:w-6 md:h-6 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full flex items-center justify-center mr-2 md:mr-3">
                  <span className="text-white text-xs md:text-sm">★</span>
                </span>
                <span className="text-xs md:text-base font-semibold text-rose-600 uppercase tracking-wide">Featured Products</span>
              </div>
              <h2 className="text-2xl md:text-4xl font-bold text-gray-900">
                Top <span className="text-rose-600">Herbal Picks</span>
              </h2>
            </div>
            <Link
              href="/shop"
              className="mt-2 md:mt-0 text-rose-600 hover:text-rose-700 font-semibold text-sm md:text-base"
            >
              Shop All Products →
            </Link>
          </div>
          
          {featuredProducts && featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
              {featuredProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-xl md:rounded-2xl shadow-lg border border-rose-100 overflow-hidden">
                  <div className="flex flex-col sm:flex-row">
                    <div className="w-full sm:w-2/5 aspect-square bg-gradient-to-br from-rose-50 to-pink-50 p-4 md:p-5">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-rose-100 to-pink-100 rounded-lg flex items-center justify-center">
                          <span className="text-3xl md:text-4xl text-rose-600">🌿</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="w-full sm:w-3/5 p-4 md:p-5">
                      <div className="flex justify-between items-start mb-2 md:mb-3">
                        <h3 className="text-base md:text-lg font-bold text-gray-900">{product.name}</h3>
                        <span className="bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs md:text-sm px-2 py-1 md:px-3 md:py-1.5 rounded-full font-semibold">
                          Featured
                        </span>
                      </div>
                      
                      <p className="text-gray-600 text-sm md:text-base mb-3 md:mb-4 line-clamp-2">
                        {product.short_description || product.description?.substring(0, 80)}...
                      </p>
                      
                      <div className="mb-3 md:mb-4">
                        <span className="text-xl md:text-2xl font-bold text-rose-600">
                          ${product.price}
                        </span>
                      </div>
                      
                      <div className="mb-3 md:mb-4">
                        <span className={`inline-flex items-center px-2 py-1 md:px-3 md:py-1.5 rounded-full text-xs md:text-sm font-medium ${product.in_stock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {product.in_stock ? '✓ In Stock' : 'Out of Stock'}
                        </span>
                      </div>
                      
                      <Link 
                        href={`/shop/${product.id}`}
                        className="block w-full text-center bg-gradient-to-r from-rose-500 to-pink-500 text-white px-4 py-2.5 md:px-5 md:py-3 rounded-lg hover:from-rose-600 hover:to-pink-600 transition-all font-semibold text-sm md:text-base shadow-md"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl md:rounded-2xl p-6 md:p-8 text-center">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-r from-rose-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                <span className="text-xl md:text-2xl text-white">🌿</span>
              </div>
              <h3 className="text-lg md:text-2xl font-bold text-gray-900 mb-3 md:mb-4">No Featured Products Yet</h3>
              <p className="text-gray-700 text-sm md:text-base mb-4 md:mb-6">
                Admin will feature top herbal products here soon.
              </p>
              <Link
                href="/shop"
                className="inline-block bg-gradient-to-r from-rose-500 to-pink-500 text-white px-4 py-2.5 md:px-5 md:py-3 rounded-lg hover:from-rose-600 hover:to-pink-600 transition-all font-semibold text-sm md:text-base"
              >
                Browse All Products
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Featured Sisterhood Post Section - NEW SECTION */}
      <section className="py-8 md:py-12 bg-gradient-to-br from-purple-50 to-pink-50 px-4 sm:px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8">
            <div>
              <div className="inline-flex items-center mb-2 md:mb-3">
                <span className="w-5 h-5 md:w-6 md:h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-2 md:mr-3">
                  <span className="text-white text-xs md:text-sm">★</span>
                </span>
                <span className="text-xs md:text-base font-semibold text-purple-600 uppercase tracking-wide">Featured Community Post</span>
              </div>
              <h2 className="text-2xl md:text-4xl font-bold text-gray-900">
                From Our <span className="text-purple-600">Sisterhood</span>
              </h2>
            </div>
            <Link
              href="/sisterhood"
              className="mt-2 md:mt-0 text-purple-600 hover:text-purple-700 font-semibold text-sm md:text-base"
            >
              View All Community Posts →
            </Link>
          </div>
          
          {featuredSisterhoodPost ? (
            <div className="bg-white rounded-xl md:rounded-2xl overflow-hidden shadow-lg border border-purple-100">
              <div className="flex flex-col lg:flex-row">
                {featuredSisterhoodPost.media_url && featuredSisterhoodPost.media_url.trim() !== '' && (
                  <div className="relative lg:w-2/5">
                    {isVideo(featuredSisterhoodPost.media_url) || featuredSisterhoodPost.media_type === 'video' ? (
                      <div className="w-full rounded-t-xl md:rounded-t-2xl lg:rounded-l-2xl lg:rounded-tr-none overflow-hidden bg-black">
                        <video 
                          controls 
                          className="w-full h-auto max-h-[200px] sm:max-h-[250px] md:max-h-[300px] lg:max-h-[350px] bg-black"
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
                    ) : isImage(featuredSisterhoodPost.media_url) ? (
                      <div className="w-full h-48 sm:h-56 md:h-64 lg:h-auto">
                        <img
                          src={featuredSisterhoodPost.media_url}
                          alt={featuredSisterhoodPost.title || 'Community post'}
                          className="w-full h-full object-cover rounded-t-xl md:rounded-t-2xl lg:rounded-l-2xl lg:rounded-tr-none"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-48 sm:h-56 md:h-64 bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center rounded-t-xl md:rounded-t-2xl lg:rounded-l-2xl lg:rounded-tr-none">
                        <span className="text-2xl md:text-3xl text-white">💝</span>
                      </div>
                    )}
                  </div>
                )}
                <div className={`p-4 sm:p-6 md:p-8 ${featuredSisterhoodPost.media_url && featuredSisterhoodPost.media_url.trim() !== '' ? 'lg:w-3/5' : 'w-full'}`}>
                  <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-3 md:mb-4">
                    <span className="bg-purple-100 text-purple-700 px-3 py-1 md:px-4 md:py-2 rounded-full text-xs md:text-base font-semibold">
                      Community Post
                    </span>
                    <span className="text-gray-500 text-xs md:text-base">
                      {formatDate(featuredSisterhoodPost.created_at)}
                    </span>
                  </div>
                  
                  <h3 className="text-lg md:text-2xl font-bold text-gray-900 mb-3 md:mb-4">
                    {featuredSisterhoodPost.title || 'Community Sharing'}
                  </h3>
                  
                  <p className="text-gray-700 text-sm md:text-base mb-4 md:mb-6 line-clamp-2 md:line-clamp-3">
                    {featuredSisterhoodPost.content?.substring(0, 150)}...
                  </p>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 md:gap-4">
                    <Link
                      href={`/sisterhood/${featuredSisterhoodPost.id}`}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2.5 md:px-5 md:py-3 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all font-semibold text-sm md:text-base shadow-md text-center"
                    >
                      Read Full Post
                    </Link>
                    <div className="flex items-center text-gray-600 text-xs md:text-base">
                      <span className="flex items-center mr-3 md:mr-4">
                        <span className="mr-1 md:mr-2">💬</span>
                        {featuredSisterhoodPost.comment_count || 0} comments
                      </span>
                      <span className="flex items-center">
                        <span className="mr-1 md:mr-2">❤️</span>
                        {featuredSisterhoodPost.like_count || 0} likes
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-purple-100">
                    <div className="flex items-center">
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white text-sm md:text-base">👤</span>
                      </div>
                      <div>
                        <p className="text-gray-700 text-sm md:text-base">
                          <span className="font-semibold">Anonymous Sister</span> shared in our community
                        </p>
                        <p className="text-gray-500 text-xs md:text-sm">
                          {featuredSisterhoodPost.is_anonymous ? 'Posted anonymously' : 'Shared with love'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl md:rounded-2xl p-6 md:p-8 text-center border border-purple-100 shadow-lg">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                <span className="text-xl md:text-2xl text-white">💝</span>
              </div>
              <h3 className="text-lg md:text-2xl font-bold text-gray-900 mb-3 md:mb-4">No Featured Community Post Yet</h3>
              <p className="text-gray-700 text-sm md:text-base mb-4 md:mb-6">
                Join our sisterhood to share your story or read inspiring posts from other women.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
                <Link
                  href="/sisterhood"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2.5 md:px-5 md:py-3 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all font-semibold text-sm md:text-base"
                >
                  Browse Community
                </Link>
                <Link
                  href="/sisterhood/create"
                  className="bg-white border-2 border-purple-300 text-purple-700 px-4 py-2.5 md:px-5 md:py-3 rounded-lg hover:bg-purple-50 transition-all font-semibold text-sm md:text-base"
                >
                  Share Your Story
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-8 md:py-12 bg-gradient-to-br from-gray-50 to-white px-4 sm:px-6">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-2xl md:text-4xl font-bold text-center text-gray-900 mb-6 md:mb-8">
            Why Our Community <span className="text-rose-600">Trusts Us</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <div className="bg-white p-4 md:p-6 rounded-xl md:rounded-2xl shadow-lg border border-rose-100">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-rose-100 rounded-lg flex items-center justify-center mb-3 md:mb-4">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-rose-400 to-pink-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm md:text-base">👤</span>
                </div>
              </div>
              <h3 className="text-base md:text-lg font-bold text-gray-900 mb-2 md:mb-3">Total Anonymity</h3>
              <p className="text-gray-700 text-sm md:text-base">
                No registration required. Your privacy is our priority.
              </p>
            </div>
            
            <div className="bg-white p-4 md:p-6 rounded-xl md:rounded-2xl shadow-lg border border-rose-100">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-rose-100 rounded-lg flex items-center justify-center mb-3 md:mb-4">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-rose-400 to-pink-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm md:text-base">🌿</span>
                </div>
              </div>
              <h3 className="text-base md:text-lg font-bold text-gray-900 mb-2 md:mb-3">Quality Herbs</h3>
              <p className="text-gray-700 text-sm md:text-base">
                Carefully sourced, traditionally used herbs with modern quality standards.
              </p>
            </div>
            
            <div className="bg-white p-4 md:p-6 rounded-xl md:rounded-2xl shadow-lg border border-rose-100">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-rose-100 rounded-lg flex items-center justify-center mb-3 md:mb-4">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-rose-400 to-pink-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm md:text-base">💝</span>
                </div>
              </div>
              <h3 className="text-base md:text-lg font-bold text-gray-900 mb-2 md:mb-3">Supportive Sisterhood</h3>
              <p className="text-gray-700 text-sm md:text-base">
                Connect with women worldwide in our anonymous community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-8 md:py-12 overflow-hidden px-4 sm:px-6">
        <div className="absolute inset-0 bg-gradient-to-r from-rose-600 to-pink-700"></div>
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-4 md:mb-6">
              Begin Your Wellness Journey Today
            </h2>
            <p className="text-rose-100 text-base md:text-lg mb-6 md:mb-8">
              Whether you're seeking herbal solutions or supportive community, 
              we're here for you. Anonymously.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4">
              <Link 
                href="/shop" 
                className="bg-white text-rose-700 px-5 py-3 md:px-6 md:py-4 rounded-full hover:bg-rose-50 transition-all text-sm md:text-base font-semibold shadow-lg"
              >
                Browse Herbal Collection
              </Link>
              <Link 
                href="/blog" 
                className="bg-transparent border-2 border-white text-white px-5 py-3 md:px-6 md:py-4 rounded-full hover:bg-white/10 transition-all text-sm md:text-base font-semibold"
              >
                Explore Wellness Blog
              </Link>
            </div>
            
            <p className="mt-6 md:mt-8 text-rose-200 text-xs md:text-base">
              No sign-up required • 100% anonymous • Women-focused
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}