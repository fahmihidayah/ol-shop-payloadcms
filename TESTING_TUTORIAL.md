# Testing Tutorial - Simple Guide

This guide shows you how to write tests for services using the constant object pattern.

## 📋 Table of Contents

1. [Understanding the Service Pattern](#understanding-the-service-pattern)
2. [Basic Test Structure](#basic-test-structure)
3. [Writing Your First Test](#writing-your-first-test)
4. [Common Testing Patterns](#common-testing-patterns)
5. [Running Tests](#running-tests)

---

## Understanding the Service Pattern

We use a **constant object pattern** for services:

```typescript
// Service implementation
export const OrderService = {
  create: async ({ context, checkoutData }) => { /* ... */ },
  update: async ({ serviceContext, orderId, data }) => { /* ... */ },
  delete: async ({ serviceContext, id }) => { /* ... */ },
}
```

This pattern makes testing easier because you can mock the entire object.

---

## Basic Test Structure

### Step 1: Import Dependencies

```typescript
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { OrderService } from '@/feature/order/services/order-service'
import type { ServiceContext } from '@/types/service-context'
import type { BasePayload } from 'payload'
```

### Step 2: Set Up Mock Objects

```typescript
describe('OrderService', () => {
  let mockPayload: BasePayload
  let mockServiceContext: ServiceContext

  beforeEach(() => {
    // Create mock payload with methods we'll use
    mockPayload = {
      create: vi.fn(),
      update: vi.fn(),
      find: vi.fn(),
      delete: vi.fn(),
    } as unknown as BasePayload

    // Create mock service context
    mockServiceContext = {
      collection: 'orders',
      payload: mockPayload,
    }

    // Clear all mocks before each test
    vi.clearAllMocks()
  })

  afterEach(() => {
    // Clean up after each test
    vi.clearAllMocks()
  })

  // Tests go here...
})
```

### Step 3: Write Tests

```typescript
it('should create order successfully', async () => {
  // 1. ARRANGE: Prepare test data
  const mockOrder = {
    id: 'order-123',
    orderNumber: 'ORD-123',
    totalAmount: 100000,
  }

  // 2. ARRANGE: Configure mock behavior
  vi.mocked(mockPayload.create).mockResolvedValue(mockOrder)

  // 3. ACT: Call the function you're testing
  const result = await OrderService.create({
    context: mockServiceContext,
    checkoutData: { /* data */ },
  })

  // 4. ASSERT: Verify the results
  expect(result.data).toEqual(mockOrder)
  expect(result.error).toBeUndefined()
  expect(mockPayload.create).toHaveBeenCalledTimes(1)
})
```

---

## Writing Your First Test

Let's write a complete test for a service method step by step.

### Example: Testing AddressService.create()

```typescript
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { AddressService } from '@/feature/account/services/address-service'
import type { ServiceContext } from '@/types/service-context'
import type { Address, Customer } from '@/payload-types'
import type { BasePayload } from 'payload'

// Mock the service
vi.mock('@/feature/account/services/address-service', () => ({
  AddressService: {
    create: vi.fn(),
    findAll: vi.fn(),
    delete: vi.fn(),
  },
}))

describe('AddressService', () => {
  let mockPayload: BasePayload
  let mockServiceContext: ServiceContext
  let mockCustomer: Customer

  beforeEach(() => {
    // Set up mock data
    mockCustomer = {
      id: 'customer-123',
      email: 'test@example.com',
      name: 'Test User',
    } as Customer

    mockPayload = {
      create: vi.fn(),
    } as unknown as BasePayload

    mockServiceContext = {
      collection: 'addresses',
      payload: mockPayload,
      user: mockCustomer,
    }

    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('create', () => {
    it('should create address successfully', async () => {
      // ARRANGE: Prepare input data
      const addressData = {
        label: 'Home',
        recipientName: 'John Doe',
        phone: '+628123456789',
        addressLine1: '123 Main St',
        city: 'Jakarta',
        province: 'DKI Jakarta',
        postalCode: '12345',
        country: 'ID',
      }

      // ARRANGE: Prepare expected output
      const mockCreatedAddress: Address = {
        id: 'address-123',
        ...addressData,
        customer: mockCustomer.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Address

      // ARRANGE: Configure mock response
      vi.mocked(AddressService.create).mockResolvedValue({
        data: mockCreatedAddress,
        error: false,
        message: 'Success',
      })

      // ACT: Call the service
      const result = await AddressService.create({
        data: addressData,
        serviceContext: mockServiceContext,
      })

      // ASSERT: Verify the results
      expect(result.data).toEqual(mockCreatedAddress)
      expect(result.error).toBe(false)
      expect(AddressService.create).toHaveBeenCalledWith({
        data: addressData,
        serviceContext: mockServiceContext,
      })
      expect(AddressService.create).toHaveBeenCalledTimes(1)
    })
  })
})
```

---

## Common Testing Patterns

### Pattern 1: Test Success Scenario

```typescript
it('should perform action successfully', async () => {
  // Mock successful response
  vi.mocked(Service.method).mockResolvedValue({
    data: expectedData,
    error: false,
  })

  const result = await Service.method(params)

  expect(result.data).toEqual(expectedData)
  expect(result.error).toBe(false)
})
```

### Pattern 2: Test Error Scenario

```typescript
it('should return error when operation fails', async () => {
  // Mock error response
  vi.mocked(Service.method).mockResolvedValue({
    data: undefined,
    error: true,
    message: 'Operation failed',
  })

  const result = await Service.method(params)

  expect(result.error).toBe(true)
  expect(result.message).toBe('Operation failed')
  expect(result.data).toBeUndefined()
})
```

### Pattern 3: Test Exception Handling

```typescript
it('should handle thrown errors', async () => {
  // Mock thrown error
  vi.mocked(Service.method).mockRejectedValue(
    new Error('Database error')
  )

  await expect(Service.method(params)).rejects.toThrow('Database error')
})
```

### Pattern 4: Test with Different Inputs

```typescript
it('should handle optional parameters', async () => {
  const mockResult = { id: '123', name: 'Test' }

  vi.mocked(Service.method).mockResolvedValue({
    data: mockResult,
    error: false,
  })

  // Call without optional parameter
  const result = await Service.method({ required: 'value' })

  expect(result.data).toEqual(mockResult)
  expect(Service.method).toHaveBeenCalledWith({
    required: 'value',
  })
})
```

### Pattern 5: Test Multiple Calls

```typescript
it('should handle multiple items', async () => {
  const mockItems = [{ id: '1' }, { id: '2' }, { id: '3' }]

  vi.mocked(mockPayload.create).mockResolvedValue({ id: 'item' })

  await Service.createMultiple({ items: mockItems })

  // Verify create was called for each item
  expect(mockPayload.create).toHaveBeenCalledTimes(3)
})
```

### Pattern 6: Verify Function Arguments

```typescript
it('should call service with correct parameters', async () => {
  await Service.method({
    id: '123',
    name: 'Test',
    active: true,
  })

  expect(Service.method).toHaveBeenCalledWith({
    id: '123',
    name: 'Test',
    active: true,
  })

  // Or use partial matching
  expect(Service.method).toHaveBeenCalledWith(
    expect.objectContaining({
      id: '123',
      name: 'Test',
    })
  )
})
```

---

## Complete Example: OrderService Tests

Here's a complete example testing all scenarios for a service method:

```typescript
describe('OrderService.updateOrderStatus', () => {
  it('should update order status successfully', async () => {
    const mockUpdatedOrder = {
      id: 'order-123',
      orderStatus: 'processing',
      paymentStatus: 'paid',
    }

    vi.mocked(mockPayload.update).mockResolvedValue(mockUpdatedOrder)

    const result = await OrderService.updateOrderStatus({
      serviceContext: mockServiceContext,
      orderId: 'order-123',
      orderStatus: 'processing',
      paymentStatus: 'paid',
    })

    expect(result.data).toEqual(mockUpdatedOrder)
    expect(result.error).toBe(false)
  })

  it('should update with optional payment reference', async () => {
    const mockUpdatedOrder = {
      id: 'order-123',
      orderStatus: 'processing',
      paymentStatus: 'paid',
      paymentReference: 'REF-123',
    }

    vi.mocked(mockPayload.update).mockResolvedValue(mockUpdatedOrder)

    const result = await OrderService.updateOrderStatus({
      serviceContext: mockServiceContext,
      orderId: 'order-123',
      orderStatus: 'processing',
      paymentStatus: 'paid',
      paymentReference: 'REF-123',
    })

    expect(result.data?.paymentReference).toBe('REF-123')
    expect(mockPayload.update).toHaveBeenCalledWith({
      collection: 'orders',
      id: 'order-123',
      data: {
        orderStatus: 'processing',
        paymentStatus: 'paid',
        paymentReference: 'REF-123',
      },
    })
  })

  it('should handle all valid order statuses', async () => {
    const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']

    for (const status of statuses) {
      vi.mocked(mockPayload.update).mockResolvedValue({
        id: 'order-123',
        orderStatus: status,
      })

      const result = await OrderService.updateOrderStatus({
        serviceContext: mockServiceContext,
        orderId: 'order-123',
        orderStatus: status,
        paymentStatus: 'paid',
      })

      expect(result.data?.orderStatus).toBe(status)
      vi.clearAllMocks()
    }
  })

  it('should handle update error', async () => {
    vi.mocked(mockPayload.update).mockRejectedValue(
      new Error('Update failed')
    )

    await expect(
      OrderService.updateOrderStatus({
        serviceContext: mockServiceContext,
        orderId: 'order-123',
        orderStatus: 'processing',
        paymentStatus: 'paid',
      })
    ).rejects.toThrow('Update failed')
  })
})
```

---

## Running Tests

### Run All Tests
```bash
pnpm vitest run
```

### Run Specific Test File
```bash
pnpm vitest run tests/int/feature/order/services/order-service.int.spec.ts
```

### Run Tests in Watch Mode
```bash
pnpm vitest
```

### Run Tests with Coverage
```bash
pnpm vitest run --coverage
```

### Run Tests for Specific Pattern
```bash
pnpm vitest run tests/int/feature/account/
```

---

## Key Takeaways

1. **AAA Pattern**: Always follow **Arrange** → **Act** → **Assert**
2. **Mock External Dependencies**: Don't make real database calls in tests
3. **Clean Between Tests**: Use `beforeEach` and `afterEach` to reset state
4. **Test All Scenarios**: Success, errors, edge cases, and exceptions
5. **Descriptive Test Names**: Use `should...` pattern for clarity
6. **Verify Behavior**: Check both return values and function calls

---

## Checklist for Writing Tests

- [ ] Import all necessary types and functions
- [ ] Set up mock objects in `beforeEach`
- [ ] Clear mocks in `afterEach`
- [ ] Test success scenario
- [ ] Test error scenarios
- [ ] Test with different inputs
- [ ] Test edge cases (empty, null, undefined)
- [ ] Verify function was called with correct parameters
- [ ] Verify function was called correct number of times
- [ ] Use descriptive test names

---

## Common Mistakes to Avoid

❌ **Don't**: Forget to clear mocks between tests
```typescript
// Mock state leaks between tests
it('test 1', () => { /* ... */ })
it('test 2', () => { /* ... */ }) // May fail due to mock from test 1
```

✅ **Do**: Clear mocks in beforeEach/afterEach
```typescript
afterEach(() => {
  vi.clearAllMocks()
})
```

❌ **Don't**: Test implementation details
```typescript
expect(service.internalMethod).toHaveBeenCalled() // Internal method
```

✅ **Do**: Test behavior and results
```typescript
expect(result.data).toEqual(expectedData) // Public API
```

❌ **Don't**: Write tests that depend on each other
```typescript
let sharedData
it('test 1', () => { sharedData = 123 })
it('test 2', () => { expect(sharedData).toBe(123) }) // Bad!
```

✅ **Do**: Make each test independent
```typescript
it('test 1', () => {
  const data = 123
  expect(data).toBe(123)
})
it('test 2', () => {
  const data = 123
  expect(data).toBe(123)
})
```

---

## Next Steps

1. Look at existing test files in `tests/int/feature/`
2. Practice writing tests for simple services first
3. Gradually add more complex scenarios
4. Aim for high test coverage
5. Run tests before committing code

Happy Testing! 🎉
