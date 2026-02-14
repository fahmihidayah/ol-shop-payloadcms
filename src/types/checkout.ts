import { Order, OrderItem, Address, Customer } from '@/payload-types'

/**
 * Checkout item data
 */
export interface CheckoutItem {
  productId: string
  variantId: string
  productName: string
  variantName: string
  quantity: number
  price: number
  subtotal: number
}

/**
 * Checkout address data
 */
export interface CheckoutAddress {
  fullName: string
  phone: string
  address: string
  city: string
  state?: string
  postalCode: string
  country: string
  isDefault?: boolean
}

/**
 * Checkout data for creating order
 */
export interface CheckoutData {
  customerId?: string
  items: CheckoutItem[]
  shippingAddress: CheckoutAddress
  billingAddress?: CheckoutAddress
  paymentMethod: string
  subtotal: number
  shippingCost: number
  tax: number
  total: number
  notes?: string
}

/**
 * Order creation result
 */
export interface CreateOrderResult {
  success: boolean
  order?: Order
  orderId?: string
  error?: string
}

/**
 * Payment creation params
 */
export interface CreatePaymentParams {
  orderId: string
  amount: number
  paymentMethod: string
  customerEmail: string
  customerName: string
  customerPhone?: string
  productDetails: string
  items: CheckoutItem[]
  shippingAddress: CheckoutAddress
  billingAddress?: CheckoutAddress
}

/**
 * Payment result
 */
export interface PaymentResult {
  success: boolean
  paymentUrl?: string
  reference?: string
  vaNumber?: string
  error?: string
}
