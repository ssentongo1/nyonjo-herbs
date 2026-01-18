'use client'

import { useState } from 'react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    // Validate at least one contact method
    if (!formData.email && !formData.phone) {
      setError('Please provide either email or WhatsApp number so we can get back to you')
      setLoading(false)
      return
    }

    if (!formData.message.trim()) {
      setError('Message is required')
      setLoading(false)
      return
    }

    try {
      // Determine contact preference
      const contact_preference = formData.phone ? 'whatsapp' : 'email'
      
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          contact_preference
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message')
      }

      setSuccess(true)
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      })
    } catch (err: any) {
      setError(err.message || 'Failed to send message')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Contact Hero */}
      <section className="bg-gradient-to-br from-rose-50 to-white py-12 md:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 md:mb-6">
            Contact <span className="text-rose-600">Us</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-700 max-w-3xl">
            Get in touch with us for questions, collaborations, or herbal inquiries.
          </p>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-8 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
              {/* Left Column - Contact Info */}
              <div className="space-y-6 md:space-y-8">
                {/* Contact Info Card */}
                <div className="bg-white rounded-xl md:rounded-2xl shadow-lg border border-rose-100 p-6 md:p-8">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">Contact Information</h3>
                  
                  {/* Email */}
                  <div className="flex items-start mb-4 md:mb-6">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-rose-100 rounded-lg flex items-center justify-center mr-3 md:mr-4 flex-shrink-0">
                      <span className="text-base md:text-lg">📧</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 mb-1 text-sm md:text-base">Email</h4>
                      <p className="text-gray-700 text-sm md:text-base">contact@nyonjoherbs.com</p>
                      <p className="text-gray-500 text-xs md:text-sm mt-1">Typically reply within 24 hours</p>
                    </div>
                  </div>
                  
                  {/* WhatsApp */}
                  <div className="flex items-start mb-4 md:mb-6">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-rose-100 rounded-lg flex items-center justify-center mr-3 md:mr-4 flex-shrink-0">
                      <span className="text-base md:text-lg">💬</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 mb-1 text-sm md:text-base">WhatsApp</h4>
                      <a 
                        href="https://wa.me/256706052455" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-rose-600 hover:text-rose-700 font-medium text-sm md:text-base block mb-1"
                      >
                        Chat: +256 706 052 455
                      </a>
                      <p className="text-gray-500 text-xs md:text-sm mt-1">Direct messaging for quick questions</p>
                    </div>
                  </div>
                  
                  {/* Response Time */}
                  <div className="flex items-start">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-rose-100 rounded-lg flex items-center justify-center mr-3 md:mr-4 flex-shrink-0">
                      <span className="text-base md:text-lg">🕒</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 mb-1 text-sm md:text-base">Response Time</h4>
                      <p className="text-gray-700 text-sm md:text-base">24-48 hours</p>
                      <p className="text-gray-500 text-xs md:text-sm mt-1">We value every message</p>
                    </div>
                  </div>
                </div>
                
                {/* Common Inquiries */}
                <div className="bg-rose-50 rounded-xl md:rounded-2xl p-6 md:p-8">
                  <h4 className="font-bold text-gray-900 mb-3 md:mb-4 text-lg md:text-xl">Common Inquiries</h4>
                  <ul className="space-y-2 md:space-y-3">
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-rose-400 rounded-full mr-2 md:mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700 text-sm md:text-base">Herbal product information</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-rose-400 rounded-full mr-2 md:mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700 text-sm md:text-base">Product orders and shipping</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-rose-400 rounded-full mr-2 md:mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700 text-sm md:text-base">Collaboration opportunities</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-rose-400 rounded-full mr-2 md:mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700 text-sm md:text-base">Privacy concerns</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              {/* Right Column - Contact Form */}
              <div className="bg-white rounded-xl md:rounded-2xl shadow-lg border border-rose-100 p-6 md:p-8">
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">Send Us a Message</h3>
                
                {/* Success/Error Messages */}
                {success && (
                  <div className="mb-4 md:mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm md:text-base">
                    ✓ Message sent successfully! We'll get back to you soon.
                  </div>
                )}
                
                {error && (
                  <div className="mb-4 md:mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm md:text-base">
                    {error}
                  </div>
                )}
                
                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                  {/* Name */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2 text-sm md:text-base" htmlFor="name">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-rose-200 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-transparent text-sm md:text-base"
                      placeholder="Optional"
                    />
                  </div>
                  
                  {/* Email & Phone Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2 text-sm md:text-base" htmlFor="email">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-rose-200 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-transparent text-sm md:text-base"
                        placeholder="your@email.com"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2 text-sm md:text-base" htmlFor="phone">
                        WhatsApp Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-rose-200 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-transparent text-sm md:text-base"
                        placeholder="+256 706 052 455"
                      />
                    </div>
                  </div>
                  
                  {/* Contact Method Note */}
                  <div className="text-xs md:text-sm text-gray-600 bg-rose-50 p-3 md:p-4 rounded-lg">
                    <p className="font-semibold mb-1">💡 How we'll contact you:</p>
                    <p>Provide at least one contact method. We'll reply by email or WhatsApp based on what you provide.</p>
                  </div>
                  
                  {/* Subject */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2 text-sm md:text-base" htmlFor="subject">
                      Subject
                    </label>
                    <select
                      id="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-rose-200 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-transparent text-sm md:text-base"
                    >
                      <option value="">Select a topic</option>
                      <option value="Herbal Products Inquiry">Herbal Products Inquiry</option>
                      <option value="Order Question">Order Question</option>
                      <option value="Shipping Information">Shipping Information</option>
                      <option value="Community Questions">Community Questions</option>
                      <option value="Collaboration">Collaboration</option>
                      <option value="Technical Support">Technical Support</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  
                  {/* Message */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2 text-sm md:text-base" htmlFor="message">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      className="w-full px-4 py-3 border border-rose-200 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-transparent text-sm md:text-base"
                      placeholder="How can we help you today? Please include any details that will help us assist you better."
                      required
                    ></textarea>
                    <p className="text-gray-500 text-xs md:text-sm mt-2">
                      Include your WhatsApp number or email above so we can get back to you easily.
                    </p>
                  </div>
                  
                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white py-3 md:py-4 rounded-lg hover:from-rose-600 hover:to-pink-600 transition-all font-semibold text-base md:text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Sending...' : 'Send Message'}
                  </button>
                  
                  {/* Privacy Note */}
                  <p className="text-center text-gray-600 text-xs md:text-sm">
                    By contacting us, you agree to our privacy policy. Your information is safe with us.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}