import { getMeUser } from '@/lib/customer-utils'
import { AccountDashboard } from '@/feature/account/components'
import { getOrderStatistics } from '@/feature/account/actions'
import { redirect } from 'next/navigation'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Account | Online Store',
  description: 'Manage your account, orders, and preferences',
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
