# Duitku Payment Gateway Integration

This document describes the Duitku payment gateway integration for the online store.

## Overview

Duitku is a payment gateway system that helps accept online payments from customers in Indonesia. This integration supports multiple payment methods including Virtual Account (VA), Credit Card, E-Wallet, and more.

## Features

- ✅ Get available payment methods with real-time fees
- ✅ Create payment transactions
- ✅ Check transaction status
- ✅ Support for sandbox and production environments
- ✅ Automatic signature generation
- ✅ Customer and item details support
- ✅ Configurable expiry periods

## Installation

The required packages are already installed:

```bash
pnpm add duitku crypto-js
pnpm add -D @types/crypto-js
```

## Configuration

### 1. Environment Variables

Copy `.env.example` and create `.env.local`:

```env
# Merchant credentials (get from https://passport.duitku.com/merchant/)
DUITKU_MERCHANT_CODE=your_merchant_code_here
DUITKU_API_KEY=your_api_key_here

# Environment: 'sandbox' or 'production'
DUITKU_ENVIRONMENT=sandbox

# Callback & Return URLs
DUITKU_CALLBACK_URL=http://localhost:3000/api/payment/callback
DUITKU_RETURN_URL=http://localhost:3000/order/confirmation

# Expiry period in minutes (default: 1440 = 24 hours)
DUITKU_EXPIRY_PERIOD=1440

# Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 2. Get Merchant Credentials

1. Register at [Duitku Merchant Portal](https://passport.duitku.com/merchant/)
2. Get your **Merchant Code** and **API Key** from the dashboard
3. For testing, use sandbox credentials

## Usage

### 1. Get Payment Methods

Fetch available payment methods from Duitku API:

```typescript
import { getDuitkuPaymentMethods } from '@/feature/checkout/actions/payment-options'

// Get payment methods for a transaction amount
const paymentMethods = await getDuitkuPaymentMethods(100000) // Amount in IDR

console.log(paymentMethods)
// Output:
// [
//   {
//     paymentMethod: "VC",
//     paymentName: "Credit Card",
//     paymentImage: "https://images.duitku.com/cc.png",
//     totalFee: "2500"
//   },
//   {
//     paymentMethod: "VA",
//     paymentName: "BCA Virtual Account",
//     paymentImage: "https://images.duitku.com/va.png",
//     totalFee: "4000"
//   }
// ]
```

### 2. Get Combined Payment Options

Get both database payment options and Duitku methods:

```typescript
import { getCombinedPaymentOptions } from '@/feature/checkout/actions/payment-options'

const allPaymentOptions = await getCombinedPaymentOptions(100000)
```

### 3. Create Payment Transaction

Create a new payment request:

```typescript
import { createDuitkuPayment } from '@/feature/checkout/actions/create-payment'

const result = await createDuitkuPayment({
  orderId: 'ORDER-12345',
  amount: 100000, // Amount in IDR (no decimals)
  paymentMethod: 'VC', // Payment method code from getDuitkuPaymentMethods
  customerEmail: 'customer@example.com',
  customerName: 'John Doe',
  customerPhone: '081234567890',
  productDetails: 'Product A, Product B',

  // Optional: Item details
  itemDetails: [
    {
      name: 'Product A',
      price: 50000,
      quantity: 1,
    },
    {
      name: 'Product B',
      price: 50000,
      quantity: 1,
    },
  ],

  // Optional: Customer details
  customerDetail: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'customer@example.com',
    phoneNumber: '081234567890',
  },
})

if (result.success) {
  // Redirect user to payment URL
  window.location.href = result.data.paymentUrl

  // Store reference for tracking
  console.log('Payment Reference:', result.data.reference)
  console.log('VA Number:', result.data.vaNumber) // For VA payments
} else {
  console.error('Payment failed:', result.error)
}
```

### 4. Check Transaction Status

Check the status of a transaction:

```typescript
import { checkDuitkuTransactionStatus } from '@/feature/checkout/actions/create-payment'

const status = await checkDuitkuTransactionStatus('ORDER-12345')

if (status.success) {
  console.log('Transaction Status:', status.data)
}
```

## Payment Flow

1. **User selects payment method** → Call `getDuitkuPaymentMethods(amount)`
2. **User confirms order** → Call `createDuitkuPayment(params)`
3. **Redirect to payment page** → Use `paymentUrl` from response
4. **User completes payment** → Duitku sends callback to your server
5. **User returns to site** → Redirected to `returnUrl`
6. **Verify payment** → Check transaction status via callback or API

## API Endpoints

### Sandbox (Testing)
- Payment Methods: `https://sandbox.duitku.com/webapi/api/merchant/paymentmethod/getpaymentmethod`
- Create Transaction: `https://sandbox.duitku.com/webapi/api/merchant/v2/inquiry`
- Check Status: `https://sandbox.duitku.com/webapi/api/merchant/transactionStatus`

### Production
- Payment Methods: `https://passport.duitku.com/webapi/api/merchant/paymentmethod/getpaymentmethod`
- Create Transaction: `https://passport.duitku.com/webapi/api/merchant/v2/inquiry`
- Check Status: `https://passport.duitku.com/webapi/api/merchant/transactionStatus`

## Payment Methods

Common payment method codes:
- `VC` - Credit/Debit Card (Visa/Mastercard)
- `VA` - Virtual Account (BCA, BNI, Mandiri, etc.)
- `SP` - ShopeePay
- `OV` - OVO
- `DA` - DANA
- `LF` - LinkAja
- `AG` - Alfamart
- `IR` - Indomaret

## Callback Implementation

Create a callback endpoint to receive payment notifications:

```typescript
// app/api/payment/callback/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const body = await request.json()

  // Verify signature and update order status
  // See Duitku documentation for callback signature verification

  return NextResponse.json({ success: true })
}
```

## File Structure

```
src/
├── lib/
│   ├── duitku-config.ts          # Configuration and environment setup
│   └── duitku-utils.ts           # Utility functions (signature, datetime)
├── feature/
│   └── checkout/
│       └── actions/
│           ├── payment-options.ts # Get payment methods
│           └── create-payment.ts  # Create and check transactions
└── .env.example                   # Environment variables template
```

## Testing

1. Use sandbox credentials for testing
2. Test payment methods: Use test cards provided by Duitku
3. Verify callbacks work correctly
4. Test transaction status checking

## Resources

- [Duitku NPM Package](https://www.npmjs.com/package/duitku)
- [Duitku API Documentation](https://docs.duitku.com/api/en/)
- [Duitku Payment Gateway Overview](https://docs.duitku.com/payment-gateway/overview/)
- [Duitku Merchant Portal](https://passport.duitku.com/merchant/)

## Support

For issues with the integration:
1. Check environment variables are set correctly
2. Verify merchant credentials
3. Check Duitku API documentation
4. Contact Duitku support for API-specific issues

## Security Notes

- ✅ Never expose API keys in client-side code
- ✅ Always verify callback signatures
- ✅ Use HTTPS in production
- ✅ Store sensitive credentials in environment variables
- ✅ Validate transaction amounts before creating payments
