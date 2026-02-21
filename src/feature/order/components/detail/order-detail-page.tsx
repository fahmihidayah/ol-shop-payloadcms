import { Order, OrderItem } from '@/payload-types'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { OrderHeader } from './order-header'
import { DeliveryAddressCard } from './delivery-address-card'
import { DeliveryStatusCard } from './delivery-status-card'
import { OrderItemsCard } from './order-items-card'
import { OrderSummaryCard } from './order-summary-card'

interface OrderDetailPageProps {
  order: Order
  orderItems: OrderItem[]
}

export function OrderDetailPage({ order, orderItems }: OrderDetailPageProps) {
  // Calculate subtotal from order items
  const itemsSubtotal = orderItems.reduce((sum, item) => sum + item.subtotal, 0)

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Back Button */}
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/account/orders">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Orders
        </Link>
      </Button>

      {/* Header */}
      <OrderHeader order={order} />

      {/* Main Content */}
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Left Column - Order Items */}
        <div className="lg:col-span-2 space-y-6">
          <OrderItemsCard items={orderItems} />
        </div>

        {/* Right Column - Info Cards */}
        <div className="space-y-6">
          <OrderSummaryCard order={order} itemsSubtotal={itemsSubtotal} />
          <DeliveryStatusCard order={order} />
          <DeliveryAddressCard shippingAddress={order.shippingAddress} />
        </div>
      </div>
    </div>
  )
}
