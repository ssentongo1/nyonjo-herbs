const ADMIN_SESSION_KEY = 'nyonjo_admin_session'

// Simple password check for now (we'll implement proper auth later)
const ADMIN_PASSWORD = 'admin123' // Change this to your desired password

export async function verifyAdminPassword(email: string, password: string): Promise<boolean> {
  // Simple check for now
  return email === 'admin@nyonjoherbs.com' && password === ADMIN_PASSWORD
}

export function createAdminSession() {
  if (typeof window !== 'undefined') {
    const session = {
      id: 'admin',
      timestamp: Date.now(),
      expires: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    }
    localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session))
    return true
  }
  return false
}

export function checkAdminSession(): boolean {
  if (typeof window !== 'undefined') {
    const sessionStr = localStorage.getItem(ADMIN_SESSION_KEY)
    if (!sessionStr) return false
    
    try {
      const session = JSON.parse(sessionStr)
      return session.expires > Date.now()
    } catch {
      return false
    }
  }
  return false
}

export function clearAdminSession() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(ADMIN_SESSION_KEY)
  }
}