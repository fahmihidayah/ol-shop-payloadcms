import { create } from 'zustand'
import type { Address } from '@/payload-types'
import type { PaymentOption } from '@/modules/checkout/components/payment-selector'
import type { GuestInfoFormData } from '@/modules/checkout/components/guest-info-form'
import { toast } from 'sonner'
import { createAddress } from '@/modules/addresses/actions'
import { selectAddress, placeOrder } from '@/modules/checkout/actions'
import type { AddressFormData } from '@/modules/addresses/components'

interface CheckoutState {
  // Data state
  addresses: Address[]
  selectedAddressId: string
  paymentOptions: PaymentOption[]
  selectedPaymentId: string
  guestInfo: GuestInfoFormData | null
  orderNotes: string
  isLoading: boolean

  // Actions - State setters
  setAddresses: (addresses: Address[]) => void
  setSelectedAddressId: (id: string) => void
  setPaymentOptions: (options: PaymentOption[]) => void
  setSelectedPaymentId: (id: string) => void
  setGuestInfo: (info: GuestInfoFormData | null) => void
  setOrderNotes: (notes: string) => void
  setIsLoading: (loading: boolean) => void

  // Actions - Business logic
  handleSelectAddress: (addressId: string) => Promise<void>
  handleAddAddress: (data: AddressFormData, onSuccess: () => void) => Promise<void>
  handlePlaceOrder: (
    isAuthenticated: boolean,
    cartItemsCount: number,
    onSuccess: (orderId: string) => void,
  ) => Promise<void>

  // Reset state
  reset: () => void
  initialize: (addresses: Address[], paymentOptions: PaymentOption[]) => void
}

const initialState = {
  addresses: [],
  selectedAddressId: '',
  paymentOptions: [],
  selectedPaymentId: '',
  guestInfo: null,
  orderNotes: '',
  isLoading: false,
}

export const useCheckoutStore = create<CheckoutState>((set, get) => ({
  ...initialState,

  // State setters
  setAddresses: (addresses) => set({ addresses }),
  setSelectedAddressId: (id) => set({ selectedAddressId: id }),
  setPaymentOptions: (options) => set({ paymentOptions: options }),
  setSelectedPaymentId: (id) => set({ selectedPaymentId: id }),
  setGuestInfo: (info) => set({ guestInfo: info }),
  setOrderNotes: (notes) => set({ orderNotes: notes }),
  setIsLoading: (loading) => set({ isLoading: loading }),

  // Business logic actions
  handleSelectAddress: async (addressId: string) => {
    set({ selectedAddressId: addressId })

    // Save selected address to cart
    const result = await selectAddress(addressId)
    if (!result.success) {
      toast.error(result.message || 'Failed to select address')
    }
  },

  handleAddAddress: async (data: AddressFormData, onSuccess: () => void) => {
    const result = await createAddress(data)

    if (result.success && result.addressId) {
      toast.success('Address added successfully')

      // Auto-select the newly created address
      await get().handleSelectAddress(result.addressId)

      // Call success callback (router.refresh to update addresses list)
      onSuccess()
    } else {
      toast.error(result.message || 'Failed to add address')
      throw new Error(result.message)
    }
  },

  handlePlaceOrder: async (
    isAuthenticated: boolean,
    cartItemsCount: number,
    onSuccess: (orderId: string) => void,
  ) => {
    const state = get()

    // Validation
    if (!state.selectedAddressId) {
      toast.error('Please select a shipping address')
      return
    }

    if (!state.selectedPaymentId) {
      toast.error('Please select a payment method')
      return
    }

    if (cartItemsCount === 0) {
      toast.error('Your cart is empty')
      return
    }

    // Validate guest info if not authenticated
    if (!isAuthenticated && !state.guestInfo) {
      toast.error('Please provide your contact information')
      return
    }

    set({ isLoading: true })

    try {
      const result = await placeOrder(state.selectedPaymentId, {
        guestInfo: !isAuthenticated && state.guestInfo ? state.guestInfo : undefined,
        notes: state.orderNotes || undefined,
      })

      if (result.success && result.orderId) {
        toast.success('Order placed successfully!')
        onSuccess(result.orderId)
      } else {
        toast.error(result.message || 'Failed to place order')
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to place order')
    } finally {
      set({ isLoading: false })
    }
  },

  // Initialize with server data
  initialize: (addresses: Address[], paymentOptions: PaymentOption[]) => {
    const defaultPaymentId = paymentOptions.find((p) => p.isActive)?.id || ''

    set({
      addresses,
      selectedAddressId: addresses[0]?.id || '',
      paymentOptions,
      selectedPaymentId: defaultPaymentId,
    })
  },

  // Reset all state
  reset: () => set(initialState),
}))

// Export for backward compatibility (note the typo in the old export)
export const useChekoutStore = useCheckoutStore
