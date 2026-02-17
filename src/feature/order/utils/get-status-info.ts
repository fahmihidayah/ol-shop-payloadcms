import { CheckCircle2, XCircle, Clock, AlertCircle } from 'lucide-react'
import type { DuitkuResultCode, OrderStatusInfo } from '@/feature/order/types/order'

/**
 * Get status information for UI based on result code
 * @param resultCode - Result code from Duitku
 * @returns Status info object with icon, colors, title, description
 */
export function getStatusInfo(resultCode: DuitkuResultCode): OrderStatusInfo {
  switch (resultCode) {
    case '00':
      return {
        icon: CheckCircle2,
        iconColor: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        title: 'Payment Successful!',
        description: 'Your payment has been received and your order is being processed.',
        status: 'success',
      }
    case '01':
      return {
        icon: Clock,
        iconColor: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
        title: 'Payment Pending',
        description: 'Your payment is being processed. Please wait for confirmation.',
        status: 'pending',
      }
    case '02':
      return {
        icon: XCircle,
        iconColor: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        title: 'Payment Canceled',
        description: 'Your payment was canceled. You can try placing the order again.',
        status: 'canceled',
      }
    default:
      return {
        icon: AlertCircle,
        iconColor: 'text-gray-600',
        bgColor: 'bg-gray-50',
        borderColor: 'border-gray-200',
        title: 'Unknown Status',
        description: 'Unable to determine payment status.',
        status: 'unknown',
      }
  }
}
