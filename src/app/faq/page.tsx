export default function FAQPage() {
  const faqs = [
    {
      question: "Is this platform really anonymous?",
      answer: "Yes! We don't require any login or registration. You can browse all content, read the blog, and even participate in the community without ever revealing your identity. We use anonymous browser IDs that aren't linked to any personal information."
    },
    {
      question: "How does the community work without accounts?",
      answer: "When you first visit, we generate a unique anonymous ID that's stored in your browser. This ID lets you post and comment in the community while keeping you completely anonymous. If you clear your browser data, you'll get a new anonymous ID."
    },
    {
      question: "Are the herbs safe to use?",
      answer: "We provide detailed usage instructions and safety information for every herb. However, we always recommend consulting with a healthcare professional before starting any new herbal regimen, especially if you're pregnant, nursing, or taking medications."
    },
    {
      question: "How do I purchase herbs?",
      answer: "You can browse our herbal collection and use the contact form to inquire about purchasing. We'll provide you with pricing, shipping information, and answer any questions you have about the products."
    },
    {
      question: "Is this platform only for women?",
      answer: "Yes, Nyonjo Herbs is specifically created for women. Our content, community, and herbal focus are all designed with women's wellness in mind. We believe this creates a safer, more relevant space for our users."
    },
    {
      question: "How is my data protected?",
      answer: "We collect minimal data and never ask for personal information. Anonymous posts and comments are stored without any identifying information. We use secure servers and follow privacy-by-design principles throughout our platform."
    },
    {
      question: "Can I share my personal health stories?",
      answer: "Absolutely! That's what our community is for. You can share your experiences completely anonymously. Many women find comfort in sharing and learning from others who understand what they're going through."
    },
    {
      question: "Do you ship internationally?",
      answer: "Yes, we ship our herbal products worldwide. Shipping costs and times vary by location. Contact us with your location for specific shipping information."
    }
  ]

  return (
    <div className="min-h-screen">
      {/* FAQ Hero */}
      <section className="bg-gradient-to-br from-rose-50 to-white py-20">
        <div className="container mx-auto px-6">
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Frequently Asked <span className="text-rose-600">Questions</span>
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl">
            Find answers to common questions about our platform, products, and community.
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            {/* Featured Questions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              <div className="bg-gradient-to-br from-rose-500 to-pink-500 text-white rounded-2xl p-8">
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-6">
                  <span className="text-xl">👤</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">100% Anonymous</h3>
                <p>No registration, no login, no personal data collected. Your privacy is protected.</p>
              </div>
              
              <div className="bg-gradient-to-br from-rose-400 to-pink-400 text-white rounded-2xl p-8">
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-6">
                  <span className="text-xl">🌿</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">Quality Herbs</h3>
                <p>Carefully sourced with traditional knowledge and modern safety standards.</p>
              </div>
            </div>

            {/* FAQ List */}
            <div className="bg-white rounded-3xl shadow-xl border border-rose-100 overflow-hidden">
              {faqs.map((faq, index) => (
                <div key={index} className={`border-b border-rose-100 ${index === faqs.length - 1 ? '' : 'border-b'}`}>
                  <details className="group p-8">
                    <summary className="flex items-center justify-between cursor-pointer list-none">
                      <h3 className="text-xl font-bold text-gray-900">{faq.question}</h3>
                      <span className="text-rose-500 text-2xl group-open:rotate-180 transition-transform">▼</span>
                    </summary>
                    <div className="mt-6">
                      <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                    </div>
                  </details>
                </div>
              ))}
            </div>

            {/* Still Have Questions */}
            <div className="mt-16 bg-gradient-to-r from-rose-50 to-pink-50 rounded-3xl p-12 text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-rose-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-8">
                <span className="text-3xl text-white">💬</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Still Have Questions?</h2>
              <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
                We're here to help! Contact us for any additional questions or concerns.
              </p>
              <a 
                href="/contact" 
                className="inline-block bg-gradient-to-r from-rose-500 to-pink-500 text-white px-8 py-4 rounded-full hover:from-rose-600 hover:to-pink-600 transition-all font-semibold text-lg shadow-lg"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}