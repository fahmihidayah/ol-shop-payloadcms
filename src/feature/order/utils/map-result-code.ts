import type {
  DuitkuResultCode,
  DuitkuCallbackResultCode,
  OrderStatus,
  PaymentStatus,
} from '@/feature/order/types/order'

/**
 * Map Duitku return URL result code to order and payment status
 * @param resultCode - Result code from return URL (00, 01, 02)
 * @returns Object with order status and payment status
 */
export function mapReturnUrlResultCode(resultCode: DuitkuResultCode): {
  orderStatus: OrderStatus
  paymentStatus: PaymentStatus
} {
  switch (resultCode) {
    case '00':
      // Success - but wait for callback confirmation
      return {
        orderStatus: 'processing',
        paymentStatus: 'paid',
      }
    case '01':
      // Pending - waiting for payment
      return {
        orderStatus: 'pending',
        paymentStatus: 'pending',
      }
    case '02':
      // Canceled by user
      return {
        orderStatus: 'cancelled',
        paymentStatus: 'failed',
      }
  }
}

/**
 * Map Duitku callback result code to order and payment status
 * @param resultCode - Result code from callback (00, 01)
 * @returns Object with order status and payment status
 */
export function mapCallbackResultCode(resultCode: DuitkuCallbackResultCode): {
  orderStatus: OrderStatus
  paymentStatus: PaymentStatus
} {
  if (resultCode === '00') {
    // Payment successful
    return {
      orderStatus: 'processing',
      paymentStatus: 'paid',
    }
  } else {
    // Payment failed (resultCode === '01')
    return {
      orderStatus: 'cancelled',
      paymentStatus: 'failed',
    }
  }
}
