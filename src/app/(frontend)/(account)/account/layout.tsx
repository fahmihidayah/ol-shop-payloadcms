import { getMeUser } from '@/lib/customer-utils'
import { AccountLayout } from '@/feature/account/components'
import { redirect } from 'next/navigation'

export default async function AccountLayoutPage({ children }: { children: React.ReactNode }) {
  const { user } = await getMeUser()

  // Redirect to login if not authenticated
  // if (!user) {
  //   redirect('/login?redirect=/account')
  // }

  return <AccountLayout customer={user}>{children}</AccountLayout>
}
