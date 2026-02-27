import { Badge } from '@/components/ui/badge'
import { OrderStatus, PaymentStatus } from '../../types/order'

interface OrderStatusBadgeProps {
  status: OrderStatus
}

interface PaymentStatusBadgeProps {
  status: PaymentStatus
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const variants: Record<OrderStatus, { label: string; className: string }> = {
    pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' },
    processing: {
      label: 'Processing',
      className: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
    },
    shipped: { label: 'Shipped', className: 'bg-purple-100 text-purple-800 hover:bg-purple-100' },
    delivered: {
      label: 'Delivered',
      className: 'bg-green-100 text-green-800 hover:bg-green-100',
    },
    cancelled: { label: 'Cancelled', className: 'bg-red-100 text-red-800 hover:bg-red-100' },
  }

  const variant = variants[status] || variants.pending

  return <Badge className={variant.className}>{variant.label}</Badge>
}

export function PaymentStatusBadge({ status }: PaymentStatusBadgeProps) {
  const variants: Record<PaymentStatus, { label: string; className: string }> = {
    pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' },
    paid: { label: 'Paid', className: 'bg-green-100 text-green-800 hover:bg-green-100' },
    failed: { label: 'Failed', className: 'bg-red-100 text-red-800 hover:bg-red-100' },
    refunded: { label: 'Refunded', className: 'bg-gray-100 text-gray-800 hover:bg-gray-100' },
  }

  const variant = variants[status] || variants.pending

  return <Badge className={variant.className}>{variant.label}</Badge>
}
