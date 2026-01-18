export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      {/* Privacy Hero */}
      <section className="bg-gradient-to-br from-rose-50 to-white py-12 md:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 md:mb-6">
            Privacy <span className="text-rose-600">Policy</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-700 max-w-3xl">
            Your privacy is our top priority. Here's how we protect it.
          </p>
        </div>
      </section>

      {/* Privacy Content */}
      <section className="py-8 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            {/* Main Privacy Card */}
            <div className="bg-white rounded-xl md:rounded-3xl shadow-lg border border-rose-100 p-6 md:p-10 mb-8 md:mb-12">
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-center mb-6 md:mb-8">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-rose-400 to-pink-500 rounded-full flex items-center justify-center mb-4 md:mb-0 md:mr-6">
                  <span className="text-white text-xl md:text-2xl">🔒</span>
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Our Privacy Promise</h2>
                  <p className="text-gray-700 text-sm md:text-base">Built on anonymity from the ground up</p>
                </div>
              </div>

              {/* Privacy Points */}
              <div className="space-y-6 md:space-y-8">
                {/* Point 1 */}
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 md:mb-4">1. No Registration Required</h3>
                  <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                    We believe true privacy starts with not asking for personal information. That's why we don't require any registration, login, or email address to use our platform. You can access all content and participate in the community completely anonymously.
                  </p>
                </div>
                
                {/* Point 2 */}
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 md:mb-4">2. Anonymous Browsing</h3>
                  <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                    When you visit Nyonjo Herbs, we generate a unique anonymous ID that's stored in your browser's local storage. This ID helps us provide features like posting and commenting while keeping you anonymous. This ID is not linked to any personal information and cannot be used to identify you.
                  </p>
                </div>
                
                {/* Point 3 */}
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 md:mb-4">3. What We Don't Collect</h3>
                  <ul className="list-disc pl-5 md:pl-6 space-y-1 md:space-y-2 text-gray-700 text-sm md:text-base">
                    <li>We don't collect your name, email, or phone number</li>
                    <li>We don't require any registration or login</li>
                    <li>We don't track your browsing history across other sites</li>
                    <li>We don't sell or share any user data</li>
                    <li>We don't use cookies for tracking purposes</li>
                  </ul>
                </div>
                
                {/* Point 4 */}
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 md:mb-4">4. Community Posts & Comments</h3>
                  <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                    When you post or comment in our community, your content is stored with your anonymous ID only. We moderate content to ensure community safety, but we never link posts to personal identities. You can clear your browser data at any time to remove your anonymous ID.
                  </p>
                </div>
                
                {/* Point 5 */}
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 md:mb-4">5. Contact Information</h3>
                  <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                    If you choose to contact us via our contact form, any information you provide (like email) is used only to respond to your inquiry. We don't add you to mailing lists or share your contact information unless required by law.
                  </p>
                </div>
                
                {/* Point 6 */}
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 md:mb-4">6. Data Security</h3>
                  <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                    We use industry-standard security measures to protect any data we store. Our servers are secured, and we follow privacy-by-design principles in all aspects of our platform development.
                  </p>
                </div>
                
                {/* Point 7 */}
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 md:mb-4">7. Your Control</h3>
                  <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                    You're always in control. Clear your browser data to remove your anonymous ID. Don't provide contact information unless you choose to. Remember that while we protect your anonymity on our platform, internet communications always carry some inherent privacy risks.
                  </p>
                </div>
              </div>
            </div>

            {/* Important Note */}
            <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl md:rounded-3xl p-6 md:p-10 text-center">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-rose-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                <span className="text-white text-xl md:text-2xl">⚠️</span>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4">Important Disclaimer</h3>
              <p className="text-gray-700 mb-4 md:mb-6 text-sm md:text-base">
                While we strive to protect your privacy, remember that no online platform can guarantee 100% anonymity. Always be mindful of what you share, even in anonymous settings. For medical advice, please consult with healthcare professionals.
              </p>
              <p className="text-gray-600 text-sm md:text-base">
                Last updated: January 2026
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}