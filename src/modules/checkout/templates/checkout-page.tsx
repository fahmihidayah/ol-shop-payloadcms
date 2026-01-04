'use client'

import { useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useCartItems, useUserStore, useCheckoutStore } from '@/store'
import { CheckoutItem } from '../components/checkout-item'
import { AddressSelector } from '../components/address-selector'
import { PaymentSelector, type PaymentOption } from '../components/payment-selector'
import { CheckoutSummary } from '../components/checkout-summary'
import { GuestInfoForm } from '../components/guest-info-form'
import { OrderNotes } from '../components/order-notes'
import { ShoppingCart } from 'lucide-react'
import type { Address } from '@/payload-types'
import { calculateCheckoutTotals } from '../utils/calculations'

interface CheckoutPageProps {
  addresses: Address[]
  paymentOptions: PaymentOption[]
}

export function CheckoutPage({ addresses: initialAddresses, paymentOptions }: CheckoutPageProps) {
  const router = useRouter()
  const cartItems = useCartItems()
  const { isAuthenticated } = useUserStore()

  // Checkout store
  const {
    addresses,
    selectedAddressId,
    selectedPaymentId,
    guestInfo,
    orderNotes,
    isLoading,
    setGuestInfo,
    setOrderNotes,
    setSelectedPaymentId,
    handleSelectAddress,
    handleAddAddress,
    handlePlaceOrder,
    initialize,
  } = useCheckoutStore()

  // Initialize store with server data on mount
  useEffect(() => {
    initialize(initialAddresses, paymentOptions)
  }, [initialAddresses, paymentOptions, initialize])

  // Calculate totals
  const totals = useMemo(() => {
    const selectedPayment = paymentOptions.find((p) => String(p.id) === selectedPaymentId)

    return calculateCheckoutTotals(cartItems, selectedPayment as any, {
      taxRate: 0.1,
      freeShippingThreshold: 500000,
      shippingFlatRate: 20000,
    })
  }, [cartItems, selectedPaymentId, paymentOptions])

  // Handlers
  const onAddAddress = (data: any) => handleAddAddress(data, () => router.refresh())
  const onPlaceOrder = () =>
    handlePlaceOrder(isAuthenticated, cartItems.length, (orderId: string) =>
      router.push(`/orders/${orderId}`),
    )

  // Show empty cart state
  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto text-center">
          <ShoppingCart className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">Add items to your cart to checkout</p>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            Continue Shopping
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Checkout</h1>
        <p className="text-muted-foreground mt-2">Complete your purchase</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-card rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4">Order Items ({cartItems.length})</h3>
            <div className="divide-y">
              {cartItems.map((item) => (
                <CheckoutItem key={item.id} item={item} />
              ))}
            </div>
          </div>

          {/* Guest Info - Only show for guest users */}
          {!isAuthenticated && (
            <div className="bg-card rounded-lg border p-6">
              <GuestInfoForm onDataChange={setGuestInfo} defaultValues={guestInfo || undefined} />
            </div>
          )}

          {/* Shipping Address */}
          <div className="bg-card rounded-lg border p-6">
            <AddressSelector
              addresses={addresses}
              selectedAddressId={selectedAddressId}
              onSelectAddress={handleSelectAddress}
              onAddAddress={onAddAddress}
            />
          </div>

          {/* Payment Method */}
          <div className="bg-card rounded-lg border p-6">
            <PaymentSelector
              paymentOptions={paymentOptions}
              selectedPaymentId={selectedPaymentId}
              onSelectPayment={setSelectedPaymentId}
            />
          </div>

          {/* Order Notes - Optional */}
          <div className="bg-card rounded-lg border">
            <OrderNotes value={orderNotes} onChange={setOrderNotes} />
          </div>
        </div>

        {/* Right Column - Summary */}
        <div className="lg:col-span-1">
          <CheckoutSummary
            {...totals}
            onPlaceOrder={onPlaceOrder}
            isLoading={isLoading}
            disabled={!selectedAddressId || !selectedPaymentId}
          />
        </div>
      </div>
    </div>
  )
}
