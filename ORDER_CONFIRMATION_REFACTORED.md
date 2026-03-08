# Order Confirmation - Refactored Structure

This document explains the modular, refactored structure of the order confirmation feature.

## Overview

The order confirmation feature has been refactored into small, focused, reusable components and functions for better maintainability, testability, and readability.

## Directory Structure

```
src/
├── types/
│   └── order.ts                          # All order-related types
│
├── feature/order/
│   ├── actions/
│   │   ├── get-order.ts                  # Get order by order number
│   │   ├── verify-signature.ts           # Verify Duitku signature
│   │   ├── map-result-code.ts            # Map result codes to statuses
│   │   ├── update-order-status.ts        # Update order in database
│   │   └── update-order.ts               # Main update orchestrators
│   │
│   ├── components/
│   │   ├── order-confirmation.tsx        # Main confirmation component
│   │   ├── order-status-card.tsx         # Status display card
│   │   ├── order-details-card.tsx        # Order details card
│   │   ├── shipping-address-card.tsx     # Shipping address card
│   │   ├── order-action-buttons.tsx      # Action buttons
│   │   ├── order-info-card.tsx           # Additional info card
│   │   └── order-loading-state.tsx       # Loading state
│   │
│   └── utils/
│       └── get-status-info.ts            # Get status info for UI
│
└── app/(frontend)/order/confirmation/
    └── page.tsx                          # Route page
```

## Type Definitions

**File**: [src/types/order.ts](src/types/order.ts)

All order-related types are centralized in one file:

### Duitku Types
```typescript
// Return URL result codes
type DuitkuResultCode = '00' | '01' | '02'

// Transaction status codes
type DuitkuStatusCode = '00' | '01' | '02'

// Callback result codes
type DuitkuCallbackResultCode = '00' | '01'
```

### Order Types
```typescript
type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'
```

### Result Types
```typescript
interface GetOrderResult {
  success: boolean
  order?: Order
  error?: string
}

interface UpdateOrderResult {
  success: boolean
  order?: Order
  error?: string
}
```

### Callback Types
```typescript
interface DuitkuCallbackParams {
  merchantCode: string
  amount: number
  merchantOrderId: string
  reference: string
  signature: string
  resultCode: DuitkuCallbackResultCode
}
```

### UI Types
```typescript
interface OrderStatusInfo {
  icon: any
  iconColor: string
  bgColor: string
  borderColor: string
  title: string
  description: string
  status: 'success' | 'pending' | 'canceled' | 'unknown'
}
```

## Actions (Server Functions)

### 1. Get Order

**File**: [src/feature/order/actions/get-order.ts](src/feature/order/actions/get-order.ts)

**Purpose**: Retrieve order by order number

**Function**: `getOrderByOrderNumber(orderNumber: string): Promise<GetOrderResult>`

**Usage**:
```typescript
const result = await getOrderByOrderNumber('ORD-123')
if (result.success) {
  console.log(result.order)
}
```

---

### 2. Verify Signature

**File**: [src/feature/order/actions/verify-signature.ts](src/feature/order/actions/verify-signature.ts)

**Purpose**: Verify Duitku callback signature for security

**Function**: `verifyDuitkuSignature(...): boolean`

**Algorithm**: MD5(merchantCode + amount + merchantOrderId + apiKey)

**Usage**:
```typescript
const isValid = verifyDuitkuSignature(
  'D1234',
  145000,
  'ORD-123',
  'api-key',
  'signature-from-duitku'
)
```

---

### 3. Map Result Code

**File**: [src/feature/order/actions/map-result-code.ts](src/feature/order/actions/map-result-code.ts)

**Purpose**: Map Duitku result codes to order/payment statuses

**Functions**:
- `mapReturnUrlResultCode(resultCode: DuitkuResultCode)` - For return URL
- `mapCallbackResultCode(resultCode: DuitkuCallbackResultCode)` - For callback

**Mapping (Return URL)**:
```typescript
'00' → { orderStatus: 'processing', paymentStatus: 'paid' }
'01' → { orderStatus: 'pending', paymentStatus: 'pending' }
'02' → { orderStatus: 'cancelled', paymentStatus: 'failed' }
```

**Mapping (Callback)**:
```typescript
'00' → { orderStatus: 'processing', paymentStatus: 'paid' }
'01' → { orderStatus: 'cancelled', paymentStatus: 'failed' }
```

---

### 4. Update Order Status

**File**: [src/feature/order/actions/update-order-status.ts](src/feature/order/actions/update-order-status.ts)

**Purpose**: Update order in database

**Function**: `updateOrderStatus(...): Promise<UpdateOrderResult>`

**Parameters**:
- `orderId` - Order ID (not order number)
- `orderStatus` - New order status
- `paymentStatus` - New payment status
- `paymentReference` - Payment reference (optional)

**Usage**:
```typescript
const result = await updateOrderStatus(
  'order-id-123',
  'processing',
  'paid',
  'DT-REF-123'
)
```

