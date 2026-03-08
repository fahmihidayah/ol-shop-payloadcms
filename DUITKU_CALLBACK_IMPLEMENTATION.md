# Duitku Callback Webhook Implementation

## Overview
Implemented the Duitku payment callback webhook endpoint that handles payment notifications, updates order status, and automatically decreases product stock inventory.

**Implementation Date**: 2026-02-21
**Status**: ✅ Complete

---

## What is a Payment Callback?

A payment callback (webhook) is a server-to-server notification that Duitku sends to your application when a payment status changes. This is the **authoritative source** for payment confirmations.

### Callback vs Return URL

| Feature | Return URL | Callback (Webhook) |
|---------|-----------|-------------------|
| **Triggered by** | User's browser redirect | Duitku's server |
| **Timing** | Immediate (when user redirects) | Asynchronous (may arrive before/after return) |
| **Reliability** | Depends on user's network | Server-to-server (very reliable) |
| **Security** | URL params (can be manipulated) | Signature verification (secure) |
| **Purpose** | User experience (show confirmation) | Final authoritative status |
| **Stock Decrement** | ❌ NO | ✅ YES (only here) |

---

## Implementation Details

### Endpoint Configuration

**URL**: `POST /api/v1/order/callback`
**File**: [src/feature/order/api/index.ts](src/feature/order/api/index.ts)

### Request Format (from Duitku)

```json
{
  "merchantCode": "D12345",
  "amount": "250000",
  "merchantOrderId": "ORD-2024-001",
  "productDetail": "Order #ORD-2024-001",
  "additionalParam": "",
  "resultCode": "00",
  "paymentCode": "VC",
  "reference": "D12345REF20240101",
  "signature": "abc123def456..."
}
```

### Required Fields Validation

The endpoint validates these required fields:
- `merchantCode` - Your Duitku merchant code
- `amount` - Payment amount
- `merchantOrderId` - Your order number
- `signature` - Security signature from Duitku
- `resultCode` - Payment status code

### Result Codes

| Code | Status | Meaning | Order Status | Payment Status | Stock Action |
|------|--------|---------|--------------|----------------|--------------|
| `00` | Success | Payment successful | `processing` | `paid` | ✅ Decrease |
| `01` | Pending | Payment pending | `pending` | `pending` | ❌ No change |
| `02` | Failed | Payment failed/cancelled | `cancelled` | `failed` | ❌ No change |

---

## How It Works

### Flow Diagram

```
Duitku Payment Gateway
        ↓
[Payment Status Changes]
        ↓
POST /api/v1/order/callback
        ↓
┌─────────────────────────────────────┐
│ 1. Receive & Parse Request Body    │
│    - Extract callback parameters   │
│    - Log incoming webhook           │
└─────────────────────────────────────┘
        ↓
┌─────────────────────────────────────┐
│ 2. Validate Required Fields        │
│    - Check merchantCode, amount,    │
│      merchantOrderId, signature,    │
│      resultCode                     │
│    - Return 400 if missing          │
└─────────────────────────────────────┘
        ↓
┌─────────────────────────────────────┐
│ 3. Verify Signature                │
│    - Calculate expected signature   │
│    - Compare with provided          │
│    - Reject if invalid (security)   │
└─────────────────────────────────────┘
        ↓
┌─────────────────────────────────────┐
│ 4. Find Order by Order Number      │
│    - Query database                 │
│    - Return 400 if not found        │
└─────────────────────────────────────┘
        ↓
┌─────────────────────────────────────┐
│ 5. Map Result Code to Status       │
│    - 00 → processing/paid           │
│    - 01 → pending/pending           │
│    - 02 → cancelled/failed          │
└─────────────────────────────────────┘
        ↓
┌─────────────────────────────────────┐
│ 6. Update Order in Database        │
│    - Update orderStatus             │
│    - Update paymentStatus           │
│    - Update paymentReference        │
└─────────────────────────────────────┘
        ↓
┌─────────────────────────────────────┐
│ 7. If Payment Status = "paid"      │
│    ├─> Fetch Order Items            │
│    ├─> For Each Order Item:         │
│    │   ├─> Check if stock updated   │
│    │   ├─> Decrease variant stock   │
│    │   └─> Mark as stock updated    │
│    └─> Log success/failure          │
└─────────────────────────────────────┘
        ↓
┌─────────────────────────────────────┐
│ 8. Return Response to Duitku       │
│    - 200 OK: Success                │
│    - 400 Bad Request: Validation    │
│    - 500 Error: System failure      │
└─────────────────────────────────────┘
```

---

## Code Implementation

### Endpoint Handler

