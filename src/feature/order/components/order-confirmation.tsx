'use client'

import type { Order, OrderItem } from '@/payload-types'
import type { DuitkuResultCode } from '@/types/order'
import { getStatusInfo } from '../utils/get-status-info'
import { OrderLoadingState } from './order-loading-state'
import { OrderStatusCard } from './order-status-card'
import { OrderDetailsCard } from './order-details-card'
import { OrderItemsCard } from './order-items-card'
import { ShippingAddressCard } from './shipping-address-card'
import { OrderActionButtons } from './order-action-buttons'
import { OrderInfoCard } from './order-info-card'

interface OrderConfirmationProps {
  resultCode: DuitkuResultCode
  merchantOrderId: string
  reference: string
  order: Order | null
  orderItems?: OrderItem[]
  isLoading?: boolean
}

export function OrderConfirmation({
  resultCode,
  merchantOrderId,
  reference,
  order,
  orderItems = [],
  isLoading = false,
}: OrderConfirmationProps) {
  if (isLoading) {
    return <OrderLoadingState />
  }

  const statusInfo = getStatusInfo(resultCode)

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Status Card */}
        <OrderStatusCard statusInfo={statusInfo} />

        {/* Order Details Card */}
        {order && <OrderDetailsCard order={order} reference={reference} />}

        {/* Order Items Card */}
        {orderItems.length > 0 && <OrderItemsCard orderItems={orderItems} />}

        {/* Shipping Address Card */}
        {order && order.shippingAddress && (
          <ShippingAddressCard shippingAddress={order.shippingAddress} />
        )}

        {/* Action Buttons */}
        <OrderActionButtons status={statusInfo.status} orderId={order?.id} />

        {/* Additional Information */}
        <OrderInfoCard status={statusInfo.status} />
      </div>
    </div>
  )
}