---

### 5. Update Order (Main Orchestrators)

**File**: [src/feature/order/actions/update-order.ts](src/feature/order/actions/update-order.ts)

**Purpose**: Main functions that orchestrate the update process

#### Function: `updateOrderFromReturnUrl`
- Called when user returns from Duitku
- Updates order with initial status
- Uses: get-order → map-result-code → update-order-status

**Flow**:
```
1. Get order by order number
2. Map result code to statuses
3. Update order in database
4. Return updated order
```

#### Function: `updateOrderFromCallback`
- Called from webhook
- Verifies signature first
- Updates order with authoritative status
- Uses: verify-signature → get-order → map-result-code → update-order-status

**Flow**:
```
1. Verify signature
2. Get order by order number
3. Map callback result code
4. Update order in database
5. Return success/error
```

---

## Components (Client)

### 1. Order Confirmation (Main)

**File**: [src/feature/order/components/order-confirmation.tsx](src/feature/order/components/order-confirmation.tsx)

**Purpose**: Main orchestrator component

**Props**:
```typescript
{
  resultCode: DuitkuResultCode
  merchantOrderId: string
  reference: string
  order: Order | null
  isLoading?: boolean
}
```

**Composition**:
```tsx
<OrderConfirmation>
  <OrderLoadingState />     {/* if loading */}
  <OrderStatusCard />       {/* always */}
  <OrderDetailsCard />      {/* if order exists */}
  <ShippingAddressCard />   {/* if shipping address exists */}
  <OrderActionButtons />    {/* always */}
  <OrderInfoCard />         {/* based on status */}
</OrderConfirmation>
```

---

### 2. Order Status Card

**File**: [src/feature/order/components/order-status-card.tsx](src/feature/order/components/order-status-card.tsx)

**Purpose**: Display payment status (success/pending/canceled)

**Features**:
- Color-coded border and background
- Status icon (check/clock/x)
- Title and description

**Props**:
```typescript
{
  statusInfo: OrderStatusInfo
}
```

---

### 3. Order Details Card

**File**: [src/feature/order/components/order-details-card.tsx](src/feature/order/components/order-details-card.tsx)

**Purpose**: Display order information

**Displays**:
- Order number
- Payment reference
- Payment method
- Order status
- Payment status
- Total amount

**Props**:
```typescript
{
  order: Order
  reference: string
}
```

---

### 4. Shipping Address Card

**File**: [src/feature/order/components/shipping-address-card.tsx](src/feature/order/components/shipping-address-card.tsx)

**Purpose**: Display shipping address

**Displays**:
- Recipient name
- Phone number
- Full address
- City, province, postal code
- Country

**Props**:
```typescript
{
  shippingAddress: Order['shippingAddress']
}
```

---

### 5. Order Action Buttons

**File**: [src/feature/order/components/order-action-buttons.tsx](src/feature/order/components/order-action-buttons.tsx)

**Purpose**: Display context-appropriate action buttons

**Button Sets**:

**Success**:
- "View Order Details" (primary)
- "Continue Shopping" (outline)

**Pending**:
- "Check Order Status" (primary)
- "Back to Home" (outline)

**Canceled**:
- "Back to Cart" (primary)
- "Continue Shopping" (outline)

**Props**:
```typescript
{
  status: 'success' | 'pending' | 'canceled' | 'unknown'
  orderId?: string
}
```

---

### 6. Order Info Card

**File**: [src/feature/order/components/order-info-card.tsx](src/feature/order/components/order-info-card.tsx)

**Purpose**: Display additional contextual information

**Success Info**:
- Icon: AlertCircle (blue)
- "What's Next?"
- Confirmation email sent, shipping timeline

**Pending Info**:
- Icon: Clock (yellow)
- "Payment Processing"
- Verification in progress message

**Props**:
```typescript
{
  status: 'success' | 'pending' | 'canceled' | 'unknown'
}
```

---

### 7. Order Loading State

**File**: [src/feature/order/components/order-loading-state.tsx](src/feature/order/components/order-loading-state.tsx)

**Purpose**: Display loading state

**Features**:
- Spinning loader icon
- "Processing your order..." message

---

## Utils

### Get Status Info

**File**: [src/feature/order/utils/get-status-info.ts](src/feature/order/utils/get-status-info.ts)

**Purpose**: Convert result code to UI status info

**Function**: `getStatusInfo(resultCode: DuitkuResultCode): OrderStatusInfo`

**Returns**:
```typescript
{
  icon: LucideIcon
  iconColor: string
  bgColor: string
  borderColor: string
  title: string
  description: string
  status: 'success' | 'pending' | 'canceled' | 'unknown'
}
```

**Usage**:
```typescript
const statusInfo = getStatusInfo('00')
// Returns success status info with green colors and CheckCircle icon
```

---

## Route Page

**File**: [src/app/(frontend)/order/confirmation/page.tsx](src/app/(frontend)/order/confirmation/page.tsx)

