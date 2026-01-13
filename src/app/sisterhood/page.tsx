import CreatePost from '@/components/sisterhood/CreatePost';
import PostsFeed from '@/components/sisterhood/PostsFeed';
import MobileNav from '@/components/sisterhood/MobileNav';
import CreatePostHeader from '@/components/sisterhood/CreatePostHeader';
import MobileFeatures from '@/components/sisterhood/MobileFeatures';

export default function SisterhoodPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white pb-16 md:pb-0">
      {/* Mobile Optimized Header */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-rose-100 shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-col">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              The <span className="text-rose-600">Sisterhood</span>
            </h1>
            <p className="text-xs md:text-sm text-gray-600 mt-1">
              Anonymous space for women to connect & support
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Mobile-First Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar - Features (Hidden on mobile, shown on desktop) */}
          <div className="lg:block hidden">
            <div className="bg-white rounded-2xl border border-rose-100 p-6 shadow-sm sticky top-24">
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-rose-400 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xl">👤</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">100% Anonymous</h3>
                    <p className="text-sm text-gray-600">No login, no tracking</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-rose-400 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xl">💬</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Share Freely</h3>
                    <p className="text-sm text-gray-600">Your story matters</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-rose-400 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xl">🤝</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Support System</h3>
                    <p className="text-sm text-gray-600">Like, comment, connect</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <h4 className="font-semibold text-gray-900 mb-2">Community Rules</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center">
                      <span className="text-rose-500 mr-2">✓</span>
                      Be kind & respectful
                    </li>
                    <li className="flex items-center">
                      <span className="text-rose-500 mr-2">✓</span>
                      No harassment
                    </li>
                    <li className="flex items-center">
                      <span className="text-rose-500 mr-2">✓</span>
                      Keep it anonymous
                    </li>
                  </ul>
                </div>

                <div className="pt-4 border-t border-gray-100 bg-rose-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">⚠️ Important Notice</h4>
                  <p className="text-sm text-gray-600">
                    Posts older than 2 weeks may be deleted by admin to keep the community fresh and active.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content - Posts */}
          <div className="lg:col-span-2">
            {/* Create Post Card - Collapsible */}
            <div className="bg-white rounded-2xl border border-rose-100 p-4 md:p-6 shadow-sm mb-6">
              <CreatePostHeader title="Create Post" />
              
              {/* Form hidden on mobile by default, shown on desktop */}
              <div id="create-post-form" className="lg:block hidden">
                <CreatePost />
              </div>
            </div>

            {/* Mobile Features */}
            <MobileFeatures />

            {/* Posts Feed */}
            <div className="bg-white rounded-2xl border border-rose-100 p-4 md:p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg md:text-xl font-bold text-gray-900">Recent Posts</h2>
                <div className="text-sm text-gray-500">
                  <span className="hidden md:inline">Sorted by: </span>
                  <select className="bg-transparent border-0 text-rose-600 font-medium text-sm md:text-base">
                    <option>Newest</option>
                    <option>Most Liked</option>
                  </select>
                </div>
              </div>
              <PostsFeed />
            </div>
          </div>
        </div>

        {/* Mobile Bottom Navigation */}
        <MobileNav />
      </div>
    </div>
  );
}