'use client';

import { useState } from 'react';

export default function MobileFeatures() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="lg:hidden mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-100 rounded-xl p-4 flex justify-between items-center"
      >
        <span className="font-semibold text-gray-900">Community Info</span>
        <span className="text-rose-600 text-xl">{isOpen ? '−' : '+'}</span>
      </button>
      
      {isOpen && (
        <div className="bg-white rounded-xl border border-rose-100 p-6 shadow-sm mt-2">
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
      )}
    </div>
  );
}