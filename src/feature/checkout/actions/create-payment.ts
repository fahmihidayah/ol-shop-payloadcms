'use server'

import { duitkuConfig, getDuitkuEndpoint } from '@/lib/duitku-config'
import { generateTransactionSignature, calculateExpiryPeriod } from '@/lib/duitku-utils'
import type {
  DuitkuTransactionRequest,
  DuitkuTransactionResponse,
  DuitkuItemDetail,
  DuitkuCustomerDetail,
} from '@/types/duitku'
import type { CreatePaymentParams, PaymentResult, CheckoutData } from '@/types/checkout'
import { createOrder, updateOrderPayment } from './create-order'

/**
 * Process complete checkout: Create order THEN initiate payment
 * This ensures we have a valid order before payment
 * @param checkoutData - Complete checkout information
 * @returns Payment result with payment URL
 */
export async function processCheckout(checkoutData: CheckoutData): Promise<PaymentResult> {
  try {
    // Step 1: Create order in database first
    const orderResult = await createOrder(checkoutData)

    if (!orderResult.success || !orderResult.orderId || !orderResult.order) {
      return {
        success: false,
        error: orderResult.error || 'Failed to create order',
      }
    }

    // Step 2: Prepare item details for Duitku
    const itemDetails: DuitkuItemDetail[] = checkoutData.items.map((item) => ({
      name: `${item.productName} - ${item.variantName}`,
      price: item.price,
      quantity: item.quantity,
    }))

    // Step 3: Prepare customer details
    const [firstName, ...lastNameParts] = checkoutData.shippingAddress.fullName.split(' ')
    const lastName = lastNameParts.join(' ')

    const customerDetail: DuitkuCustomerDetail = {
      firstName,
      lastName: lastName || undefined,
      email: checkoutData.customerId || 'guest@example.com', // You should pass email in checkoutData
      phoneNumber: checkoutData.shippingAddress.phone,
      shippingAddress: {
        firstName,
        lastName: lastName || undefined,
        address: checkoutData.shippingAddress.address,
        city: checkoutData.shippingAddress.city,
        postalCode: checkoutData.shippingAddress.postalCode,
        phone: checkoutData.shippingAddress.phone,
        countryCode: checkoutData.shippingAddress.country || 'ID',
      },
    }

    // Add billing address if different
    if (checkoutData.billingAddress) {
      const [billingFirstName, ...billingLastNameParts] =
        checkoutData.billingAddress.fullName.split(' ')
      const billingLastName = billingLastNameParts.join(' ')

      customerDetail.billingAddress = {
        firstName: billingFirstName,
        lastName: billingLastName || undefined,
        address: checkoutData.billingAddress.address,
        city: checkoutData.billingAddress.city,
        postalCode: checkoutData.billingAddress.postalCode,
        phone: checkoutData.billingAddress.phone,
        countryCode: checkoutData.billingAddress.country || 'ID',
      }
    }

    // Step 4: Create payment with Duitku
    const productDetails = checkoutData.items
      .map((item) => `${item.productName} (${item.variantName}) x${item.quantity}`)
      .join(', ')

    const paymentResult = await createDuitkuPayment({
      orderId: orderResult.order.orderNumber, // Use order number, not ID
      amount: Math.round(checkoutData.total), // Ensure no decimals
      paymentMethod: checkoutData.paymentMethod,
      customerEmail: customerDetail.email,
      customerName: checkoutData.shippingAddress.fullName,
      customerPhone: checkoutData.shippingAddress.phone,
      productDetails,
      itemDetails: [
        ...itemDetails,
        {
          name: 'shippingCost',
          price: checkoutData.shippingCost,
          quantity: 1,
        },
      ],
      customerDetail,
    })

    if (!paymentResult.success || !paymentResult.data) {
      return {
        success: false,
        error: paymentResult.error || 'Failed to create payment',
      }
    }

    // Step 5: Update order with payment reference
    await updateOrderPayment(
      orderResult.orderId,
      paymentResult.data.reference,
      paymentResult.data.vaNumber,
    )

    // Step 6: Return payment URL for redirect
    return {
      success: true,
      paymentUrl: paymentResult.data.paymentUrl,
      reference: paymentResult.data.reference,
      vaNumber: paymentResult.data.vaNumber,
    }
  } catch (error) {
    console.error('[PROCESS_CHECKOUT] Error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to process checkout',
    }
  }
}

/**
 * Create payment transaction with Duitku (low-level function)
 * @param params - Transaction parameters
 * @returns Payment response with payment URL
 */
export async function createDuitkuPayment(params: {
  orderId: string
  amount: number
  paymentMethod: string
  customerEmail: string
  customerName: string
  customerPhone?: string
  productDetails: string
  itemDetails?: DuitkuItemDetail[]
  customerDetail?: DuitkuCustomerDetail
}): Promise<{
  success: boolean
  data?: DuitkuTransactionResponse
  error?: string
}> {
  try {
    const { merchantCode, apiKey, callbackUrl, returnUrl, expiryPeriod } = duitkuConfig

    // Generate signature
    const signature = generateTransactionSignature(
      merchantCode,
      params.orderId,
      params.amount,
      apiKey,
    )

    // Prepare request body
    const requestBody: DuitkuTransactionRequest = {
      merchantCode,
      paymentAmount: params.amount,
      paymentMethod: params.paymentMethod,
      merchantOrderId: params.orderId,
      productDetails: params.productDetails,
      email: params.customerEmail,
      phoneNumber: params.customerPhone,
      customerVaName: params.customerName,
      callbackUrl,
      returnUrl,
      signature,
      expiryPeriod: calculateExpiryPeriod(expiryPeriod),
    }

    // Add optional details if provided
    if (params.itemDetails) {
      requestBody.itemDetails = params.itemDetails
    }

    if (params.customerDetail) {
      requestBody.customerDetail = params.customerDetail
    }

    const endpoint = getDuitkuEndpoint('inquiry')

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })

    // console.log('response : ', JSON.stringify(requestBody), await response.json())
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data: DuitkuTransactionResponse = await response.json()

    if (data.statusCode !== '00') {
      return {
        success: false,
        error: data.statusMessage || 'Payment creation failed',
      }
    }

    return {
      success: true,
      data,
    }
  } catch (error) {
    console.error('[CREATE_DUITKU_PAYMENT] Error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create payment',
    }
  }
}

/**
 * Check transaction status
 * @param merchantOrderId - Order ID from merchant
 * @returns Transaction status
 */
export async function checkDuitkuTransactionStatus(merchantOrderId: string): Promise<{
  success: boolean
  data?: any
  error?: string
}> {
  try {
    const { merchantCode, apiKey } = duitkuConfig
    const endpoint = getDuitkuEndpoint('checkTransaction')

    const signature = generateTransactionSignature(merchantCode, merchantOrderId, 0, apiKey)

    const requestBody = {
      merchantCode,
      merchantOrderId,
      signature,
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    return {
      success: true,
      data,
    }
  } catch (error) {
    console.error('[CHECK_DUITKU_TRANSACTION] Error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to check transaction status',
    }
  }
}
