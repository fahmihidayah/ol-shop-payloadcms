import { ReactNode } from 'react'
import { UserLayout } from '@/modules/user/components/user-layout'

export default function UserRootLayout({ children }: { children: ReactNode }) {
  return <UserLayout>{children}</UserLayout>
}
