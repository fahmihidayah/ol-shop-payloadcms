import { getCart } from '@/feature/cart/actions'
import { getListAddresses } from '@/feature/account/actions/addresses/get-list-address'
import { getCombinedPaymentOptions } from '@/feature/order/actions/checkout/payment-options'
// import { CheckoutPageClient } from '@/feature/checkout/components/checkout-page'
import { redirect } from 'next/navigation'
import { CheckoutPageClient } from '@/feature/order/components/checkout/checkout-page'

export default async function CheckoutPage() {
  const [cart, addresses] = await Promise.all([getCart(), getListAddresses()])

  if (!cart || cart.items.length === 0) {
    redirect('/cart')
  }

  // Get Duitku payment methods based on cart total
  const paymentOptions = await getCombinedPaymentOptions(cart.totalPrice)

  return (
    <CheckoutPageClient
      addresses={addresses}
      items={cart.items}
      totalItems={cart.totalItems}
      totalPrice={cart.totalPrice}
      shipingCost={cart.shipping}
      paymentOptions={paymentOptions}
    />
  )
}
