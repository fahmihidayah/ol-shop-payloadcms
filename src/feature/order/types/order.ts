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
 * Result of updating order
 */
export interface UpdateOrderResult {
  success: boolean
  order?: Order
  error?: string
}

/**
 * Result of getting order by order number
 */
export interface GetOrderResult {
  success: boolean
  order?: Order
  error?: string
}

/**
 * Duitku callback parameters (webhook payload)
 *
 * These are the parameters sent by Duitku when a payment status changes.
 * Documentation: https://docs.duitku.com/api/id/#callback
 */
export interface DuitkuCallbackParams {
  /** Merchant code from Duitku */
  merchantCode: string

  /** Payment amount */
  amount: number

  /** Your order number/reference */
  merchantOrderId: string

  /** Product detail/description sent to Duitku */
  productDetail: string

  /** Additional parameters sent during payment creation */
  additionalParam: string

  /** Payment result code (00 = success, 01 = failed) */
  resultCode: DuitkuCallbackResultCode

  /** Payment method code (e.g., "VC" for credit card, "VA" for virtual account) */
  paymentCode: string

  /** Duitku payment reference number */
  reference: string

  /** Security signature from Duitku (MD5 hash) */
  signature: string
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
