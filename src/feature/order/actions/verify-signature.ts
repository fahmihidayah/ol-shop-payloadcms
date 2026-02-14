'use server'

import CryptoJS from 'crypto-js'

/**
 * Verify Duitku callback signature
 * @param merchantCode - Merchant code
 * @param amount - Transaction amount
 * @param merchantOrderId - Order number
 * @param apiKey - API key
 * @param signature - Signature from Duitku
 * @returns true if signature is valid
 */
export async function verifyDuitkuSignature(
  merchantCode: string,
  amount: number,
  merchantOrderId: string,
  apiKey: string,
  signature: string,
): Promise<boolean> {
  const data = `${merchantCode}${amount}${merchantOrderId}${apiKey}`
  const calculatedSignature = CryptoJS.MD5(data).toString()
  return calculatedSignature === signature
}
