import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin | Nyonjo Herbs',
  description: 'Admin dashboard for Nyonjo Herbs',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}