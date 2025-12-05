import type { PaymentOption } from '@/payload-types'

// Minimal cart item interface for calculations
interface CalculationCartItem {
  subtotal: number
}

/**
 * Calculate subtotal from cart items
 */
export function calculateSubtotal(items: CalculationCartItem[]): number {
  return items.reduce((sum, item) => sum + item.subtotal, 0)
}

/**
 * Calculate tax (10% of each product)
 * Tax is calculated on the subtotal before shipping
 */
export function calculateTax(subtotal: number, taxRate: number = 0.1): number {
  return subtotal * taxRate
}

/**
 * Calculate shipping cost
 * Flat rate of 20,000 IDR
 * Can be made dynamic in the future
 */
export function calculateShippingCost(
  subtotal: number,
  options?: {
    freeShippingThreshold?: number
    flatRate?: number
  },
): number {
  const { freeShippingThreshold = 500000, flatRate = 20000 } = options || {}

  // Free shipping if subtotal exceeds threshold
  if (subtotal >= freeShippingThreshold) {
    return 0
  }

  return flatRate
}

/**
 * Calculate processing fee based on payment method
 * Fee is percentage of (subtotal + shipping + tax)
 */
export function calculateProcessingFee(
  baseAmount: number,
  paymentOption?: PaymentOption,
): number {
  if (!paymentOption || !paymentOption.processingFee) {
    return 0
  }

  return baseAmount * (paymentOption.processingFee / 100)
}

/**
 * Calculate all totals for checkout
 */
export function calculateCheckoutTotals(
  items: CalculationCartItem[],
  paymentOption?: PaymentOption,
  options?: {
    taxRate?: number
    freeShippingThreshold?: number
    shippingFlatRate?: number
  },
) {
  const { taxRate = 0.1 } = options || {}

  // Calculate subtotal
  const subtotal = calculateSubtotal(items)

  // Calculate tax on subtotal
  const tax = calculateTax(subtotal, taxRate)

  // Calculate shipping
  const shippingCost = calculateShippingCost(subtotal, {
    freeShippingThreshold: options?.freeShippingThreshold,
    flatRate: options?.shippingFlatRate,
  })

  // Calculate processing fee on (subtotal + shipping + tax)
  const baseAmountForFee = subtotal + shippingCost + tax
  const processingFee = calculateProcessingFee(baseAmountForFee, paymentOption)

  // Calculate final total
  const total = subtotal + tax + shippingCost + processingFee

  return {
    subtotal,
    tax,
    shippingCost,
    processingFee,
    total,
  }
}
