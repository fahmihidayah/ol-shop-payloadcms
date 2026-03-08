# Order Detail Page Implementation

## Overview

Comprehensive order detail page showing order information, delivery status, shipping address, order items, and payment summary.

## Features

✅ Order header with order number and date
✅ Delivery status with order and payment status badges
✅ Shipping address display
✅ Order items list with product images
✅ Order summary with pricing breakdown
✅ Tracking number and payment reference (if available)
✅ Responsive design (mobile and desktop)
✅ Authorization check (users can only view their own orders)
✅ Small, reusable components

## File Structure

```
src/
├── feature/order/
│   ├── detail/
│   │   ├── components/
│   │   │   ├── order-header.tsx               # Order number and date
│   │   │   ├── order-status-badge.tsx         # Status badges for order/payment
│   │   │   ├── delivery-address-card.tsx      # Shipping address card
│   │   │   ├── delivery-status-card.tsx       # Order/payment status + tracking
│   │   │   ├── order-item-row.tsx             # Single order item
│   │   │   ├── order-items-card.tsx           # List of order items
│   │   │   ├── order-summary-card.tsx         # Pricing summary
│   │   │   ├── order-detail-page.tsx          # Main page component
│   │   │   └── index.ts                       # Component exports
│   │   └── actions/
│   │       ├── get-order-detail.ts            # Server action to fetch order
│   │       └── index.ts                       # Action exports
│   └── services/
│       └── order-service.ts                   # Added findById method
├── app/(frontend)/(account)/account/orders/
│   └── [id]/
│       └── page.tsx                           # Order detail route
└── lib/
    └── utils.ts                               # Added formatCurrency & formatDate
```

## Components

### 1. OrderHeader
Displays order number and creation date

**Props:**
- `order: Order` - The order object

**Location:** [order-header.tsx](src/feature/order/detail/components/order-header.tsx:1-26)

### 2. OrderStatusBadge & PaymentStatusBadge
Colored badges for order and payment status

**Props:**
- `status: OrderStatus | PaymentStatus` - The status to display

**Statuses:**
- **Order:** pending (yellow), processing (blue), shipped (purple), delivered (green), cancelled (red)
- **Payment:** pending (yellow), paid (green), failed (red), refunded (gray)

**Location:** [order-status-badge.tsx](src/feature/order/detail/components/order-status-badge.tsx:1-43)

### 3. DeliveryAddressCard
Shows shipping address information

**Props:**
- `shippingAddress: Order['shippingAddress']` - The shipping address

**Displays:**
- Recipient name and phone
- Full address with city, province, postal code
- Country

**Location:** [delivery-address-card.tsx](src/feature/order/detail/components/delivery-address-card.tsx:1-34)

### 4. DeliveryStatusCard
Shows delivery and payment status with tracking info

**Props:**
- `order: Order` - The order object

**Displays:**
- Order status badge
- Payment status badge
- Shipping service name (if available)
- Tracking number (if available)
- Payment reference (if available)
- Virtual account number (if available)

**Location:** [delivery-status-card.tsx](src/feature/order/detail/components/delivery-status-card.tsx:1-70)

### 5. OrderItemRow
Single order item with image, name, variant, quantity, and price

**Props:**
- `item: OrderItem` - The order item

**Displays:**
- Product image (from snapshot or product thumbnail)
- Product name (from snapshot or product)
- Variant name
- SKU (if available)
- Quantity × Unit Price
- Subtotal

**Location:** [order-item-row.tsx](src/feature/order/detail/components/order-item-row.tsx:1-56)

### 6. OrderItemsCard
List of all order items

**Props:**
- `items: OrderItem[]` - Array of order items

**Location:** [order-items-card.tsx](src/feature/order/detail/components/order-items-card.tsx:1-27)

### 7. OrderSummaryCard
Pricing breakdown and payment method

**Props:**
- `order: Order` - The order object
- `itemsSubtotal: number` - Sum of all item subtotals

**Displays:**
- Items subtotal
- Shipping cost
- Discount (if any)
- Total amount (highlighted)
- Payment method
- Order notes (if any)

**Location:** [order-summary-card.tsx](src/feature/order/detail/components/order-summary-card.tsx:1-72)

### 8. OrderDetailPage
Main component that orchestrates all cards

**Props:**
- `order: Order` - The order object
- `orderItems: OrderItem[]` - Array of order items

**Layout:**
- **Header:** Back button + Order header
- **Left column (2/3):** Order items card
- **Right column (1/3):** Order summary, delivery status, delivery address

**Location:** [order-detail-page.tsx](src/feature/order/detail/components/order-detail-page.tsx:1-49)

## Server Actions

### getOrderDetail(orderId: string)

Fetches order details with authorization check

**Parameters:**
- `orderId: string` - The order ID

**Returns:**
- `OrderDetailResult | null` - Order with items, or null if not found/unauthorized

**Authorization:**
- Authenticated users: Must match `order.customer` ID
- Guest users: Currently not supported (session-based auth could be added)

**Location:** [get-order-detail.ts](src/feature/order/actions/get-order-detail.ts:1-70)

