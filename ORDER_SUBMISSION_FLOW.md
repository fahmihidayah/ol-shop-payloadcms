# Order Submission Flow - Action Sequence

This document explains the complete flow of actions when a user clicks the "Place Order" button in the checkout page.

## Overview

The order submission follows an **Order-Before-Payment** pattern where:
1. Order is created in the database first (status: pending)
2. Payment is initiated with Duitku
3. Payment reference is stored in the order
4. User is redirected to Duitku payment page

## Complete Action Sequence

### 1. User Clicks "Place Order" Button

**File**: [src/feature/checkout/components/checkout-page.tsx](src/feature/checkout/components/checkout-page.tsx)

**Function**: `handlePlaceOrder()` (lines 33-90)

**What Happens**:
- Validates that shipping address is selected
- Maps `CartItem[]` to `CheckoutItem[]` format
- Extracts product information from cart items
- Builds shipping address object from selected address
- Calculates totals (subtotal, shipping, tax, total)
- Constructs `CheckoutData` object with all order information

**Data Gathered**:
```typescript
{
  items: CheckoutItem[],           // Product details, quantities, prices
  shippingAddress: CheckoutAddress, // Full shipping address
  paymentMethod: string,            // Selected payment method code
  subtotal: number,                 // Cart total
  shippingCost: number,            // Fixed shipping (20000)
  tax: number,                     // Tax (currently 0)
  total: number                    // Grand total
}
```

---

### 2. Call `processCheckout()` Server Action

**File**: [src/feature/checkout/actions/create-payment.ts](src/feature/checkout/actions/create-payment.ts)

**Function**: `processCheckout(checkoutData)` (lines 20-121)

This is the main orchestrator that coordinates order creation and payment initiation.

---

### 3. Step 1: Create Order in Database

**File**: [src/feature/checkout/actions/create-order.ts](src/feature/checkout/actions/create-order.ts)

**Function**: `createOrder(checkoutData)` (lines 25-98)

**What Happens**:
- Generates unique order number (format: `ORD-{timestamp}-{random}`)
- Creates order record in `orders` collection with:
  - Order number
  - Customer ID (if logged in)
  - Order status: `'pending'`
  - Payment status: `'pending'`
  - Payment method code
  - Total amount and shipping cost
  - Shipping address details
  - Notes (if any)

**Database Operation**:
```typescript
await payload.create({
  collection: 'orders',
  data: {
    orderNumber: 'ORD-1707382441234-1234',
    customer: userId,
    orderStatus: 'pending',
    paymentStatus: 'pending',
    paymentMethod: 'VC',
    totalAmount: 145000,
    shippingCost: 20000,
    shippingAddress: { /* full address */ },
    notes: ''
  }
})
```

**Result**: Returns `{ success: true, order, orderId }`

---

### 4. Step 2: Create Order Items

**File**: [src/feature/checkout/actions/create-order.ts](src/feature/checkout/actions/create-order.ts)

**Function**: `createOrder()` - Order items creation (lines 63-81)

**What Happens**:
- Loops through all cart items
- Creates order item records in `order-items` collection
- Each order item includes:
  - Link to order
  - Product and variant references
  - Product snapshot (name, variant name for historical record)
  - Quantity, price, subtotal

**Database Operation** (for each item):
```typescript
await payload.create({
  collection: 'order-items',
  data: {
    order: orderId,
    product: 'product-123',
    variant: 'variant-456',
    productSnapshot: {
      title: 'Nike Air Max',
      variantTitle: 'Size 42 / Red'
    },
    quantity: 2,
    price: 500000,
    subtotal: 1000000
  }
})
```

**Why This Matters**:
- Preserves product information at time of order
- If product details change later, order history remains accurate

---

### 5. Step 3: Prepare Duitku Item Details

**File**: [src/feature/checkout/actions/create-payment.ts](src/feature/checkout/actions/create-payment.ts)

**Function**: `processCheckout()` - Item details preparation (lines 32-37)

**What Happens**:
- Maps checkout items to Duitku format
- Each item includes: name, price, quantity

**Data Structure**:
```typescript
itemDetails: [
  {
    name: "Nike Air Max - Size 42 / Red",
    price: 500000,
    quantity: 2
  }
]
```

---

### 6. Step 4: Prepare Duitku Customer Details

**File**: [src/feature/checkout/actions/create-payment.ts](src/feature/checkout/actions/create-payment.ts)

**Function**: `processCheckout()` - Customer details preparation (lines 39-74)

**What Happens**:
- Splits full name into first name and last name
- Prepares shipping address in Duitku format
- Prepares billing address if different
- Includes email and phone number

**Data Structure**:
```typescript
customerDetail: {
  firstName: "John",
  lastName: "Doe",
  email: "user@example.com",
  phoneNumber: "081234567890",
  shippingAddress: {
    firstName: "John",
    lastName: "Doe",
    address: "Jl. Example No. 123",
    city: "Jakarta",
    postalCode: "12345",
    phone: "081234567890",
    countryCode: "ID"
  },
  billingAddress: { /* same or different */ }
}
```

