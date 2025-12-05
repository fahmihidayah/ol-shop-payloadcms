import { Address, CartItem, PaymentOption } from '@/payload-types'

export type CheckoutSummary = {
  cartItems: CartItem[]
  paymentOptions: PaymentOption[]
  addressOptions: Address[]
  selectedAddressId?: string
  calculations: {
    subtotal: number
    tax: number
    shippingCost: number
    processingFee: number
    total: number
  }
}
