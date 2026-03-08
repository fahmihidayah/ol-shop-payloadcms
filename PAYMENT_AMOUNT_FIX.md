# Payment Amount Validation Fix

## Issue
Duitku API was returning the error: `{ Message: 'Payment amount must be equal to all item price' }`

The problem occurred because shipping cost was being added to the `itemDetails` array, but the total calculation wasn't properly validated to ensure the sum of all item prices matched the payment amount.

## Root Cause

**Location**: [create-payment.ts:89-96](src/feature/order/actions/checkout/create-payment.ts#L89-L96)

**Problem**:
1. Items were mapped to `itemDetails` with their individual prices
2. Shipping cost was added as a separate item in the payment request
3. No validation existed to ensure `sum(itemDetails[].price * quantity)` equals `paymentAmount`
4. The shipping item was being added inline in the function call, making it hard to track

## Solution

### 1. Moved Shipping Addition Earlier (Lines 40-48)

**Before**:
```typescript
const itemDetails: DuitkuItemDetail[] = checkoutData.items.map((item) => ({
  name: `${item.productName} - ${item.variantName}`,
  price: item.price,
  quantity: item.quantity,
}))

// Later in the code...
itemDetails: [
  ...itemDetails,
  {
    name: 'shipingCost',
    price: checkoutData.shipingCost,
    quantity: 1,
  },
],
```

**After**:
```typescript
const itemDetails: DuitkuItemDetail[] = checkoutData.items.map((item) => ({
  name: `${item.productName} - ${item.variantName}`,
  price: item.price,
  quantity: item.quantity,
}))

// Add shipping cost as a separate item
if (checkoutData.shipingCost > 0) {
  itemDetails.push({
    name: 'Shipping Cost',
    price: checkoutData.shipingCost,
    quantity: 1,
  })
}
```

**Benefits**:
- Shipping is added to the array early for proper calculation
- Only added if shipping cost > 0
- Clear, readable code

### 2. Added Total Validation (Lines 92-108)

**Added**:
```typescript
// Calculate total from itemDetails to ensure it matches
const itemDetailsTotal = itemDetails.reduce(
  (sum, item) => sum + item.price * item.quantity,
  0,
)

// Verify calculation matches checkoutData.total
const expectedTotal = Math.round(checkoutData.total)
if (itemDetailsTotal !== expectedTotal) {
  console.warn(
    `[PROCESS_CHECKOUT] Total mismatch - itemDetails: ${itemDetailsTotal}, expected: ${expectedTotal}`,
  )
  return {
    success: false,
    error: `Payment amount mismatch. Item total: ${itemDetailsTotal}, Expected: ${expectedTotal}`,
  }
}
```

**Benefits**:
- Validates that itemDetails sum equals the expected total
- Provides clear error message if mismatch occurs
- Logs warning for debugging
- Prevents invalid payment requests to Duitku

### 3. Use Calculated Total (Line 112)

**Before**:
```typescript
amount: Math.round(checkoutData.total),
```

**After**:
```typescript
amount: itemDetailsTotal, // Use calculated total to ensure accuracy
```

**Benefits**:
- Uses the verified total from itemDetails
- Guarantees Duitku receives matching values
- Already rounded since prices are integers

### 4. Cleaned Up itemDetails Parameter (Line 118)

**Before**:
```typescript
itemDetails: [
  ...itemDetails,
  {
    name: 'shipingCost',
    price: checkoutData.shipingCost,
    quantity: 1,
  },
],
```

**After**:
```typescript
itemDetails, // Already includes shipping cost
```

**Benefits**:
- No duplication
- Cleaner code
- Shipping already added earlier

## How It Works

### Checkout Flow

1. **User places order** ([checkout-page.tsx:89](src/feature/order/components/checkout/checkout-page.tsx#L89)):
   ```typescript
   total: subtotal + shipingCost + tax
   ```

2. **processCheckout receives CheckoutData** with:
   - `items[]` - Product items with prices
   - `shipingCost` - Shipping cost
   - `total` - Calculated total (subtotal + shipping + tax)

3. **Prepare itemDetails** (Lines 34-48):
   - Map product items to Duitku format
   - Add shipping as separate item if > 0
   - Result: `itemDetails = [product1, product2, ..., shipping]`

4. **Validate totals** (Lines 92-108):
   - Calculate: `itemDetailsTotal = sum(price * quantity)`
   - Compare: `itemDetailsTotal === Math.round(checkoutData.total)`
   - If mismatch: Return error immediately

5. **Create payment** (Lines 110-120):
   - Use `itemDetailsTotal` as payment amount
   - Pass complete `itemDetails` array
   - Duitku validates: `paymentAmount === sum(itemDetails)`

### Example Calculation

**Cart**:
- Product A: 100,000 × 2 = 200,000
- Product B: 50,000 × 1 = 50,000
- Subtotal: 250,000
- Shipping: 20,000
- Tax: 0
- **Total: 270,000**

**itemDetails Array**:
```typescript
[
  { name: 'Product A - Variant X', price: 100000, quantity: 2 },
  { name: 'Product B - Variant Y', price: 50000, quantity: 1 },
  { name: 'Shipping Cost', price: 20000, quantity: 1 }
]
```

**Validation**:
```typescript
itemDetailsTotal = (100000 × 2) + (50000 × 1) + (20000 × 1)
                 = 200000 + 50000 + 20000
                 = 270,000 ✅ Matches total!
```

**Duitku Request**:
```typescript
{
  paymentAmount: 270000,
  itemDetails: [...],
  // Duitku validates: sum(itemDetails) === paymentAmount ✅
}
```

## Testing

### Test Case 1: Valid Total
```typescript
checkoutData = {
  items: [
    { productName: 'Product A', price: 100000, quantity: 2, subtotal: 200000 },
    { productName: 'Product B', price: 50000, quantity: 1, subtotal: 50000 },
  ],
  shipingCost: 20000,
  total: 270000,
}

// Expected: Success
// itemDetailsTotal = 270000 = total ✅
```

### Test Case 2: No Shipping
```typescript
checkoutData = {
  items: [
    { productName: 'Product A', price: 100000, quantity: 1, subtotal: 100000 },
  ],
  shipingCost: 0,
  total: 100000,
}

// Expected: Success
// itemDetailsTotal = 100000 = total ✅
// Shipping item NOT added to array
```

### Test Case 3: Mismatch (Edge Case)
```typescript
checkoutData = {
  items: [
    { productName: 'Product A', price: 100000, quantity: 2, subtotal: 200000 },
  ],
  shipingCost: 20000,
  total: 250000, // Wrong! Should be 220000
}

// Expected: Error
// itemDetailsTotal = 220000 ≠ total (250000) ❌
// Returns: { success: false, error: 'Payment amount mismatch...' }
```

## Files Changed

### src/feature/order/actions/checkout/create-payment.ts
- **Lines 32-48**: Moved shipping addition to itemDetails earlier with conditional check
- **Lines 92-108**: Added itemDetailsTotal calculation and validation
- **Line 112**: Changed to use `itemDetailsTotal` instead of `Math.round(checkoutData.total)`
- **Line 118**: Simplified to use pre-built `itemDetails` array

## Benefits

### 1. Prevents Duitku API Errors ✅
- Guarantees `paymentAmount === sum(itemDetails)`
- No more "Payment amount must be equal to all item price" errors

### 2. Early Error Detection ✅
- Catches calculation mismatches before API call
- Clear error message for debugging
- Logs warning for investigation

### 3. Better Code Quality ✅
- Shipping handling consolidated in one place
- No inline array manipulation
- Clear separation of concerns

### 4. Maintainable ✅
- Easy to understand calculation flow
- Comments explain the logic
- Validation makes debugging easier

### 5. Type-Safe ✅
- All values properly typed
- No runtime type errors
- Clear interfaces

## Notes

1. **Typo in codebase**: `shipingCost` should be `shippingCost` (missing 'p')
   - Present in CheckoutData interface
   - Present in cart service
   - Consider fixing in future refactor

2. **Tax handling**: Currently tax is always 0
   - If tax is added in future, it should be included in itemDetails
   - Same validation logic applies

3. **Customer email**: Line 57 uses fallback `'guest@example.com'`
   - Should be passed properly in CheckoutData
   - Consider adding email field to CheckoutData interface

## Summary

The fix ensures that the payment amount sent to Duitku always matches the sum of all item prices (products + shipping), preventing API validation errors. This is achieved by:

1. Adding shipping to itemDetails early
2. Calculating and validating the total
3. Using the calculated total for payment amount
4. Providing clear error messages if validation fails

The solution is defensive, type-safe, and provides clear debugging information if issues occur.