---

### 7. Step 5: Create Payment with Duitku

**File**: [src/feature/checkout/actions/create-payment.ts](src/feature/checkout/actions/create-payment.ts)

**Function**: `createDuitkuPayment()` (lines 128-213)

**What Happens**:

#### 7.1. Generate Transaction Signature
- Uses MD5 hash algorithm
- Input: `merchantCode + merchantOrderId + paymentAmount + apiKey`
- This authenticates the request to Duitku

#### 7.2. Prepare Transaction Request
```typescript
{
  merchantCode: "D1234",
  paymentAmount: 145000,
  paymentMethod: "VC",
  merchantOrderId: "ORD-1707382441234-1234",
  productDetails: "Nike Air Max (Size 42 / Red) x2",
  email: "user@example.com",
  phoneNumber: "081234567890",
  customerVaName: "John Doe",
  callbackUrl: "https://yoursite.com/api/payment/callback",
  returnUrl: "https://yoursite.com/order/thank-you",
  signature: "abc123...",
  expiryPeriod: "2024-02-08 23:59:59",
  itemDetails: [ /* array of items */ ],
  customerDetail: { /* customer info */ }
}
```

#### 7.3. Send Request to Duitku
- **Endpoint**: `https://sandbox.duitku.com/webapi/api/merchant/v2/inquiry`
- **Method**: POST
- **Headers**: `Content-Type: application/json`

#### 7.4. Process Duitku Response
```typescript
{
  statusCode: "00",                  // Success
  statusMessage: "SUCCESS",
  reference: "DT20240208123456789",  // Payment reference
  paymentUrl: "https://sandbox.duitku.com/pay/xxx",
  vaNumber: "8888888888888888",     // Virtual account (if applicable)
  qrString: "xxx",                   // QR code data (if applicable)
  amount: 145000
}
```

**Result**: Returns payment URL and reference

---

### 8. Step 6: Update Order with Payment Reference

**File**: [src/feature/checkout/actions/create-order.ts](src/feature/checkout/actions/create-order.ts)

**Function**: `updateOrderPayment()` (lines 107-139)

