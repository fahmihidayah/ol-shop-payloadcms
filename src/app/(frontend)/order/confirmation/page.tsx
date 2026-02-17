import { OrderConfirmation } from '@/feature/order/components/order-confirmation'
import { updateOrderFromReturnUrl } from '@/feature/order/actions/update-order'
import { redirect } from 'next/navigation'
import type { DuitkuResultCode } from '@/feature/order/types/order'
import type { OrderItem } from '@/payload-types'
import { getPayload } from 'payload'
import config from '@payload-config'

interface OrderConfirmationPageProps {
  searchParams: Promise<{
    merchantOrderId?: string
    resultCode?: string
    reference?: string
  }>
}

/**
 * Validate if result code is valid
 */
function isValidResultCode(code: string): code is DuitkuResultCode {
  return ['00', '01', '02'].includes(code)
}

export default async function OrderConfirmationPage({ searchParams }: OrderConfirmationPageProps) {
  const { merchantOrderId, resultCode, reference } = await searchParams

  // Validate required parameters
  if (!merchantOrderId || !resultCode || !reference) {
    redirect('/')
  }

  // Validate result code format
  if (!isValidResultCode(resultCode)) {
    redirect('/')
  }

  // Update order status based on result code
  const result = await updateOrderFromReturnUrl(merchantOrderId, resultCode, reference)

  // If order not found, redirect to home
  // if (!result.success) {
  //   console.error('[ORDER_CONFIRMATION] Failed to update order:', result.error)
  //   redirect('/')
  // }

  // Fetch order items if order exists
  let orderItems: OrderItem[] = []
  if (result.order) {
    const payload = await getPayload({ config })
    const itemsResult = await payload.find({
      collection: 'order-items',
      where: {
        order: {
          equals: result.order.id,
        },
      },
      depth: 2, // Include product details
    })
    orderItems = itemsResult.docs
  }

  return (
    <OrderConfirmation
      resultCode={resultCode}
      merchantOrderId={merchantOrderId}
      reference={reference}
      order={result.order || null}
      orderItems={orderItems}
    />
  )
}
