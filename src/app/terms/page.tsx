export default function TermsPage() {
  return (
    <div className="min-h-screen">
      {/* Terms Hero */}
      <section className="bg-gradient-to-br from-rose-50 to-white py-12 md:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 md:mb-6">
            Terms & <span className="text-rose-600">Conditions</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-700 max-w-3xl">
            Please read these terms carefully before using our platform.
          </p>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-8 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            {/* Main Terms Card */}
            <div className="bg-white rounded-xl md:rounded-3xl shadow-lg border border-rose-100 p-6 md:p-10 mb-8 md:mb-12">
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-center mb-6 md:mb-8">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-rose-400 to-pink-500 rounded-full flex items-center justify-center mb-4 md:mb-0 md:mr-6">
                  <span className="text-white text-xl md:text-2xl">📄</span>
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Terms of Use</h2>
                  <p className="text-gray-700 text-sm md:text-base">Effective: Janaury 2026</p>
                </div>
              </div>

              {/* Terms Points */}
              <div className="space-y-6 md:space-y-8">
                {/* Point 1 */}
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 md:mb-4">1. Acceptance of Terms</h3>
                  <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                    By accessing and using Nyonjo Herbs, you accept and agree to be bound by these Terms & Conditions. If you do not agree, please do not use our platform.
                  </p>
                </div>
                
                {/* Point 2 */}
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 md:mb-4">2. Platform Description</h3>
                  <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                    Nyonjo Herbs is an anonymous herbal wellness platform for women, providing educational content, herbal products, and community support. We do not provide medical advice.
                  </p>
                </div>
                
                {/* Point 3 */}
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 md:mb-4">3. Medical Disclaimer</h3>
                  <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                    The content on this platform is for informational purposes only and is not medical advice. Always consult with a healthcare professional before using any herbal products, especially if you are pregnant, nursing, taking medications, or have medical conditions.
                  </p>
                </div>
                
                {/* Point 4 */}
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 md:mb-4">4. User Responsibilities</h3>
                  <ul className="list-disc pl-5 md:pl-6 space-y-1 md:space-y-2 text-gray-700 text-sm md:text-base">
                    <li>You are responsible for any content you post in our community</li>
                    <li>You must not share harmful, abusive, or inappropriate content</li>
                    <li>You must respect the anonymity of other users</li>
                    <li>You understand that herbs may interact with medications</li>
                  </ul>
                </div>
                
                {/* Point 5 */}
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 md:mb-4">5. Community Guidelines</h3>
                  <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                    Our community is built on respect and support. We reserve the right to remove any content that violates our guidelines, including but not limited to: harassment, hate speech, medical misinformation, or commercial spam.
                  </p>
                </div>
                
                {/* Point 6 */}
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 md:mb-4">6. Purchases & Payments</h3>
                  <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                    All herbal purchases are subject to availability. Prices may change without notice. We are not responsible for customs duties or import taxes in your country.
                  </p>
                </div>
                
                {/* Point 7 */}
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 md:mb-4">7. Intellectual Property</h3>
                  <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                    All content on this platform (text, images, logos) is owned by Nyonjo Herbs or used with permission. You may not reproduce, distribute, or create derivative works without permission.
                  </p>
                </div>
                
                {/* Point 8 */}
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 md:mb-4">8. Limitation of Liability</h3>
                  <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                    Nyonjo Herbs is not liable for any direct, indirect, incidental, or consequential damages resulting from the use of our platform, content, or products. Use herbs at your own risk.
                  </p>
                </div>
                
                {/* Point 9 */}
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 md:mb-4">9. Changes to Terms</h3>
                  <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                    We may update these terms at any time. Continued use of the platform after changes constitutes acceptance of the new terms.
                  </p>
                </div>
                
                {/* Point 10 */}
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 md:mb-4">10. Contact</h3>
                  <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                    For questions about these terms, contact us through our contact page.
                  </p>
                </div>
              </div>
            </div>

            {/* Acceptance Note */}
            <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl md:rounded-3xl p-6 md:p-10 text-center">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-rose-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                <span className="text-white text-xl md:text-2xl">✓</span>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4">By using our platform, you agree to these terms.</h3>
              <p className="text-gray-700 text-sm md:text-base">
                If you have concerns about any part of these terms, please contact us before using the platform.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}