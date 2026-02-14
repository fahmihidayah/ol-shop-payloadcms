# Checkout Process Documentation

## Overview

The checkout process integrates with **Duitku Payment Gateway** and follows this flow:
1. Create order in database (with pending status)
2. Initiate payment with Duitku
3. Redirect user to payment page
4. Handle payment callback
5. Update order status

## Architecture Decision: Order Before Payment

We create the order **BEFORE** initiating payment for these reasons:

✅ **Data Integrity**: Ensures we have a valid order record even if payment fails
✅ **Order Tracking**: Allows tracking of abandoned payments
✅ **Reference ID**: Order number is used as merchant order ID in Duitku
✅ **Audit Trail**: Complete history of all checkout attempts
✅ **Recovery**: Can retry payment for existing orders

## Checkout Flow

```
User Cart → Checkout Page → Process Checkout
                                ↓
                          1. Create Order (pending)
                                ↓
                          2. Create Duitku Payment
                                ↓
                          3. Update Order w/ Payment Ref
                                ↓
                          4. Redirect to Payment URL
                                ↓
                          User Completes Payment
                                ↓
                          Duitku Callback → Update Order Status
```

## File Structure

```
src/
├── types/
│   ├── duitku.ts              # Duitku-specific types
│   └── checkout.ts            # Checkout and order types
├── feature/
│   └── checkout/
│       └── actions/
│           ├── index.ts           # Exports all actions
│           ├── payment-options.ts # Get Duitku payment methods
│           ├── create-order.ts    # Order creation & updates
│           └── create-payment.ts  # Payment processing
```

## Types

### CheckoutData (src/types/checkout.ts)

```typescript
interface CheckoutData {
  customerId?: string
  items: CheckoutItem[]
  shippingAddress: CheckoutAddress
  billingAddress?: CheckoutAddress
  paymentMethod: string
  subtotal: number
  shippingCost: number
  tax: number
  total: number
  notes?: string
}
```

### CheckoutItem

```typescript
interface CheckoutItem {
  productId: string
  variantId: string
  productName: string
  variantName: string
  quantity: number
  price: number
  subtotal: number
}
```

### CheckoutAddress

```typescript
interface CheckoutAddress {
  fullName: string
  phone: string
  address: string
  city: string
  state?: string
  postalCode: string
  country: string
  isDefault?: boolean
}
```

## Usage

### 1. Get Payment Methods

```typescript
import { getCombinedPaymentOptions } from '@/feature/checkout/actions'

// Get available payment methods for a specific amount
const paymentMethods = await getCombinedPaymentOptions(250000)

// Returns:
// [
//   {
//     paymentMethod: "VC",
//     paymentName: "Credit Card",
//     paymentImage: "https://...",
//     totalFee: "5000"
//   },
//   ...
// ]
```

### 2. Process Checkout (Complete Flow)

```typescript
import { processCheckout } from '@/feature/checkout/actions'
import type { CheckoutData } from '@/types/checkout'

const checkoutData: CheckoutData = {
  customerId: 'customer-id', // Optional for guest checkout
  items: [
    {
      productId: 'prod-123',
      variantId: 'var-456',
      productName: 'T-Shirt',
      variantName: 'Blue - Large',
      quantity: 2,
      price: 100000,
      subtotal: 200000,
    },
  ],
  shippingAddress: {
    fullName: 'John Doe',
    phone: '081234567890',
    address: 'Jl. Example No. 123',
    city: 'Jakarta',
    postalCode: '12345',
    country: 'ID',
  },
  paymentMethod: 'VC', // Payment method code from Duitku
  subtotal: 200000,
  shippingCost: 15000,
  tax: 0,
  total: 215000,
  notes: 'Please deliver in the morning',
}

const result = await processCheckout(checkoutData)

if (result.success) {
  // Redirect user to Duitku payment page
  window.location.href = result.paymentUrl

  // Store reference for tracking
  console.log('Payment Reference:', result.reference)
  console.log('VA Number:', result.vaNumber) // For VA payments
} else {
  console.error('Checkout failed:', result.error)
}
```

### 3. Manual Order Creation (Advanced)

```typescript
import { createOrder } from '@/feature/checkout/actions'

const orderResult = await createOrder(checkoutData)

if (orderResult.success) {
  console.log('Order ID:', orderResult.orderId)
  console.log('Order Number:', orderResult.order.orderNumber)
}
```

