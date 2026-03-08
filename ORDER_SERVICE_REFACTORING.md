# Order Service Refactoring

## Overview
Refactored checkout actions to move all order collection operations into a centralized `OrderService` with comprehensive test coverage.

## Changes Made

### 1. Enhanced OrderService (`src/feature/order/services/order-service.ts`)

Added new method:
- **`updatePaymentReference`**: Updates order with payment reference and optional VA number

Refactored existing code:
- Extracted `createOrderItems` helper function to reduce duplication
- Extracted `updateOrder` helper function used by both `updateOrderStatus` and `updatePaymentReference`
- Improved code organization and maintainability

**Methods:**
```typescript
OrderService {
  create()                    // Create order with order items
  findByOrderNumber()         // Find order by order number
  updateOrderStatus()         // Update order and payment status
  updatePaymentReference()    // Update payment reference and VA number
  updateOrderFromReturnUrl()  // Update order from Duitku return URL
}
```

### 2. Updated Checkout Actions (`src/feature/order/actions/checkout/create-order.ts`)

**Before:**
- Direct `payload.update()` calls in actions
- Duplicated update logic across multiple functions

**After:**
- All actions now use `OrderService` methods
- Consistent error handling
- Better separation of concerns

**Refactored Functions:**
- `createOrder()` - Now handles error responses from service
- `updateOrderPayment()` - Uses `OrderService.updatePaymentReference()`
- `updateOrderStatus()` - Uses `OrderService.updateOrderStatus()`

### 3. Comprehensive Test Coverage

Created `tests/int/feature/order/services/order-service.int.spec.ts` with **20 tests**:

#### create() - 4 tests
✅ Create order with authenticated customer successfully
✅ Create order for guest user without customerId
✅ Create order with multiple items
✅ Handle create order error

#### findByOrderNumber() - 3 tests
✅ Find order by order number successfully
✅ Return error when order not found
✅ Handle find error

#### updateOrderStatus() - 5 tests
✅ Update order status successfully
✅ Update order status without payment reference
✅ Handle all valid order statuses (pending, processing, shipped, delivered, cancelled)
✅ Handle all valid payment statuses (pending, paid, failed, refunded)
✅ Handle update error

#### updatePaymentReference() - 4 tests
✅ Update payment reference successfully
✅ Update payment reference with VA number
✅ Update payment reference without VA number
✅ Handle update error

#### updateOrderFromReturnUrl() - 4 tests
✅ Update order from return URL with success code (00)
✅ Update order from return URL with pending code (01)
✅ Update order from return URL with cancelled code (02)
✅ Return error when order not found

## Test Results

```bash
✓ order-service.int.spec.ts (20 tests)
✓ All feature tests (106 tests total)
```

## Benefits

1. **Centralized Logic**: All order operations in one service
2. **Better Testability**: Service methods can be tested independently
3. **Code Reusability**: Helper functions reduce duplication
4. **Type Safety**: Proper TypeScript types throughout
5. **Error Handling**: Consistent error handling patterns
6. **Maintainability**: Easier to update and maintain

## Code Quality Improvements

- ✅ No code duplication
- ✅ Single Responsibility Principle
- ✅ Extracted helper functions for common operations
- ✅ Comprehensive test coverage (success & failure scenarios)
- ✅ Clean, readable code structure
- ✅ Proper type definitions

## Usage Example

```typescript
// In checkout action
const result = await OrderService.create({
  context: {
    collection: 'orders',
    payload,
  },
  checkoutData,
})

if (result.error) {
  return {
    success: false,
    error: result.message || 'Failed to create order',
  }
}

// Update payment reference
await OrderService.updatePaymentReference({
  serviceContext: { collection: 'orders', payload },
  orderId: 'order-123',
  paymentReference: 'DUITKU-REF-123',
  vaNumber: '8001234567890123',
})

// Update order status
await OrderService.updateOrderStatus({
  serviceContext: { collection: 'orders', payload },
  orderId: 'order-123',
  orderStatus: 'processing',
  paymentStatus: 'paid',
  paymentReference: 'REF-123',
})
```

## Files Modified

- `src/feature/order/services/order-service.ts` - Enhanced with new methods and helpers
- `src/feature/order/actions/checkout/create-order.ts` - Refactored to use OrderService

## Files Created

- `tests/int/feature/order/services/order-service.int.spec.ts` - Comprehensive test suite
