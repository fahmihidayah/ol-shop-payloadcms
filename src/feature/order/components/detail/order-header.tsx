import { Order } from '@/payload-types'
import { Package } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface OrderHeaderProps {
  order: Order
}

export function OrderHeader({ order }: OrderHeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-primary/10 p-3">
          <Package className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Order Details</h1>
          <p className="text-sm text-muted-foreground">Order #{order.orderNumber}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm text-muted-foreground">Order Date</p>
        <p className="font-medium">{formatDate(order.createdAt)}</p>
      </div>
    </div>
  )
}
