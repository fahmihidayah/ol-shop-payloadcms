# Order Confirmation Page Implementation

This document explains the order confirmation flow and Duitku result code handling.

## Overview

After a user completes (or attempts) payment on Duitku, they are redirected back to our site with payment status information in the URL query parameters.

**Example URL**:
```
http://localhost:3000/order/confirmation?merchantOrderId=ORD-1770560988903-0694&resultCode=00&reference=DS2653926U7ZOCFON5F507ZN
```

## Duitku Result Codes

Based on Duitku's official documentation:

### Return URL Result Codes
These codes appear when Duitku redirects the user back to your site:

| Code | Status | Description |
|------|--------|-------------|
| `00` | Success | Payment completed successfully |
| `01` | Pending | Payment is being processed |
| `02` | Canceled | User canceled the payment |

### Callback Result Codes
These codes appear in webhook callbacks (server-to-server):

| Code | Status | Description |
|------|--------|-------------|
| `00` | Success | Payment successful |
| `01` | Failed | Payment failed |

### Transaction Status Codes (API Check)
These codes appear when checking transaction status via API:

| Code | Status | Description |
|------|--------|-------------|
| `00` | Success | Transaction successful |
| `01` | Process | Transaction in process |
| `02` | Failed/Expired | Transaction failed or expired |

## Important Security Note

⚠️ **According to Duitku Documentation**:
> "Do not use `resultCode` to update payment status on your app or website"

The `resultCode` from the return URL should **ONLY** be used for:
- Displaying user feedback (success/pending/canceled message)
- Initial UI state

**Final payment confirmation** should come from:
1. ✅ Duitku's callback (webhook) with signature verification
2. ✅ Checking transaction status via Duitku API

## Implementation Files

### 1. Update Order Actions

**File**: [src/feature/order/actions/update-order.ts](src/feature/order/actions/update-order.ts)

Contains three main functions:

#### `getOrderByOrderNumber(orderNumber: string)`
- Finds order by order number (not ID)
- Returns order data if found

#### `updateOrderFromReturnUrl(orderNumber, resultCode, reference)`
- Called when user returns from Duitku payment page
- Updates order with initial status based on result code
- **Note**: This is temporary status for user feedback
- Final status will be updated by callback

**Status Mapping**:
```typescript
resultCode '00' → orderStatus: 'processing', paymentStatus: 'paid'
resultCode '01' → orderStatus: 'pending', paymentStatus: 'pending'
resultCode '02' → orderStatus: 'cancelled', paymentStatus: 'failed'
```

#### `updateOrderFromCallback(params)`
- Called by Duitku webhook (to be implemented)
- Verifies signature using MD5 hash
- Updates order with authoritative payment status
- **This is the final, trusted update**

**Signature Verification**:
```typescript
MD5(merchantCode + amount + merchantOrderId + apiKey)
```

### 2. Order Confirmation Component

**File**: [src/feature/order/components/order-confirmation.tsx](src/feature/order/components/order-confirmation.tsx)

A client component that displays order confirmation UI based on result code.

**Features**:
- ✅ Shows success/pending/canceled status with appropriate icons and colors
- ✅ Displays order details (order number, reference, amount, status)
- ✅ Shows shipping address
- ✅ Provides action buttons based on status
- ✅ Shows helpful information cards
- ✅ Loading state while processing

**Status-Specific UI**:

**Success (`00`)**:
- Green check icon
- "Payment Successful!" message
- Buttons: "View Order Details" + "Continue Shopping"
- Info card: Confirmation email sent, shipping timeline

**Pending (`01`)**:
- Yellow clock icon
- "Payment Pending" message
- Buttons: "Check Order Status" + "Back to Home"
- Info card: Payment verification in progress

**Canceled (`02`)**:
- Red X icon
- "Payment Canceled" message
- Buttons: "Back to Cart" + "Continue Shopping"
- No additional info card

### 3. Order Confirmation Page Route

**File**: [src/app/(frontend)/order/confirmation/page.tsx](src/app/(frontend)/order/confirmation/page.tsx)

Server component that handles the confirmation page route.

**Flow**:
1. Receives URL search parameters (`merchantOrderId`, `resultCode`, `reference`)
2. Validates required parameters exist
3. Validates `resultCode` is valid (`00`, `01`, or `02`)
4. Calls `updateOrderFromReturnUrl()` to update order
5. Redirects to home if order not found
6. Renders `<OrderConfirmation>` component with order data

## Complete User Flow

### 1. User Places Order
- User clicks "Place Order" on checkout page
- Order is created in database (status: `pending`)
- User is redirected to Duitku payment page

### 2. User Completes/Cancels Payment on Duitku
- User enters payment details on Duitku
- User completes, cancels, or payment remains pending

### 3. Duitku Redirects Back to Our Site
**URL Format**:
```
{returnUrl}?merchantOrderId={orderNumber}&resultCode={code}&reference={ref}
```

**Example**:
```
http://localhost:3000/order/confirmation?merchantOrderId=ORD-1770560988903-0694&resultCode=00&reference=DS2653926U7ZOCFON5F507ZN
```

### 4. Order Confirmation Page Loads
- Server validates URL parameters
- Finds order by order number
- Updates order status based on result code
- Displays confirmation UI to user

