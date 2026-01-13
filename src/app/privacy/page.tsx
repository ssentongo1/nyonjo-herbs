export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      {/* Privacy Hero */}
      <section className="bg-gradient-to-br from-rose-50 to-white py-20">
        <div className="container mx-auto px-6">
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Privacy <span className="text-rose-600">Policy</span>
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl">
            Your privacy is our top priority. Here's how we protect it.
          </p>
        </div>
      </section>

      {/* Privacy Content */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl shadow-xl border border-rose-100 p-10 mb-12">
              <div className="flex items-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-rose-400 to-pink-500 rounded-full flex items-center justify-center mr-6">
                  <span className="text-2xl text-white">🔒</span>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Our Privacy Promise</h2>
                  <p className="text-gray-700">Built on anonymity from the ground up</p>
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">1. No Registration Required</h3>
                  <p className="text-gray-700 leading-relaxed">
                    We believe true privacy starts with not asking for personal information. That's why we don't require any registration, login, or email address to use our platform. You can access all content and participate in the community completely anonymously.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">2. Anonymous Browsing</h3>
                  <p className="text-gray-700 leading-relaxed">
                    When you visit Nyonjo Herbs, we generate a unique anonymous ID that's stored in your browser's local storage. This ID helps us provide features like posting and commenting while keeping you anonymous. This ID is not linked to any personal information and cannot be used to identify you.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">3. What We Don't Collect</h3>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>We don't collect your name, email, or phone number</li>
                    <li>We don't require any registration or login</li>
                    <li>We don't track your browsing history across other sites</li>
                    <li>We don't sell or share any user data</li>
                    <li>We don't use cookies for tracking purposes</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">4. Community Posts & Comments</h3>
                  <p className="text-gray-700 leading-relaxed">
                    When you post or comment in our community, your content is stored with your anonymous ID only. We moderate content to ensure community safety, but we never link posts to personal identities. You can clear your browser data at any time to remove your anonymous ID.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">5. Contact Information</h3>
                  <p className="text-gray-700 leading-relaxed">
                    If you choose to contact us via our contact form, any information you provide (like email) is used only to respond to your inquiry. We don't add you to mailing lists or share your contact information unless required by law.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">6. Data Security</h3>
                  <p className="text-gray-700 leading-relaxed">
                    We use industry-standard security measures to protect any data we store. Our servers are secured, and we follow privacy-by-design principles in all aspects of our platform development.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">7. Your Control</h3>
                  <p className="text-gray-700 leading-relaxed">
                    You're always in control. Clear your browser data to remove your anonymous ID. Don't provide contact information unless you choose to. Remember that while we protect your anonymity on our platform, internet communications always carry some inherent privacy risks.
                  </p>
                </div>
              </div>
            </div>

            {/* Important Note */}
            <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-3xl p-10 text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-rose-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl text-white">⚠️</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Important Disclaimer</h3>
              <p className="text-gray-700 mb-6">
                While we strive to protect your privacy, remember that no online platform can guarantee 100% anonymity. Always be mindful of what you share, even in anonymous settings. For medical advice, please consult with healthcare professionals.
              </p>
              <p className="text-gray-600">
                Last updated: November 2024
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}