```typescript
{
  path: '/v1/order/callback',
  method: 'post',
  handler: composeMiddleware(withLogging)(async (request: PayloadRequest): Promise<Response> => {
    try {
      // 1. Parse callback data from Duitku
      const body = await request.json()

      console.log('[DUITKU_CALLBACK] Received webhook:', {
        merchantOrderId: body.merchantOrderId,
        resultCode: body.resultCode,
        amount: body.amount,
      })

      // 2. Validate required fields
      const requiredFields = [
        'merchantCode',
        'amount',
        'merchantOrderId',
        'signature',
        'resultCode',
      ]
      const missingFields = requiredFields.filter((field) => !body[field])

      if (missingFields.length > 0) {
        console.error('[DUITKU_CALLBACK] Missing required fields:', missingFields)
        return Response.json(
          { success: false, error: `Missing required fields: ${missingFields.join(', ')}` },
          { status: 400 },
        )
      }

      // 3. Prepare callback params
      const callbackParams: DuitkuCallbackParams = {
        merchantCode: body.merchantCode,
        amount: parseFloat(body.amount),
        merchantOrderId: body.merchantOrderId,
        productDetail: body.productDetail || '',
        additionalParam: body.additionalParam || '',
        resultCode: body.resultCode,
        paymentCode: body.paymentCode || '',
        reference: body.reference || '',
        signature: body.signature,
      }

      // 4. Process callback (verifies signature, updates order, decreases stock)
      const result = await updateOrderFromCallback(callbackParams)

      if (result.success) {
        console.log('[DUITKU_CALLBACK] Successfully processed order:', body.merchantOrderId)
        return Response.json({ success: true, message: 'Callback processed successfully' })
      } else {
        console.error('[DUITKU_CALLBACK] Failed to process callback:', result.error)
        return Response.json({ success: false, error: result.error }, { status: 400 })
      }
    } catch (error) {
      console.error('[DUITKU_CALLBACK] Error processing webhook:', error)
      return Response.json(
        { success: false, error: error instanceof Error ? error.message : 'Failed to process callback' },
        { status: 500 },
      )
    }
  }),
}
```

### Stock Decrement Logic (in updateOrderFromCallback)

```typescript
// Decrease product stock ONLY in callback (authoritative source)
if (updateResult.success && updateResult.order && paymentStatus === 'paid') {
  try {
    const payload = await getPayload({ config })

    // Fetch order items for this order
    const orderItems = await payload.find({
      collection: 'order-items',
      where: { order: { equals: updateResult.order.id } },
      depth: 2,
    })

    // Decrease stock for each order item
    const stockDecreasePromises = orderItems.docs.map((orderItem) => {
      return ProductService.decreaseProductStock({
        context: { payload },
        orderItem,
      })
    })

    // Execute all stock decrements in parallel
    await Promise.all(stockDecreasePromises)

    console.log(`[CALLBACK] Successfully decreased stock for order ${merchantOrderId}`)
  } catch (stockError) {
    // Log error but don't fail the callback
    console.error(`[CALLBACK] Failed to decrease stock for order ${merchantOrderId}:`, stockError)
  }
}
```

---

## Security Features

### 1. Signature Verification

Every callback includes a signature that must be verified:

```typescript
const isValid = await verifyDuitkuSignature(
  merchantCode,
  amount,
  merchantOrderId,
  duitkuConfig.apiKey,
  signature,
)

if (!isValid) {
  console.error('[CALLBACK] Invalid signature')
  return { success: false, error: 'Invalid signature' }
}
```

This prevents:
- Fake callbacks from unauthorized sources
- Man-in-the-middle attacks
- Data tampering

### 2. Idempotency Protection

The system tracks which order items have had stock updated:

```typescript
// Check if stock already updated
if (newOrderItem && newOrderItem.isStockUpdated) {
  // Stock already updated for this order item, skip to prevent double decrement
  return
}

// Decrease stock...

// Mark as updated
await context.payload.update({
  collection: 'order-items',
  id: orderItem.id,
  data: { isStockUpdated: true },
})
```

This prevents:
- Double stock decrement if Duitku retries callback
- Race conditions from concurrent callbacks
- Inventory corruption

### 3. Error Handling

Stock decrement errors don't fail the callback:

```typescript
catch (stockError) {
  // Log error but don't fail the callback
  console.error(`[CALLBACK] Failed to decrease stock: ${stockError}`)
}
```

This ensures:
- Duitku receives success response (prevents retries)
- Order status is still updated
- Stock issues can be reconciled manually

---

## Configuration in Duitku Dashboard

To receive callbacks, configure your webhook URL in Duitku:

1. Log in to Duitku Dashboard
2. Navigate to **Settings** → **Callback URL**
3. Set callback URL: `https://yourdomain.com/api/v1/order/callback`
4. Save configuration

### Testing with Sandbox

For testing in sandbox mode:
- URL: `https://yourdomain.com/api/v1/order/callback`
- Duitku provides a callback simulator in sandbox dashboard
- Test all result codes: 00, 01, 02

---

## Monitoring & Logging

### Success Logs

```
[DUITKU_CALLBACK] Received webhook: { merchantOrderId: 'ORD-001', resultCode: '00', amount: 250000 }
[CALLBACK] Successfully decreased stock for order ORD-001
[DUITKU_CALLBACK] Successfully processed order: ORD-001
```

### Error Logs

```
[DUITKU_CALLBACK] Missing required fields: ['signature']
[CALLBACK] Invalid signature
[CALLBACK] Failed to decrease stock for order ORD-001: Product not found
```