**Purpose**: Server component that handles the route

**URL**: `/order/confirmation?merchantOrderId=XXX&resultCode=XX&reference=XXX`

**Flow**:
```
1. Extract search params
2. Validate required params exist
3. Validate result code is valid ('00', '01', '02')
4. Call updateOrderFromReturnUrl()
5. If order not found, redirect to home
6. Render OrderConfirmation component
```

**Type Safety**:
- Uses type guard `isValidResultCode()` to ensure result code is valid
- Proper TypeScript typing throughout

---

## Benefits of Refactored Structure

### 1. **Separation of Concerns**
- Each file has a single, clear responsibility
- Easy to locate and modify specific functionality

### 2. **Reusability**
- Components can be reused in other contexts
- Functions can be tested independently
- Types are shared across the application

### 3. **Maintainability**
- Small files are easier to understand
- Changes are isolated to specific files
- Less chance of breaking unrelated functionality

### 4. **Testability**
- Each function/component can be unit tested
- Mock dependencies easily
- Test specific scenarios in isolation

### 5. **Type Safety**
- Centralized types in `/types` directory
- No string literals or type casting
- TypeScript catches errors at compile time

### 6. **Readability**
- Clear naming conventions
- Focused, single-purpose functions
- Easy to understand data flow

---

## Data Flow Diagram

### User Returns from Duitku Payment

```
┌─────────────────────────────────────────────────────────────┐
│ User clicks "Back to Merchant" on Duitku                   │
│ URL: /order/confirmation?merchantOrderId=X&resultCode=00   │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ confirmation/page.tsx (Server Component)                    │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 1. Extract & validate params                            │ │
│ │ 2. Call updateOrderFromReturnUrl()                      │ │
│ └─────────────────────────┬───────────────────────────────┘ │
└───────────────────────────┼─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ update-order.ts :: updateOrderFromReturnUrl()              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 1. getOrderByOrderNumber() → get-order.ts              │ │
│ │ 2. mapReturnUrlResultCode() → map-result-code.ts       │ │
│ │ 3. updateOrderStatus() → update-order-status.ts        │ │
│ └─────────────────────────┬───────────────────────────────┘ │
└───────────────────────────┼─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ Returns UpdateOrderResult { success, order }                │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ confirmation/page.tsx renders OrderConfirmation             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Pass: resultCode, merchantOrderId, reference, order     │ │
│ └─────────────────────────┬───────────────────────────────┘ │
└───────────────────────────┼─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ order-confirmation.tsx (Client Component)                   │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 1. getStatusInfo() → utils/get-status-info.ts           │ │
│ │ 2. Render child components:                             │ │
│ │    - OrderStatusCard                                    │ │
│ │    - OrderDetailsCard                                   │ │
│ │    - ShippingAddressCard                                │ │
│ │    - OrderActionButtons                                 │ │
│ │    - OrderInfoCard                                      │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## File Size Comparison

### Before Refactoring
```
order-confirmation.tsx    →  250 lines
update-order.ts           →  220 lines
Total: 470 lines in 2 files
```

### After Refactoring
```
Types:
  order.ts                →   80 lines

Actions:
  get-order.ts            →   35 lines
  verify-signature.ts     →   25 lines
  map-result-code.ts      →   50 lines
  update-order-status.ts  →   50 lines
  update-order.ts         →  100 lines

Components:
  order-confirmation.tsx  →   60 lines
  order-status-card.tsx   →   30 lines
  order-details-card.tsx  →   60 lines
  shipping-address-card.tsx → 35 lines
  order-action-buttons.tsx→   50 lines
  order-info-card.tsx     →   50 lines
  order-loading-state.tsx →   20 lines

Utils:
  get-status-info.ts      →   60 lines

Route:
  page.tsx                →   50 lines

Total: 755 lines in 15 files
```

**Result**: More lines of code, but:
- Each file is < 100 lines
- Clear separation of concerns
- Highly reusable components
- Fully typed and testable
- Much easier to maintain

---

## Usage Examples

### Example 1: Testing Map Result Code

```typescript
import { mapReturnUrlResultCode } from '@/feature/order/actions/map-result-code'

test('maps success code correctly', () => {
  const result = mapReturnUrlResultCode('00')
  expect(result.orderStatus).toBe('processing')
  expect(result.paymentStatus).toBe('paid')
})
```

### Example 2: Reusing Order Details Card

```typescript
// In another page, like order details page
import { OrderDetailsCard } from '@/feature/order/components/order-details-card'

export function OrderDetailsPage({ order }) {
  return (
    <div>
      <OrderDetailsCard order={order} reference={order.paymentReference} />
    </div>
  )
}
```

### Example 3: Creating Custom Status Info

```typescript
import { getStatusInfo } from '@/feature/order/utils/get-status-info'

const statusInfo = getStatusInfo('00')
// Use the icon, colors, etc. in a custom component
```

---

**Status**: ✅ Fully Refactored and Modular
**Date**: 2026-02-09
