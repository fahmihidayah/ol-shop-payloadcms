'use client'

import { ReactNode } from 'react'
import { AccountSidebar } from './account-sidebar'
import { Customer } from '@/payload-types'

interface AccountLayoutProps {
  children: ReactNode
  customer?: Customer
}

export function AccountLayout({ children, customer }: AccountLayoutProps) {
  const userName = customer?.name || 'Guest'
  const userEmail = customer?.email

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">My Account</h1>
        <p className="text-muted-foreground mt-1">Manage your account, orders, and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 ">
        {/* Sidebar */}
        <aside className="lg:col-span-1 ">
          <AccountSidebar
            isGuest={customer === undefined}
            userName={userName}
            userEmail={userEmail}
          />
        </aside>

        {/* Main Content */}
        <main className="lg:col-span-3">{children}</main>
      </div>
    </div>
  )
}