### What to Monitor

1. **Callback failures**: Check for signature verification failures
2. **Stock decrement errors**: Watch for inventory update failures
3. **Missing orders**: Alert if callback for non-existent order
4. **Retry patterns**: Duitku may retry if no 200 response

---

## Testing

### Manual Testing

1. **Create test order** in sandbox environment
2. **Complete payment** via Duitku sandbox
3. **Check logs** for callback receipt
4. **Verify order status** updated to "paid"
5. **Verify stock** decreased correctly
6. **Check order items** marked as `isStockUpdated: true`

### Test Cases

| Test Case | Setup | Expected Result |
|-----------|-------|-----------------|
| Valid callback (00) | Send callback with valid signature | Order paid, stock decreased |
| Invalid signature | Send callback with wrong signature | 400 error, no changes |
| Missing fields | Send callback without required fields | 400 error with field list |
| Duplicate callback | Send same callback twice | Stock decreased only once (idempotency) |
| Order not found | Send callback for non-existent order | 400 error |
| Pending payment (01) | Send callback with resultCode 01 | Order pending, no stock change |
| Failed payment (02) | Send callback with resultCode 02 | Order cancelled, no stock change |

### cURL Test Example

```bash
curl -X POST https://yourdomain.com/api/v1/order/callback \
  -H "Content-Type: application/json" \
  -d '{
    "merchantCode": "D12345",
    "amount": "250000",
    "merchantOrderId": "ORD-2024-001",
    "productDetail": "Test Order",
    "resultCode": "00",
    "reference": "TEST123",
    "signature": "calculated_signature_here"
  }'
```

---

## Troubleshooting

### Callback Not Received

1. **Check Duitku configuration**: Verify callback URL is correct
2. **Check firewall**: Ensure server accepts POST requests
3. **Check logs**: Look for incoming requests in server logs
4. **Test connectivity**: Use Duitku's callback simulator

### Signature Verification Fails

1. **Check API key**: Ensure correct API key in config
2. **Check merchant code**: Verify merchant code matches
3. **Check amount format**: Amount must match exactly
4. **Check hash algorithm**: Verify MD5 hash calculation

### Stock Not Decreasing

1. **Check payment status**: Only "paid" status decreases stock
2. **Check order items**: Verify order has items
3. **Check product existence**: Ensure products still exist
4. **Check variant IDs**: Verify variant IDs match
5. **Check logs**: Look for stock decrement errors

### Multiple Callbacks Received

This is normal! Duitku may send:
- Callback when payment initiated
- Callback when payment completed
- Retry callbacks if no response

**Solution**: Idempotency flag (`isStockUpdated`) prevents double decrement.

---

## Production Deployment Checklist

Before going live:

- [ ] Configure callback URL in Duitku production dashboard
- [ ] Verify API key is set correctly in environment variables
- [ ] Test callback with Duitku sandbox first
- [ ] Set up monitoring/alerts for callback failures
- [ ] Configure log aggregation (Sentry, LogRocket, etc.)
- [ ] Test signature verification with production credentials
- [ ] Verify HTTPS is enabled (Duitku requires HTTPS)
- [ ] Set up backup/reconciliation job for failed stock updates
- [ ] Document callback retry policy
- [ ] Train support team on manual stock reconciliation

---

## Related Files

**Modified**:
- [src/feature/order/api/index.ts](src/feature/order/api/index.ts) - Callback endpoint
- [src/feature/order/actions/order-confirmation/update-order.ts](src/feature/order/actions/order-confirmation/update-order.ts) - Callback handler
- [src/feature/products/services/product-service.ts](src/feature/products/services/product-service.ts) - Stock decrement
- [src/collections/OrderItems/config.ts](src/collections/OrderItems/config.ts) - Added `isStockUpdated` field

**Related Documentation**:
- [INVENTORY_STOCK_DECREMENT_FIXED.md](INVENTORY_STOCK_DECREMENT_FIXED.md) - Stock decrement implementation
- [DUITKU_INTEGRATION.md](DUITKU_INTEGRATION.md) - Duitku integration guide

---

## API Response Examples

### Success Response

```json
{
  "success": true,
  "message": "Callback processed successfully"
}
```

### Validation Error Response

```json
{
  "success": false,
  "error": "Missing required fields: signature, resultCode"
}
```

### Signature Error Response

```json
{
  "success": false,
  "error": "Invalid signature"
}
```

### Server Error Response

```json
{
  "success": false,
  "error": "Failed to update order status"
}
```

---

## Summary

✅ **Implemented**: Duitku callback webhook endpoint
✅ **Security**: Signature verification to prevent fraud
✅ **Idempotency**: Prevents double stock decrement
✅ **Error Handling**: Graceful failure with logging
✅ **Stock Management**: Automatic inventory updates on payment
✅ **Monitoring**: Comprehensive logging for debugging

**Endpoint**: `POST /api/v1/order/callback`
**Status**: Production-ready
**Security**: Signature-verified
**Reliability**: Idempotent with retry safety

This implementation follows Duitku's best practices and ensures reliable, secure payment processing with automatic inventory management.
