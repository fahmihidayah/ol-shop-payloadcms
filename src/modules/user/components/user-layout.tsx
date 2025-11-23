'use client'

import { UserSidebar } from './user-sidebar'

interface UserLayoutProps {
  children: React.ReactNode
}

export function UserLayout({ children }: UserLayoutProps) {
  return (
    <div className="container mx-auto px-4 py-8 sm:py-12">
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        <UserSidebar />
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  )
}
