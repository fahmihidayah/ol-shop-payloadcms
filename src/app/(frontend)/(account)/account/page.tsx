import { getMeUser } from '@/lib/customer-utils'
import { AccountDashboard } from '@/feature/account/components'
import { getOrderStatistics } from '@/feature/account/actions'
import { redirect } from 'next/navigation'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Account Dashboard | Online Store',
  description:
    'Access your personal account dashboard to manage orders, track shipments, update addresses, and view your order history. Your complete account management center.',
  keywords: [
    'my account',
    'account dashboard',
    'order history',
    'track orders',
    'manage account',
    'user profile',
  ],
  openGraph: {
    title: 'My Account Dashboard | Online Store',
    description:
      'Manage your orders, addresses, and account settings in one convenient location.',
    type: 'website',
  },
  robots: {
    index: false, // Account pages should not be indexed
    follow: true,
  },
}

export default async function AccountPage() {
  const { user } = await getMeUser()

  // Redirect to login if not authenticated
  // if (!user) {
  //   redirect('/login?redirect=/account')
  // }

  // Fetch order statistics
  const orderStats = await getOrderStatistics()

  return <AccountDashboard customer={user} orderStats={orderStats} />
}
