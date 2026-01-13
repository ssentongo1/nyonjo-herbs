export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* About Hero */}
      <section className="bg-gradient-to-br from-rose-50 to-white py-20">
        <div className="container mx-auto px-6">
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            About <span className="text-rose-600">Nyonjo Herbs</span>
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl">
            Our mission is to create a safe, anonymous space for women to explore herbal wellness.
          </p>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl shadow-xl border border-rose-100 p-10 mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Mission</h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Nyonjo Herbs was born from a simple idea: women deserve a safe, judgment-free space to explore herbal wellness. We noticed that many women feel uncomfortable discussing their health concerns openly, especially when it comes to natural remedies and women-specific issues.
              </p>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                That's why we built a platform that prioritizes <span className="font-semibold text-rose-600">anonymity first</span>. No login required. No personal data collected. Just pure, supportive community and quality herbal knowledge.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                We believe that when women feel safe, they can share more openly, learn more effectively, and support each other more genuinely.
              </p>
            </div>

            {/* Values */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              <div className="bg-rose-50 rounded-2xl p-8">
                <div className="w-14 h-14 bg-gradient-to-r from-rose-400 to-pink-500 rounded-xl flex items-center justify-center mb-6">
                  <span className="text-xl text-white">🔒</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Privacy First</h3>
                <p className="text-gray-700">Your anonymity is our top priority. We never ask for personal information.</p>
              </div>
              
              <div className="bg-rose-50 rounded-2xl p-8">
                <div className="w-14 h-14 bg-gradient-to-r from-rose-400 to-pink-500 rounded-xl flex items-center justify-center mb-6">
                  <span className="text-xl text-white">🌿</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Quality Herbs</h3>
                <p className="text-gray-700">We source herbs responsibly and provide detailed usage information.</p>
              </div>
              
              <div className="bg-rose-50 rounded-2xl p-8">
                <div className="w-14 h-14 bg-gradient-to-r from-rose-400 to-pink-500 rounded-xl flex items-center justify-center mb-6">
                  <span className="text-xl text-white">💝</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Community Support</h3>
                <p className="text-gray-700">We foster a supportive, women-only space for sharing and learning.</p>
              </div>
              
              <div className="bg-rose-50 rounded-2xl p-8">
                <div className="w-14 h-14 bg-gradient-to-r from-rose-400 to-pink-500 rounded-xl flex items-center justify-center mb-6">
                  <span className="text-xl text-white">🎓</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Education</h3>
                <p className="text-gray-700">We provide reliable information about herbal wellness and women's health.</p>
              </div>
            </div>

            {/* Team */}
            <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-3xl p-12 text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-rose-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-8">
                <span className="text-3xl text-white">👩‍⚕️</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Founded by Women, For Women</h2>
              <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
                Our team consists of herbalists, wellness experts, and women who believe in the power of natural healing and community support.
              </p>
              <p className="text-gray-600">
                We're passionate about creating a space where every woman feels safe, heard, and supported.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}