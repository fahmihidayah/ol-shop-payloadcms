import CryptoJS from 'crypto-js'

/**
 * Generate signature for Duitku API requests
 * @param merchantCode - Merchant code from Duitku
 * @param amount - Transaction amount (no decimals)
 * @param datetime - Current datetime in format yyyy-MM-dd HH:mm:ss
 * @param apiKey - API key from Duitku
 * @returns SHA256 hash signature
 */
export function generateDuitkuSignature(
  merchantCode: string,
  amount: number,
  datetime: string,
  apiKey: string,
): string {
  const data = `${merchantCode}${amount}${datetime}${apiKey}`
  return CryptoJS.SHA256(data).toString()
}

/**
 * Generate signature for transaction inquiry
 * @param merchantCode - Merchant code from Duitku
 * @param merchantOrderId - Unique order ID from merchant
 * @param paymentAmount - Transaction amount (no decimals)
 * @param apiKey - API key from Duitku
 * @returns MD5 hash signature
 */
export function generateTransactionSignature(
  merchantCode: string,
  merchantOrderId: string,
  paymentAmount: number,
  apiKey: string,
): string {
  const data = `${merchantCode}${merchantOrderId}${paymentAmount}${apiKey}`
  return CryptoJS.MD5(data).toString()
}

/**
 * Format current datetime for Duitku API
 * @returns Datetime string in format yyyy-MM-dd HH:mm:ss
 */
export function formatDuitkuDatetime(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

/**
 * Calculate expiry datetime
 * @param expiryMinutes - Expiry period in minutes
 * @returns Expiry datetime in minutes from now
 */
export function calculateExpiryPeriod(expiryMinutes: number): number {
  return expiryMinutes
}
