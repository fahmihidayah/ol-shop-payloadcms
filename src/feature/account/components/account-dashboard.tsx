import { Customer } from '@/payload-types'
import { AccountProfileCard } from './account-profile-card'
import { OrderStatistics } from './order-statistics'
import { AccountQuickActions } from './account-quick-actions'

interface AccountDashboardProps {
  customer: Customer
  orderStats: {
    total: number
    pending: number
    completed: number
    cancelled: number
  }
}

export function AccountDashboard({ customer, orderStats }: AccountDashboardProps) {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h2 className="text-2xl font-bold">
          Welcome back, {customer.name?.split(' ')[0] || 'User'}!
        </h2>
        <p className="text-muted-foreground mt-1">Here&apos;s an overview of your account activity</p>
      </div>

      {/* Order Statistics */}
      <OrderStatistics stats={orderStats} />

      {/* Profile and Quick Actions */}
      <div className="flex flex-col gap-3">
        {/* Profile Card - Takes 2 columns */}
        <div className="lg:col-span-2">
          <AccountProfileCard customer={customer} />
        </div>

        {/* Quick Actions - Takes 1 column */}
        <div className="lg:col-span-1">
          <AccountQuickActions />
        </div>
      </div>
    </div>
  )
}
