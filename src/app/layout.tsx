import type { Metadata } from 'next'
import './globals.css'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Nyonjo Herbs | Herbal Wellness for Women',
  description: 'A safe, anonymous space for women to discover herbal wellness solutions, shop quality herbs, and connect in a supportive community.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-cream">
        <Navigation />
        
        {/* Main Content */}
        <main className="min-h-screen overflow-x-hidden">{children}</main>
        
        <Footer />
      </body>
    </html>
  )
}