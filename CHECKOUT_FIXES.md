# Checkout Action Fixes

## Issues Fixed

### 1. ✅ Added `country` field to Orders Collection

**File**: [src/collections/Orders/config.ts](src/collections/Orders/config.ts)

**Change**: Added `country` field to `shippingAddress` group at line 144-151

```typescript
{
    name: 'country',
    type: 'text',
    label: 'Country',
    defaultValue: 'ID',
    admin: {
        width: '50%',
    },
}
```

**Reason**: The checkout data includes country in shipping address, but it wasn't in the collection schema.

---

### 2. ✅ Added Payment Fields to Orders Collection

**File**: [src/collections/Orders/config.ts](src/collections/Orders/config.ts)

**Changes**: Added three new fields after `shippingAddress` (lines 146-168):

```typescript
{
    name: 'paymentMethod',
    type: 'text',
    label: 'Payment Method',
    admin: {
        description: 'Payment method code from Duitku',
        position: 'sidebar',
    },
},
{
    name: 'paymentReference',
    type: 'text',
    label: 'Payment Reference',
    admin: {
        description: 'Payment reference from Duitku',
        position: 'sidebar',
        readOnly: true,
    },
},
{
    name: 'vaNumber',
    type: 'text',
    label: 'VA Number',
    admin: {
        description: 'Virtual Account number (if applicable)',
        position: 'sidebar',
        readOnly: true,
    },
}
```

**Reason**: These fields are needed to store Duitku payment information.

---

### 3. ✅ Fixed Order Creation Data Structure

**File**: [src/feature/checkout/actions/create-order.ts](src/feature/checkout/actions/create-order.ts)

**Changes** (lines 33-59):

**Before**:
```typescript
data: {
  orderNumber,
  customer: checkoutData.customerId,
  status: 'pending',
  paymentStatus: 'pending',
  // ...
  subtotal: checkoutData.subtotal,
  shippingCost: checkoutData.shippingCost,
  tax: checkoutData.tax,
  total: checkoutData.total,
  // ... billing address (not in schema)
}
```

**After**:
```typescript
data: {
  orderNumber,
  customer: checkoutData.customerId,
  orderStatus: 'pending',      // ✅ Changed from 'status'
  paymentStatus: 'pending',
  paymentMethod: checkoutData.paymentMethod,  // ✅ Added
  totalAmount: checkoutData.total,  // ✅ Changed from 'total'
  shippingCost: checkoutData.shippingCost,
  // ✅ Removed billing address (not in schema)
}
```

**Reasons**:
- Collection uses `orderStatus` not `status`
- Collection uses `totalAmount` not `total`
- Collection doesn't have `subtotal` or `tax` fields
- Collection doesn't have `billingAddress` group
- Added `paymentMethod` field

---

### 4. ✅ Fixed Order Items Creation

**File**: [src/feature/checkout/actions/create-order.ts](src/feature/checkout/actions/create-order.ts)

**Changes** (lines 64-78):

**Before**:
```typescript
data: {
  order: order.id,
  product: item.productId,
  variant: item.variantId,
  productName: item.productName,      // ❌ Not in schema
  variantName: item.variantName,      // ❌ Not in schema
  quantity: item.quantity,
  price: item.price,
  subtotal: item.subtotal,
}
```

**After**:
```typescript
data: {
  order: order.id,
  product: item.productId,
  variant: item.variantId,
  productSnapshot: {                  // ✅ Using correct structure
    title: item.productName,
    variantTitle: item.variantName,
  },
  quantity: item.quantity,
  price: item.price,
  subtotal: item.subtotal,
}
```

**Reason**: OrderItems collection uses `productSnapshot` group with `title` and `variantTitle` fields, not flat `productName` and `variantName`.

---

### 5. ✅ Fixed Payment Reference Update

**File**: [src/feature/checkout/actions/create-order.ts](src/feature/checkout/actions/create-order.ts)

**Changes** (lines 107-128):

**Before**:
```typescript
data: {
  // paymentReference,  // ❌ Commented out
  vaNumber,
}
```

**After**:
```typescript
const updateData: any = {
  paymentReference,
}

if (vaNumber) {
  updateData.vaNumber = vaNumber
}

data: updateData
```

**Reason**:
- `paymentReference` field now exists in collection (was added)
- `vaNumber` is optional, only add if provided
- Using dynamic object to avoid TypeScript errors

---

### 6. ✅ Fixed Order Status Update with Proper Types

**File**: [src/feature/checkout/actions/create-order.ts](src/feature/checkout/actions/create-order.ts)

**Changes** (lines 144-165):

**Before**:
```typescript
export async function updateOrderStatus(
  orderId: string,
  status: string,        // ❌ Wrong field name
  paymentStatus: string, // ❌ Generic string type
)
```

**After**:
```typescript
export async function updateOrderStatus(
  orderId: string,
  orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled',  // ✅ Typed
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded',  // ✅ Typed
)
```

**Updated data**:
```typescript
data: {
  orderStatus,    // ✅ Changed from 'status'
  paymentStatus,
}
```

**Reasons**:
- Field is `orderStatus` not `status`
- Added proper TypeScript types matching collection options
- Prevents invalid status values

---

## Summary of Collection Schema

### Orders Collection Fields
```
- orderNumber: text (unique)
- customer: relationship (customers)
- sessionId: text (for guest)
- guestName, guestEmail, guestPhone: text/email
- shippingAddress: group
  - recipientName: text
  - phone: text
  - addressLine1: text
  - addressLine2: text (optional)
  - city: text
  - province: text
  - postalCode: text
  - country: text ✅ (newly added)
- paymentMethod: text ✅ (newly added)
- paymentReference: text ✅ (newly added)
- vaNumber: text ✅ (newly added)
- orderStatus: select (pending/processing/shipped/delivered/cancelled)
- paymentStatus: select (pending/paid/failed/refunded)
- totalAmount: number
- shippingCost: number
- discount: number
- notes: textarea
```

### Order Items Collection Fields
```
- order: relationship (orders)
- product: relationship (products)
- variant: text
- productSnapshot: group
  - title: text
  - variantTitle: text
  - sku: text (optional)
  - imageUrl: text (optional)
- quantity: number
- price: number
- subtotal: number (auto-calculated)
```

---

## Testing Checklist

After these fixes, test:

- [ ] Create order with guest user
- [ ] Create order with logged-in user
- [ ] Order items are created correctly with product snapshot
- [ ] Payment reference is stored after Duitku payment
- [ ] VA number is stored for VA payments
- [ ] Order status updates work correctly
- [ ] Payment status updates work correctly
- [ ] All fields match collection schema
- [ ] No TypeScript errors

---

## Migration Notes

If you have existing orders in the database, you may need to run a migration to:
1. Add `country` field to existing shipping addresses
2. Rename `status` to `orderStatus` (if any old data exists)
3. Rename `total` to `totalAmount` (if any old data exists)
4. Add `paymentMethod`, `paymentReference`, `vaNumber` fields

---

**Status**: ✅ All Issues Fixed
**Date**: 2026-02-08