### 4. Update Order Status (After Payment)

```typescript
import { updateOrderStatus } from '@/feature/checkout/actions'

// Called from payment callback
await updateOrderStatus('order-id', 'processing', 'paid')
```

### 5. Check Payment Status

```typescript
import { checkDuitkuTransactionStatus } from '@/feature/checkout/actions'

const status = await checkDuitkuTransactionStatus('ORD-1234567890-5678')

if (status.success) {
  console.log('Payment Status:', status.data)
}
```

## Order Statuses

### Order Status
- `pending` - Order created, waiting for payment
- `processing` - Payment received, order being processed
- `shipped` - Order shipped to customer
- `delivered` - Order delivered
- `cancelled` - Order cancelled

### Payment Status
- `pending` - Waiting for payment
- `paid` - Payment successful
- `failed` - Payment failed
- `expired` - Payment link expired
- `refunded` - Payment refunded

## Database Collections

### Orders Collection

```typescript
{
  orderNumber: string        // e.g., "ORD-1234567890-5678"
  customer: string          // Customer ID (optional for guest)
  status: string            // Order status
  paymentStatus: string     // Payment status
  paymentMethod: string     // Duitku payment method code
  paymentReference: string  // Duitku reference number
  vaNumber: string          // Virtual account number (if applicable)
  subtotal: number
  shippingCost: number
  tax: number
  total: number
  shippingAddress: {...}
  billingAddress: {...}
  notes: string
  createdAt: Date
  updatedAt: Date
}
```

### Order Items Collection

```typescript
{
  order: string            // Order ID
  product: string          // Product ID
  variant: string          // Variant ID
  productName: string
  variantName: string
  quantity: number
  price: number
  subtotal: number
}
```

## Payment Callback

Create a callback endpoint to receive payment notifications:

```typescript
// app/api/payment/callback/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { updateOrderStatus } from '@/feature/checkout/actions'

export async function POST(request: NextRequest) {
  const body = await request.json()

  // Verify signature (important for security)
  // ... signature verification logic

  if (body.resultCode === '00') {
    // Payment successful
    await updateOrderStatus(body.merchantOrderId, 'processing', 'paid')
  } else {
    // Payment failed
    await updateOrderStatus(body.merchantOrderId, 'pending', 'failed')
  }

  return NextResponse.json({ success: true })
}
```

## Error Handling

All checkout actions return a consistent response format:

```typescript
{
  success: boolean
  data?: any
  error?: string
}
```

Handle errors gracefully:

```typescript
const result = await processCheckout(checkoutData)

if (!result.success) {
  // Show error to user
  toast.error(result.error || 'Checkout failed')
  return
}

// Continue with success flow
```

## Best Practices

1. **Validate Input**: Always validate checkout data before processing
2. **Error Recovery**: Allow users to retry failed payments
3. **Order Tracking**: Provide order number to users immediately
4. **Email Notifications**: Send order confirmation emails
5. **Inventory Management**: Reserve stock when order is created
6. **Timeout Handling**: Handle payment expiry gracefully
7. **Security**: Always verify callback signatures
8. **Logging**: Log all checkout attempts for debugging

## Testing

### Test with Sandbox

1. Set `DUITKU_ENVIRONMENT=sandbox`
2. Use test payment methods
3. Use test credit cards for VC payments
4. Verify callback handling

### Test Scenarios

- ✅ Successful payment
- ✅ Failed payment
- ✅ Expired payment
- ✅ Guest checkout
- ✅ Logged-in user checkout
- ✅ Multiple items
- ✅ Different payment methods

## Security Considerations

1. **Never expose API keys** in client-side code
2. **Validate all signatures** from Duitku callbacks
3. **Use HTTPS** in production
4. **Sanitize user input** before storing
5. **Rate limit** checkout attempts
6. **Verify amounts** match between frontend and backend
7. **Log suspicious activity** for fraud detection

## Migration Notes

If migrating from another payment gateway:

1. Update payment method mapping
2. Adjust callback signature verification
3. Update order status mapping
4. Test all payment flows thoroughly
5. Keep old payment records for reference

## Support

For issues:
- Check Duitku documentation
- Review server logs
- Test in sandbox first
- Contact Duitku support for API issues
