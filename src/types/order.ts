import type { Order } from '@/payload-types'

/**
 * Duitku Result Codes (from return URL)
 * - 00: Success - Payment completed successfully
 * - 01: Pending - Payment is still being processed
 * - 02: Canceled - Payment was canceled by user
 */
export type DuitkuResultCode = '00' | '01' | '02'

/**
 * Duitku Transaction Status Codes (from API check)
 * - 00: Success - Transaction successful
 * - 01: Process - Transaction in process
 * - 02: Failed/Expired - Transaction failed or expired
 */
export type DuitkuStatusCode = '00' | '01' | '02'

/**
 * Duitku Callback Result Codes (from webhook)
 * - 00: Success - Payment successful
 * - 01: Failed - Payment failed
 */
export type DuitkuCallbackResultCode = '00' | '01'

/**
 * Order status type (from PayloadCMS schema)
 */
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'

/**
 * Payment status type (from PayloadCMS schema)
 */
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'

/**
 * Result of getting order by order number
 */
export interface GetOrderResult {
  success: boolean
  order?: Order
  error?: string
}

/**
 * Result of updating order
 */
export interface UpdateOrderResult {
  success: boolean
  order?: Order
  error?: string
}

/**
 * Duitku callback parameters
 */
export interface DuitkuCallbackParams {
  merchantCode: string
  amount: number
  merchantOrderId: string
  reference: string
  signature: string
  resultCode: DuitkuCallbackResultCode
}

/**
 * Order confirmation status info for UI
 */
export interface OrderStatusInfo {
  icon: any // Lucide icon component
  iconColor: string
  bgColor: string
  borderColor: string
  title: string
  description: string
  status: 'success' | 'pending' | 'canceled' | 'unknown'
}
