'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import type { PaymentOption } from '@/payload-types'
import { duitkuConfig, getDuitkuEndpoint, validateDuitkuConfig } from '@/lib/duitku-config'
import { generateDuitkuSignature, formatDuitkuDatetime } from '@/lib/duitku-utils'
import type { DuitkuPaymentMethod, DuitkuPaymentMethodResponse } from '@/types/duitku'

/**
 * Get payment methods from Duitku API
 * @param amount - Transaction amount to calculate fees
 * @returns Array of payment methods with fees
 */
export async function getDuitkuPaymentMethods(
  amount: number,
): Promise<DuitkuPaymentMethod[]> {
  try {
    // Validate configuration
    const configValidation = validateDuitkuConfig()
    if (!configValidation.valid) {
      console.error('[DUITKU] Configuration errors:', configValidation.errors)
      return []
    }

    const { merchantCode, apiKey } = duitkuConfig
    const datetime = formatDuitkuDatetime()
    const signature = generateDuitkuSignature(merchantCode, amount, datetime, apiKey)

    const endpoint = getDuitkuEndpoint('paymentMethod')

    const requestBody = {
      merchantcode: merchantCode,
      amount,
      datetime,
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

    const data: DuitkuPaymentMethodResponse = await response.json()

    if (data.responseCode !== '00') {
      console.error('[DUITKU] API Error:', data.responseMessage)
      return []
    }

    return data.paymentFee || []
  } catch (error) {
    console.error('[GET_DUITKU_PAYMENT_METHODS] Error:', error)
    return []
  }
}

/**
 * Get payment options from database
 * @returns Array of active payment options
 */
export async function getPaymentOptions(): Promise<PaymentOption[]> {
  try {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'payment-options',
      where: {
        isActive: { equals: true },
      },
      limit: 0,
      depth: 1,
    })

    return result.docs as PaymentOption[]
  } catch (error) {
    console.error('[GET_PAYMENT_OPTIONS] Error:', error)
    return []
  }
}

/**
 * Get payment options from Duitku API only
 * @param amount - Transaction amount for calculating Duitku fees
 * @returns Array of Duitku payment methods
 */
export async function getCombinedPaymentOptions(
  amount: number,
): Promise<DuitkuPaymentMethod[]> {
  try {
    // Use Duitku payment methods only
    const duitkuMethods = await getDuitkuPaymentMethods(amount)
    return duitkuMethods
  } catch (error) {
    console.error('[GET_COMBINED_PAYMENT_OPTIONS] Error:', error)
    return []
  }
}
