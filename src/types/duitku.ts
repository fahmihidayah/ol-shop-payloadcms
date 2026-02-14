/**
 * Duitku Payment Gateway Types
 */

/**
 * Duitku Payment Method
 */
export interface DuitkuPaymentMethod {
  paymentMethod: string
  paymentName: string
  paymentImage: string
  totalFee: string
}

/**
 * Duitku Payment Method Response
 */
export interface DuitkuPaymentMethodResponse {
  paymentFee: DuitkuPaymentMethod[]
  responseCode: string
  responseMessage: string
}

/**
 * Customer billing/shipping address
 */
export interface DuitkuAddress {
  firstName: string
  lastName?: string
  address: string
  city: string
  postalCode: string
  phone: string
  countryCode: string
}

/**
 * Customer details for Duitku transaction
 */
export interface DuitkuCustomerDetail {
  firstName: string
  lastName?: string
  email: string
  phoneNumber: string
  billingAddress?: DuitkuAddress
  shippingAddress?: DuitkuAddress
}

/**
 * Item details for Duitku transaction
 */
export interface DuitkuItemDetail {
  name: string
  price: number
  quantity: number
}

/**
 * Duitku transaction request
 */
export interface DuitkuTransactionRequest {
  merchantCode: string
  paymentAmount: number
  paymentMethod: string
  merchantOrderId: string
  productDetails: string
  email: string
  phoneNumber?: string
  additionalParam?: string
  merchantUserInfo?: string
  customerVaName?: string
  callbackUrl: string
  returnUrl: string
  signature: string
  expiryPeriod?: number
  customerDetail?: DuitkuCustomerDetail
  itemDetails?: DuitkuItemDetail[]
}

/**
 * Duitku transaction response
 */
export interface DuitkuTransactionResponse {
  merchantCode: string
  reference: string
  paymentUrl: string
  vaNumber?: string
  qrString?: string
  amount: string
  statusCode: string
  statusMessage: string
}

/**
 * Duitku callback data
 */
export interface DuitkuCallback {
  merchantCode: string
  amount: string
  merchantOrderId: string
  productDetail: string
  additionalParam: string
  paymentCode: string
  resultCode: string
  merchantUserId: string
  reference: string
  signature: string
}
