import { Address, Cart, PaymentOption } from '@/payload-types'
import { create } from 'zustand'

interface CheckoutState {
  address: Address | null
  setAddress: (address: Address) => void
  paymentMethod: PaymentOption | null
  setPaymentMethod: (method: PaymentOption) => void
  cart: Cart | null
  setCart: (cart: Cart) => void
}

export const useChekoutStore = create<CheckoutState>((set) => ({
  address: null,
  setAddress: (address: Address) => set({ address }),
  paymentMethod: null,
  setPaymentMethod: (method: PaymentOption) => set({ paymentMethod: method }),
  cart: null,
  setCart: (cart: Cart) => set({ cart }),
}))