### 5. Duitku Sends Callback (Future Implementation)
- Duitku sends POST request to callback URL
- Contains: `merchantCode`, `amount`, `merchantOrderId`, `reference`, `signature`, `resultCode`
- We verify signature to ensure authenticity
- Update order with final payment status
- This is the **authoritative** status update

## Database State Changes

### After User Returns (Step 4)

**Result Code: `00` (Success)**
```
Order Status: pending → processing
Payment Status: pending → paid
Payment Reference: NULL → DS2653926U7ZOCFON5F507ZN
```

**Result Code: `01` (Pending)**
```
Order Status: pending (no change)
Payment Status: pending (no change)
Payment Reference: NULL → DS2653926U7ZOCFON5F507ZN
```

**Result Code: `02` (Canceled)**
```
Order Status: pending → cancelled
Payment Status: pending → failed
Payment Reference: NULL → DS2653926U7ZOCFON5F507ZN
```

### After Callback Verification (Step 5 - Future)

**Callback Result Code: `00` (Success)**
```
Order Status: processing (confirmed)
Payment Status: paid (confirmed)
```

**Callback Result Code: `01` (Failed)**
```
Order Status: processing → cancelled
Payment Status: paid → failed
```

## Security Considerations

### 1. Signature Verification (Callback)
- **Required**: Always verify callback signature
- **Algorithm**: MD5(merchantCode + amount + merchantOrderId + apiKey)
- **Purpose**: Prevents fake payment notifications

### 2. Amount Verification (Callback)
- **Required**: Verify amount matches order total
- **Purpose**: Prevents payment mismatch attacks

### 3. Idempotency (Callback)
- **Required**: Handle duplicate callbacks gracefully
- **Purpose**: Duitku may send multiple callbacks
- **Implementation**: Check if order already updated

## Next Steps - Callback Implementation

To complete the payment flow, you need to create a webhook endpoint:

**File to Create**: `src/app/api/payment/callback/route.ts`

**Implementation**:
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { updateOrderFromCallback } from '@/feature/order/actions/update-order'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      merchantCode,
      amount,
      merchantOrderId,
      reference,
      signature,
      resultCode,
    } = body

    // Update order with callback data
    const result = await updateOrderFromCallback({
      merchantCode,
      amount: parseInt(amount),
      merchantOrderId,
      reference,
      signature,
      resultCode,
    })

    if (result.success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 })
    }
  } catch (error) {
    console.error('[CALLBACK] Error:', error)
    return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 })
  }
}
```

**Configure Callback URL in Duitku**:
- Development: `https://yourdomain.com/api/payment/callback`
- Use ngrok or similar for local testing

## Environment Variables

Make sure these are set in your `.env`:

```bash
# Duitku Configuration
DUITKU_MERCHANT_CODE=D1234
DUITKU_API_KEY=your-api-key
DUITKU_ENVIRONMENT=sandbox # or production
DUITKU_CALLBACK_URL=https://yourdomain.com/api/payment/callback
DUITKU_RETURN_URL=http://localhost:3000/order/confirmation
DUITKU_EXPIRY_PERIOD=1440 # 24 hours in minutes
```

## Testing the Flow

### Test Success Payment (Result Code 00)
```
http://localhost:3000/order/confirmation?merchantOrderId=ORD-123&resultCode=00&reference=TEST123
```
Expected:
- Green success UI
- Order status → processing
- Payment status → paid

### Test Pending Payment (Result Code 01)
```
http://localhost:3000/order/confirmation?merchantOrderId=ORD-123&resultCode=01&reference=TEST123
```
Expected:
- Yellow pending UI
- Order status → pending
- Payment status → pending

### Test Canceled Payment (Result Code 02)
```
http://localhost:3000/order/confirmation?merchantOrderId=ORD-123&resultCode=02&reference=TEST123
```
Expected:
- Red canceled UI
- Order status → cancelled
- Payment status → failed

## Error Handling

### Missing Parameters
- If any required parameter is missing, redirects to home page
- Parameters: `merchantOrderId`, `resultCode`, `reference`

### Invalid Result Code
- If `resultCode` is not `00`, `01`, or `02`, redirects to home page

### Order Not Found
- If order with given `merchantOrderId` doesn't exist
- Logs error and redirects to home page

### Callback Signature Invalid
- If signature verification fails in callback
- Returns error response to Duitku
- Does NOT update order

## Key Differences: Return URL vs Callback

| Aspect | Return URL | Callback |
|--------|-----------|----------|
| **Trigger** | User redirect | Server-to-server |
| **Purpose** | User feedback | Authoritative update |
| **Signature** | Not verified | Verified with MD5 |
| **Reliability** | Can be manipulated | Secure |
| **Timing** | Immediate | May be delayed |
| **Usage** | Display UI | Update database |
| **Trust Level** | Low | High |

## Summary

✅ **Implemented**:
1. Order confirmation page at `/order/confirmation`
2. Result code handling for return URL
3. Order status updates based on result codes
4. Beautiful UI with status-specific feedback
5. Order details display
6. Shipping address display
7. Action buttons based on status

⏳ **To Implement** (Future):
1. Callback webhook endpoint (`/api/payment/callback`)
2. Signature verification in callback
3. Final payment status updates from callback
4. Email notifications on payment success
5. Clear cart after successful payment

---

**Status**: ✅ Order Confirmation Page Implemented
**Date**: 2026-02-09