**Example:**
```typescript
const orderDetail = await getOrderDetail('order-123')
if (orderDetail) {
  const { order, orderItems } = orderDetail
}
```

## OrderService Updates

### findById({ serviceContext, orderId })

Added method to find order by ID

**Parameters:**
- `serviceContext: ServiceContext` - Contains payload instance
- `orderId: string` - The order ID to find

**Returns:**
- `ServiceResult<Order>` - Order or error

**Location:** [order-service.ts:144-177](src/feature/order/services/order-service.ts:144-177)

**Example:**
```typescript
const result = await OrderService.findById({
  serviceContext: { payload },
  orderId: 'order-123'
})

if (!result.error) {
  console.log('Order:', result.data)
}
```

## Tests

Added tests for `OrderService.findById`:

**Test Cases:**
1. ✅ Should find order by ID successfully
2. ✅ Should return error when order not found
3. ✅ Should handle findByID error

**Location:** [order-service.int.spec.ts:403-459](tests/int/feature/order/services/order-service.int.spec.ts:403-459)

**Run tests:**
```bash
pnpm vitest run tests/int/feature/order/services/order-service.int.spec.ts
```

## Utility Functions

### formatCurrency(amount: number): string

Formats number as Indonesian Rupiah

**Example:**
```typescript
formatCurrency(100000) // "Rp100.000"
```

### formatDate(date: string | Date): string

Formats date to readable format

**Example:**
```typescript
formatDate('2024-02-21') // "February 21, 2024"
```

**Location:** [utils.ts:9-31](src/lib/utils.ts:9-31)

## Page Route

### /account/orders/[id]

Dynamic route for order detail page

**Location:** [page.tsx](src/app/(frontend)/(account)/account/orders/[id]/page.tsx:1-29)

**Flow:**
1. Get order ID from route params
2. Check if user is authenticated (redirect to login if not)
3. Fetch order details with `getOrderDetail()`
4. Show 404 if order not found or unauthorized
5. Render `OrderDetailPage` component

**Authorization:**
- Requires authentication
- User can only view their own orders
- Returns 404 for unauthorized access attempts

## Responsive Design

### Mobile (< 768px)
- Single column layout
- Order items card on top
- Info cards stacked below
- Smaller text sizes
- Compact spacing

### Desktop (≥ 768px)
- Two-column layout (2/3 + 1/3)
- Order items on left
- Info cards on right (sticky)
- Larger text sizes
- Comfortable spacing

## Usage Example

### Link to Order Detail Page

```typescript
<Link href={`/account/orders/${order.id}`}>
  View Order Details
</Link>
```

### Display in Order List

```typescript
import { formatCurrency, formatDate } from '@/lib/utils'
import { OrderStatusBadge } from '@/feature/order/detail/components'

function OrderRow({ order }) {
  return (
    <div>
      <Link href={`/account/orders/${order.id}`}>
        <p>Order #{order.orderNumber}</p>
        <p>{formatDate(order.createdAt)}</p>
        <p>{formatCurrency(order.totalAmount)}</p>
        <OrderStatusBadge status={order.orderStatus} />
      </Link>
    </div>
  )
}
```

## Security Considerations

### Authorization
- ✅ User authentication required
- ✅ Users can only view their own orders
- ✅ Order ownership verified via `customer` field
- ⚠️ Guest users (session-based) not fully supported

### Data Protection
- ✅ Server-side data fetching
- ✅ No sensitive data in client components
- ✅ Payment references shown (safe for user)
- ✅ Error handling prevents information leakage

## Future Enhancements

1. **Guest User Support**
   - Verify guest orders via sessionId
   - Or require order number + email verification

2. **Order Actions**
   - Cancel order button (if status allows)
   - Download invoice
   - Print order details
   - Request refund

3. **Real-time Updates**
   - Track shipping updates
   - Payment status changes
   - Delivery notifications

4. **Enhanced Tracking**
   - Integration with shipping providers
   - Real-time tracking map
   - Delivery timeline

5. **Reviews**
   - Add product review after delivery
   - Rate order experience

## Accessibility

- ✅ Semantic HTML structure
- ✅ Proper heading hierarchy
- ✅ Alt text for images
- ✅ Keyboard navigation support
- ✅ Screen reader friendly
- ✅ Color contrast compliance

## Performance

- ✅ Server-side rendering
- ✅ Optimized images with Next.js Image
- ✅ Minimal client-side JavaScript
- ✅ Component code splitting
- ✅ Efficient database queries

## Browser Support

- ✅ Modern browsers (Chrome, Firefox, Safari, Edge)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)
- ✅ Responsive design for all screen sizes

## Summary

The order detail page provides a comprehensive view of order information with:

- **Clear organization** - Information grouped into logical cards
- **Responsive layout** - Works on all device sizes
- **Reusable components** - Small, focused components
- **Type-safe** - Full TypeScript coverage
- **Secure** - Authorization checks and server-side rendering
- **User-friendly** - Clear status badges and formatting
- **Maintainable** - Well-organized file structure

All components follow the existing codebase patterns and use the established service layer for data access.