**What Happens**:
- Updates the order record with payment information
- Stores Duitku payment reference
- Stores VA number (if it's a virtual account payment)

**Database Operation**:
```typescript
await payload.update({
  collection: 'orders',
  id: orderId,
  data: {
    paymentReference: 'DT20240208123456789',
    vaNumber: '8888888888888888'  // Only for VA payments
  }
})
```

**Why This Matters**:
- Links order to Duitku transaction
- Allows tracking payment status via reference
- Displays VA number to customer for manual transfer

---

### 9. Step 7: Return Payment URL

**File**: [src/feature/checkout/actions/create-payment.ts](src/feature/checkout/actions/create-payment.ts)

**Function**: `processCheckout()` - Return statement (lines 108-113)

**What Returns to Client**:
```typescript
{
  success: true,
  paymentUrl: "https://sandbox.duitku.com/pay/xxx",
  reference: "DT20240208123456789",
  vaNumber: "8888888888888888"
}
```

---

### 10. Step 8: Client Handles Response

**File**: [src/feature/checkout/components/checkout-page.tsx](src/feature/checkout/components/checkout-page.tsx)

**Function**: `handlePlaceOrder()` - Response handling (lines 76-85)

**What Happens**:
- If success: Show success toast
- Redirect user to Duitku payment page using `window.location.href`
- If error: Show error toast with message

---

### 11. Step 9: User Completes Payment on Duitku

**External**: Duitku payment page

**What Happens**:
- User is on Duitku's payment page
- User selects payment details (e.g., credit card, bank transfer)
- User completes payment
- Duitku processes payment

---

### 12. Step 10: Duitku Callback (Future Implementation)

**Note**: This needs to be implemented separately

**File**: Will be `src/app/api/payment/callback/route.ts`

**What Should Happen**:
- Duitku sends POST request to callback URL
- Verify signature to ensure authenticity
- Update order status based on payment result
- If payment successful:
  - Update `paymentStatus` to `'paid'`
  - Update `orderStatus` to `'processing'`
- If payment failed:
  - Update `paymentStatus` to `'failed'`
  - Keep `orderStatus` as `'pending'`

**Function to Use**: `updateOrderStatus()` from create-order.ts

```typescript
await updateOrderStatus(
  orderId,
  'processing',  // orderStatus
  'paid'         // paymentStatus
)
```

---

## Complete Action Call Tree

```
1. handlePlaceOrder() [checkout-page.tsx]
   │
   └─> 2. processCheckout(checkoutData) [create-payment.ts]
        │
        ├─> 3. createOrder(checkoutData) [create-order.ts]
        │    │
        │    ├─> Creates order record in database
        │    │   Status: pending, Payment: pending
        │    │
        │    └─> Creates order items in parallel
        │         (One record per cart item)
        │
        ├─> 4. Prepare item details (mapping)
        │
        ├─> 5. Prepare customer details (name splitting, address formatting)
        │
        ├─> 6. createDuitkuPayment() [create-payment.ts]
        │    │
        │    ├─> Generate MD5 signature
        │    │
        │    ├─> Build transaction request
        │    │
        │    └─> POST to Duitku API
        │         Returns: paymentUrl, reference, vaNumber
        │
        ├─> 7. updateOrderPayment(orderId, reference, vaNumber) [create-order.ts]
        │    │
        │    └─> Updates order with payment reference
        │
        └─> 8. Return { success, paymentUrl, reference }

9. Client redirects to paymentUrl

10. [Future] Duitku callback → updateOrderStatus()
```

---

## Database State Changes

### Before Order Submission
```
Orders Collection: (empty)
Order Items Collection: (empty)
Cart Items: [item1, item2, item3]
```

### After Order Creation (Step 3-4)
```
Orders Collection:
  - Order ID: ord_123
  - Order Number: ORD-1707382441234-1234
  - Status: pending
  - Payment Status: pending
  - Payment Method: VC
  - Payment Reference: NULL
  - VA Number: NULL

Order Items Collection:
  - Item 1 (links to ord_123)
  - Item 2 (links to ord_123)
  - Item 3 (links to ord_123)

Cart Items: [item1, item2, item3] (still in cart)
```

### After Payment Reference Update (Step 8)
```
Orders Collection:
  - Order ID: ord_123
  - Order Number: ORD-1707382441234-1234
  - Status: pending
  - Payment Status: pending
  - Payment Method: VC
  - Payment Reference: DT20240208123456789 ✓ Updated
  - VA Number: 8888888888888888 ✓ Updated

Order Items: (unchanged)
Cart Items: (unchanged - needs separate clearing logic)
```

### After Successful Payment (Future)
```
Orders Collection:
  - Order ID: ord_123
  - Status: processing ✓ Updated
  - Payment Status: paid ✓ Updated

Cart Items: (should be cleared)
```

---

## Error Handling

### Possible Errors and Handling

1. **No Address Selected**
   - Caught in: `handlePlaceOrder()`
   - Response: Toast error "Please select a shipping address"
   - User remains on checkout page

2. **Order Creation Failed**
   - Caught in: `processCheckout()`
   - Response: Returns `{ success: false, error: message }`
   - Toast displays error message
   - Order is NOT created in database
   - User remains on checkout page

3. **Duitku Payment Creation Failed**
   - Caught in: `processCheckout()`
   - Response: Returns `{ success: false, error: message }`
   - Toast displays error message
   - Order EXISTS in database (status: pending)
   - User remains on checkout page
   - User can retry payment for same order

4. **Network Error**
   - Caught in: `handlePlaceOrder()` catch block
   - Response: Toast error "An unexpected error occurred"
   - User remains on checkout page

---

## Loading States

### UI States During Submission

1. **Initial State**
   - Button: "Place Order"
   - Disabled: `!canPlaceOrder` (no address or payment selected)

2. **Processing State** (after button click)
   - Button: "Processing Order..." with spinner icon
   - Disabled: `true`
   - User cannot click again

3. **Success State**
   - Toast: "Order created successfully! Redirecting to payment..."
   - Page redirects to Duitku payment URL
   - User leaves the site

4. **Error State**
   - Toast: Error message displayed
   - Button returns to: "Place Order"
   - Disabled: `false`
   - User can try again

---

## Important Notes

### Order Before Payment Benefits

1. **Data Integrity**: Order exists even if payment fails
2. **Tracking**: Can track abandoned checkouts
3. **Recovery**: User can retry payment without creating duplicate orders
4. **Audit Trail**: Complete history of all checkout attempts
5. **Reference ID**: Order number serves as merchant order ID

### Security Considerations

1. **Signature Verification**:
   - Payment methods: SHA256
   - Transactions: MD5
   - Prevents tampering with request data

2. **Callback Validation** (to implement):
   - Verify callback signature from Duitku
   - Prevents fake payment notifications

3. **Amount Verification** (to implement):
   - In callback, verify amount matches order total
   - Prevents payment mismatch attacks

### Next Steps to Complete

1. **Implement Duitku Callback Handler**
   - Create `/api/payment/callback` route
   - Verify signature
   - Update order status
   - Clear cart after successful payment

2. **Add Order Confirmation Page**
   - Create `/order/thank-you` page
   - Display order details
   - Show payment status

3. **Handle Payment Expiry**
   - Monitor expiry period (24 hours default)
   - Mark expired orders as cancelled

4. **Clear Cart After Payment**
   - Currently cart items remain after checkout
   - Should clear after successful payment

---

**Status**: ✅ Order submission flow implemented
**Date**: 2026-02-08
