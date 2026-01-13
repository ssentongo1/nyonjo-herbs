'use client'

const ANONYMOUS_ID_KEY = 'nyonjo_anonymous_id'

export function getAnonymousId(): string {
  if (typeof window === 'undefined') return ''
  
  let anonymousId = localStorage.getItem(ANONYMOUS_ID_KEY)
  
  if (!anonymousId) {
    anonymousId = generateAnonymousId()
    localStorage.setItem(ANONYMOUS_ID_KEY, anonymousId)
  }
  
  return anonymousId
}

export function generateAnonymousId(): string {
  // Generate a random ID with timestamp to ensure uniqueness
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 9)
  return `anon_${timestamp}_${random}`
}

export function clearAnonymousId(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(ANONYMOUS_ID_KEY)
}

export function isAnonymousIdValid(id: string): boolean {
  return id.startsWith('anon_') && id.length > 10
}