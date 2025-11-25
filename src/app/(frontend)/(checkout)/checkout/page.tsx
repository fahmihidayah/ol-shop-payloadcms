import { CheckoutPage } from '@/modules/checkout/templates/checkout-page'
import { getAddresses } from '@/modules/addresses/actions'
import { getPaymentOptions, placeOrder } from '@/modules/checkout/actions'

export default async function Checkout() {
  const { addresses } = await getAddresses()
  const { paymentOptions } = await getPaymentOptions()

  return (
    <CheckoutPage
      addresses={addresses}
      paymentOptions={paymentOptions as any}
      onPlaceOrder={placeOrder}
    />
  )
}
