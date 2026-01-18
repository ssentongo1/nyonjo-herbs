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
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">
              The <span className="text-rose-600">Sisterhood</span>
            </h1>
            <p className="text-xs md:text-sm text-gray-600 mt-1">
              Anonymous space for women to connect & support
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4 md:py-6">
        {/* Mobile-First Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Left Sidebar - Features (Hidden on mobile, shown on desktop) */}
          <div className="lg:block hidden">
            <div className="bg-white rounded-xl md:rounded-2xl border border-rose-100 p-4 md:p-6 shadow-sm sticky top-20 md:top-24">
              <div className="space-y-4 md:space-y-6">
                {/* Privacy Feature */}
                <div className="flex items-start space-x-3 md:space-x-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-rose-400 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-base md:text-lg">👤</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm md:text-base">100% Anonymous</h3>
                    <p className="text-xs md:text-sm text-gray-600">No login, no tracking</p>
                  </div>
                </div>

                {/* Share Feature */}
                <div className="flex items-start space-x-3 md:space-x-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-rose-400 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-base md:text-lg">💬</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm md:text-base">Share Freely</h3>
                    <p className="text-xs md:text-sm text-gray-600">Your story matters</p>
                  </div>
                </div>

                {/* Support Feature */}
                <div className="flex items-start space-x-3 md:space-x-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-rose-400 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-base md:text-lg">🤝</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm md:text-base">Support System</h3>
                    <p className="text-xs md:text-sm text-gray-600">Like, comment, connect</p>
                  </div>
                </div>

                {/* Community Rules */}
                <div className="pt-3 md:pt-4 border-t border-gray-100">
                  <h4 className="font-semibold text-gray-900 mb-2 text-sm md:text-base">Community Rules</h4>
                  <ul className="space-y-1 md:space-y-2 text-xs md:text-sm text-gray-600">
                    <li className="flex items-center">
                      <span className="text-rose-500 mr-2 text-xs">✓</span>
                      Be kind & respectful
                    </li>
                    <li className="flex items-center">
                      <span className="text-rose-500 mr-2 text-xs">✓</span>
                      No harassment
                    </li>
                    <li className="flex items-center">
                      <span className="text-rose-500 mr-2 text-xs">✓</span>
                      Keep it anonymous
                    </li>
                  </ul>
                </div>

                {/* Important Notice */}
                <div className="pt-3 md:pt-4 border-t border-gray-100 bg-rose-50 rounded-lg p-3 md:p-4">
                  <h4 className="font-semibold text-gray-900 mb-1 md:mb-2 text-sm md:text-base">⚠️ Important Notice</h4>
                  <p className="text-xs md:text-sm text-gray-600">
                    Posts older than 2 weeks may be deleted by admin to keep the community fresh and active.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content - Posts */}
          <div className="lg:col-span-2">
            {/* Create Post Card */}
            <div className="bg-white rounded-xl md:rounded-2xl border border-rose-100 p-4 md:p-6 shadow-sm mb-4 md:mb-6">
              <CreatePostHeader title="Create Post" />
              
              {/* Form hidden on mobile by default, shown on desktop */}
              <div id="create-post-form" className="lg:block hidden">
                <CreatePost />
              </div>
            </div>

            {/* Mobile Features */}
            <MobileFeatures />

            {/* Posts Feed */}
            <div className="bg-white rounded-xl md:rounded-2xl border border-rose-100 p-4 md:p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <h2 className="text-base md:text-lg lg:text-xl font-bold text-gray-900">Recent Posts</h2>
                <div className="text-xs md:text-sm text-gray-500">
                  <span className="hidden md:inline">Sorted by: </span>
                  <select className="bg-transparent border-0 text-rose-600 font-medium text-xs md:text-sm lg:text-base">
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