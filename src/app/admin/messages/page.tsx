'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

type Message = {
  id: string
  name: string | null
  email: string | null
  phone: string | null
  subject: string
  message: string
  contact_preference: 'email' | 'whatsapp'
  status: 'unread' | 'read' | 'replied' | 'archived'
  created_at: string
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/admin/messages')
      const data = await response.json()
      if (response.ok) {
        setMessages(data.messages)
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/messages/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        setMessages(messages.map(msg => 
          msg.id === id ? { ...msg, status: status as Message['status'] } : msg
        ))
        if (selectedMessage?.id === id) {
          setSelectedMessage({ ...selectedMessage, status: status as Message['status'] })
        }
      }
    } catch (error) {
      console.error('Error updating message:', error)
    }
  }

  const deleteMessage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return

    try {
      const response = await fetch(`/api/admin/messages/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setMessages(messages.filter(msg => msg.id !== id))
        if (selectedMessage?.id === id) {
          setSelectedMessage(null)
        }
      }
    } catch (error) {
      console.error('Error deleting message:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unread': return 'bg-red-100 text-red-800'
      case 'read': return 'bg-blue-100 text-blue-800'
      case 'replied': return 'bg-green-100 text-green-800'
      case 'archived': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getContactPreferenceColor = (preference: string) => {
    switch (preference) {
      case 'whatsapp': return 'bg-green-100 text-green-800'
      case 'email': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredMessages = messages.filter(message =>
    message.subject.toLowerCase().includes(search.toLowerCase()) ||
    message.message.toLowerCase().includes(search.toLowerCase()) ||
    (message.name && message.name.toLowerCase().includes(search.toLowerCase())) ||
    (message.email && message.email.toLowerCase().includes(search.toLowerCase())) ||
    (message.phone && message.phone.toLowerCase().includes(search.toLowerCase()))
  )

  const unreadCount = messages.filter(msg => msg.status === 'unread').length

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/admin/dashboard" className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-r from-rose-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold">NH</span>
                </div>
                <span className="text-xl font-bold text-gray-900">
                  Customer Messages
                </span>
              </Link>
              
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {unreadCount} unread
                </span>
              )}
            </div>
            
            <Link href="/admin/dashboard" className="text-gray-600 hover:text-gray-900">
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Customer Inquiries</h1>
              <p className="text-gray-600">View and manage messages from your customers</p>
            </div>
            
            <div className="relative">
              <input
                type="text"
                placeholder="Search messages..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-transparent"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <span className="text-gray-400">🔍</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Messages List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
              {loading ? (
                <div className="text-center py-12">
                  <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading messages...</p>
                </div>
              ) : filteredMessages.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl text-gray-400">📨</span>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {search ? 'No messages found' : 'No messages yet'}
                  </h3>
                  <p className="text-gray-600">
                    {search ? 'Try a different search term' : 'Customer inquiries will appear here'}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
                  {filteredMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`p-6 cursor-pointer hover:bg-gray-50 transition-colors ${selectedMessage?.id === message.id ? 'bg-rose-50' : ''} ${message.status === 'unread' ? 'border-l-4 border-l-rose-500' : ''}`}
                      onClick={() => {
                        setSelectedMessage(message)
                        if (message.status === 'unread') {
                          updateStatus(message.id, 'read')
                        }
                      }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-bold text-gray-900 mb-1">{message.subject}</h3>
                          <div className="flex items-center space-x-3 text-sm text-gray-600">
                            <p>From: {message.name || 'Anonymous'}</p>
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getContactPreferenceColor(message.contact_preference)}">
                              {message.contact_preference === 'whatsapp' ? 'WhatsApp' : 'Email'}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(message.status)}`}>
                            {message.status.charAt(0).toUpperCase() + message.status.slice(1)}
                          </span>
                          {message.status === 'unread' && (
                            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-gray-700 line-clamp-2 mb-3">
                        {message.message}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 text-sm">
                          {formatDate(message.created_at)}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteMessage(message.id)
                          }}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Message Details */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow border border-gray-200 sticky top-8">
              {selectedMessage ? (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Message Details</h2>
                    <button
                      onClick={() => setSelectedMessage(null)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Subject</label>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-gray-900">{selectedMessage.subject}</p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">From</label>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-gray-900">
                          {selectedMessage.name || 'Anonymous'}
                          {selectedMessage.email && (
                            <>
                              <br />
                              <span className="text-gray-600">Email: </span>
                              <a href={`mailto:${selectedMessage.email}`} className="text-rose-600 hover:text-rose-700">
                                {selectedMessage.email}
                              </a>
                            </>
                          )}
                          {selectedMessage.phone && (
                            <>
                              <br />
                              <span className="text-gray-600">Phone: </span>
                              <span className="text-gray-900">{selectedMessage.phone}</span>
                            </>
                          )}
                          {selectedMessage.contact_preference && (
                            <>
                              <br />
                              <span className="text-gray-600">Prefers: </span>
                              <span className={`font-semibold ${selectedMessage.contact_preference === 'whatsapp' ? 'text-green-600' : 'text-blue-600'}`}>
                                {selectedMessage.contact_preference === 'whatsapp' ? 'WhatsApp' : 'Email'}
                              </span>
                            </>
                          )}
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Message</label>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-gray-900 whitespace-pre-wrap">{selectedMessage.message}</p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Status</label>
                      <div className="flex flex-wrap gap-2">
                        {['unread', 'read', 'replied', 'archived'].map((status) => (
                          <button
                            key={status}
                            onClick={() => updateStatus(selectedMessage.id, status)}
                            className={`px-4 py-2 rounded-lg transition-colors ${selectedMessage.status === status ? 'ring-2 ring-rose-500' : ''} ${getStatusColor(status)}`}
                          >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Received</label>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-gray-900">
                          {formatDate(selectedMessage.created_at)}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200 space-y-3">
                      {selectedMessage.email && selectedMessage.contact_preference === 'email' && (
                        <a
                          href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                          className="block w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white text-center py-3 rounded-lg hover:from-rose-600 hover:to-pink-600 transition-all font-semibold"
                        >
                          Reply via Email
                        </a>
                      )}
                      
                      {selectedMessage.phone && selectedMessage.contact_preference === 'whatsapp' && (
                        <a
                          href={`https://wa.me/${selectedMessage.phone.replace(/\D/g, '')}?text=Hi ${selectedMessage.name || 'there'}, regarding your message: "${selectedMessage.subject}"`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full bg-green-600 text-white text-center py-3 rounded-lg hover:bg-green-700 transition-all font-semibold"
                        >
                          Reply via WhatsApp
                        </a>
                      )}
                      
                      <button
                        onClick={() => deleteMessage(selectedMessage.id)}
                        className="block w-full bg-red-50 text-red-700 border border-red-200 text-center py-3 rounded-lg hover:bg-red-100 hover:text-red-800 transition-all font-semibold"
                      >
                        Delete Message
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl text-gray-400">📨</span>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Message</h3>
                  <p className="text-gray-600 px-6">
                    Click on a message from the list to view details and manage it
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {!loading && messages.length > 0 && (
          <div className="mt-8 text-sm text-gray-500">
            <div className="flex justify-between">
              <span>Total messages:</span>
              <span>{messages.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Unread messages:</span>
              <span className="text-red-600 font-semibold">{unreadCount}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}