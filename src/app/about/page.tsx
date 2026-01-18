export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* About Hero */}
      <section className="bg-gradient-to-br from-rose-50 to-white py-12 md:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 md:mb-6">
            About <span className="text-rose-600">Nyonjo Herbs</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-700 max-w-3xl">
            Our mission is to create a safe, anonymous space for women to explore herbal wellness.
          </p>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-8 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            {/* Mission Card */}
            <div className="bg-white rounded-xl md:rounded-3xl shadow-lg border border-rose-100 p-6 md:p-10 mb-8 md:mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center">Our Mission</h2>
              <div className="space-y-4 md:space-y-6">
                <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                  Nyonjo Herbs was born from a simple idea: women deserve a safe, judgment-free space to explore herbal wellness. We noticed that many women feel uncomfortable discussing their health concerns openly, especially when it comes to natural remedies and women-specific issues.
                </p>
                <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                  That's why we built a platform that prioritizes <span className="font-semibold text-rose-600">anonymity first</span>. No login required. No personal data collected. Just pure, supportive community and quality herbal knowledge.
                </p>
                <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                  We believe that when women feel safe, they can share more openly, learn more effectively, and support each other more genuinely.
                </p>
              </div>
            </div>

            {/* Values Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mb-8 md:mb-16">
              {/* Privacy First */}
              <div className="bg-rose-50 rounded-xl md:rounded-2xl p-6 md:p-8">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-r from-rose-400 to-pink-500 rounded-lg md:rounded-xl flex items-center justify-center mb-4 md:mb-6">
                  <span className="text-white text-lg md:text-xl">🔒</span>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 md:mb-4">Privacy First</h3>
                <p className="text-gray-700 text-sm md:text-base">Your anonymity is our top priority. We never ask for personal information.</p>
              </div>
              
              {/* Quality Herbs */}
              <div className="bg-rose-50 rounded-xl md:rounded-2xl p-6 md:p-8">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-r from-rose-400 to-pink-500 rounded-lg md:rounded-xl flex items-center justify-center mb-4 md:mb-6">
                  <span className="text-white text-lg md:text-xl">🌿</span>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 md:mb-4">Quality Herbs</h3>
                <p className="text-gray-700 text-sm md:text-base">We source herbs responsibly and provide detailed usage information.</p>
              </div>
              
              {/* Community Support */}
              <div className="bg-rose-50 rounded-xl md:rounded-2xl p-6 md:p-8">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-r from-rose-400 to-pink-500 rounded-lg md:rounded-xl flex items-center justify-center mb-4 md:mb-6">
                  <span className="text-white text-lg md:text-xl">💝</span>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 md:mb-4">Community Support</h3>
                <p className="text-gray-700 text-sm md:text-base">We foster a supportive, women-only space for sharing and learning.</p>
              </div>
              
              {/* Education */}
              <div className="bg-rose-50 rounded-xl md:rounded-2xl p-6 md:p-8">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-r from-rose-400 to-pink-500 rounded-lg md:rounded-xl flex items-center justify-center mb-4 md:mb-6">
                  <span className="text-white text-lg md:text-xl">🎓</span>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 md:mb-4">Education</h3>
                <p className="text-gray-700 text-sm md:text-base">We provide reliable information about herbal wellness and women's health.</p>
              </div>
            </div>

            {/* Team Section */}
            <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl md:rounded-3xl p-6 md:p-12 text-center">
              <div className="w-16 h-16 md:w-24 md:h-24 bg-gradient-to-r from-rose-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-8">
                <span className="text-white text-2xl md:text-3xl">👩‍⚕️</span>
              </div>
              <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-3 md:mb-4">Founded by Women, For Women</h2>
              <p className="text-base md:text-xl text-gray-700 mb-4 md:mb-8 max-w-2xl mx-auto">
                Our team consists of herbalists, wellness experts, and women who believe in the power of natural healing and community support.
              </p>
              <p className="text-gray-600 text-sm md:text-base">
                We're passionate about creating a space where every woman feels safe, heard, and supported.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}