/**
 * Duitku Payment Gateway Configuration
 */

export const duitkuConfig = {
  // Merchant credentials
  merchantCode: process.env.DUITKU_MERCHANT_CODE || '',
  apiKey: process.env.DUITKU_API_KEY || '',

  // Environment (sandbox or production)
  environment: (process.env.DUITKU_ENVIRONMENT || 'sandbox') as 'sandbox' | 'production',

  // API endpoints
  endpoints: {
    sandbox: {
      paymentMethod: 'https://sandbox.duitku.com/webapi/api/merchant/paymentmethod/getpaymentmethod',
      inquiry: 'https://sandbox.duitku.com/webapi/api/merchant/v2/inquiry',
      checkTransaction: 'https://sandbox.duitku.com/webapi/api/merchant/transactionStatus',
    },
    production: {
      paymentMethod: 'https://passport.duitku.com/webapi/api/merchant/paymentmethod/getpaymentmethod',
      inquiry: 'https://passport.duitku.com/webapi/api/merchant/v2/inquiry',
      checkTransaction: 'https://passport.duitku.com/webapi/api/merchant/transactionStatus',
    },
  },

  // Callback URLs
  callbackUrl: process.env.DUITKU_CALLBACK_URL || `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/callback`,
  returnUrl: process.env.DUITKU_RETURN_URL || `${process.env.NEXT_PUBLIC_BASE_URL}/order/confirmation`,

  // Default expiry period (in minutes)
  expiryPeriod: parseInt(process.env.DUITKU_EXPIRY_PERIOD || '1440'), // 24 hours default
}

/**
 * Get the appropriate API endpoint based on environment
 */
export function getDuitkuEndpoint(type: 'paymentMethod' | 'inquiry' | 'checkTransaction'): string {
  const env = duitkuConfig.environment
  return duitkuConfig.endpoints[env][type]
}

/**
 * Validate Duitku configuration
 */
export function validateDuitkuConfig(): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!duitkuConfig.merchantCode) {
    errors.push('DUITKU_MERCHANT_CODE is not set')
  }

  if (!duitkuConfig.apiKey) {
    errors.push('DUITKU_API_KEY is not set')
  }

  if (!['sandbox', 'production'].includes(duitkuConfig.environment)) {
    errors.push('DUITKU_ENVIRONMENT must be either "sandbox" or "production"')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}
