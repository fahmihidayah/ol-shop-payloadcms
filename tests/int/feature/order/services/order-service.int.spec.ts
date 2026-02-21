import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { OrderService } from '@/feature/order/services/order-service'
import type { ServiceContext } from '@/types/service-context'
import type { CheckoutData, CheckoutItem } from '@/types/checkout'
import type { Order, OrderItem } from '@/payload-types'
import type { BasePayload } from 'payload'
import type { OrderStatus, PaymentStatus } from '@/feature/order/types/order'

vi.mock('@/feature/order/utils/generate-order-number', () => ({
  generateOrderNumber: vi.fn(() => 'ORD-1234567890-1234'),
}))

describe('OrderService', () => {
  let mockPayload: BasePayload
  let mockServiceContext: ServiceContext

  beforeEach(() => {
    mockPayload = {
      create: vi.fn(),
      update: vi.fn(),
      find: vi.fn(),
      findByID: vi.fn(),
    } as unknown as BasePayload

    mockServiceContext = {
      payload: mockPayload,
    }

    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('create', () => {
    it('should create order with authenticated customer successfully', async () => {
      // Set up context with authenticated user
      mockServiceContext = {
        payload: mockPayload,
        user: {
          id: 'customer-123',
        } as any,
      }

      const checkoutData: CheckoutData = {
        items: [
          {
            productId: 'prod-1',
            variantId: 'var-1',
            productName: 'Test Product',
            variantName: 'Size M',
            quantity: 2,
            price: 50000,
            subtotal: 100000,
          },
        ],
        shippingAddress: {
          fullName: 'John Doe',
          phone: '+628123456789',
          address: '123 Main St',
          city: 'Jakarta',
          state: 'DKI Jakarta',
          postalCode: '12345',
          country: 'ID',
        },
        paymentMethod: 'VA',
        subtotal: 100000,
        shipingCost: 15000,
        tax: 0,
        total: 115000,
        notes: 'Please deliver after 5 PM',
      }

      const mockOrder: Order = {
        id: 'order-123',
        orderNumber: 'ORD-1234567890-1234',
        customer: 'customer-123',
        orderStatus: 'pending',
        paymentStatus: 'pending',
        paymentMethod: 'VA',
        totalAmount: 115000,
        shippingCost: 15000,
        shippingAddress: {
          recipientName: 'John Doe',
          phone: '+628123456789',
          addressLine1: '123 Main St',
          city: 'Jakarta',
          province: 'DKI Jakarta',
          postalCode: '12345',
          country: 'ID',
        },
        notes: 'Please deliver after 5 PM',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Order

      const mockOrderItem = {
        id: 1,
        order: 'order-123',
        product: 'prod-1',
        variant: 'var-1',
        productSnapshot: {
          title: 'Test Product',
          variantTitle: 'Size M',
        },
        quantity: 2,
        price: 50000,
        subtotal: 100000,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as OrderItem

      vi.mocked(mockPayload.create)
        .mockResolvedValueOnce(mockOrder) // First call for order
        .mockResolvedValueOnce(mockOrderItem) // Second call for order item

      const result = await OrderService.create({
        context: mockServiceContext,
        checkoutData,
      })

      expect(result.data).toEqual(mockOrder)
      expect(result.error).toBe(false)
      expect(mockPayload.create).toHaveBeenCalledTimes(2)
      expect(mockPayload.create).toHaveBeenNthCalledWith(1, {
        collection: 'orders',
        data: expect.objectContaining({
          orderNumber: 'ORD-1234567890-1234',
          customer: 'customer-123',
          orderStatus: 'pending',
          paymentStatus: 'pending',
          paymentMethod: 'VA',
          totalAmount: 115000,
          shippingCost: 15000,
          notes: 'Please deliver after 5 PM',
        }),
      })
      expect(mockPayload.create).toHaveBeenNthCalledWith(2, {
        collection: 'order-items',
        data: {
          order: 'order-123',
          product: 'prod-1',
          variant: 'var-1',
          productSnapshot: {
            title: 'Test Product',
            variantTitle: 'Size M',
          },
          quantity: 2,
          price: 50000,
          subtotal: 100000,
        },
      })
    })

    it('should create order for guest user without customerId', async () => {
      const checkoutData: CheckoutData = {
        items: [
          {
            productId: 'prod-1',
            variantId: 'var-1',
            productName: 'Test Product',
            variantName: 'Size M',
            quantity: 1,
            price: 50000,
            subtotal: 50000,
          },
        ],
        shippingAddress: {
          fullName: 'Jane Doe',
          phone: '+628987654321',
          address: '456 Side St',
          city: 'Bandung',
          postalCode: '40123',
          country: 'ID',
        },
        paymentMethod: 'QRIS',
        subtotal: 50000,
        shipingCost: 10000,
        tax: 0,
        total: 60000,
      }

      const mockOrder: Order = {
        id: 'order-456',
        orderNumber: 'ORD-1234567890-1234',
        orderStatus: 'pending',
        paymentStatus: 'pending',
        paymentMethod: 'QRIS',
        totalAmount: 60000,
        shippingCost: 10000,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Order

      vi.mocked(mockPayload.create).mockResolvedValue(mockOrder)

      const result = await OrderService.create({
        context: mockServiceContext,
        checkoutData,
      })

      expect(result.data).toEqual(mockOrder)
      expect(mockPayload.create).toHaveBeenCalledWith({
        collection: 'orders',
        data: expect.not.objectContaining({
          customer: expect.anything(),
        }),
      })
    })

    it('should create order with multiple items', async () => {
      // Set up context with authenticated user
      mockServiceContext = {
        payload: mockPayload,
        user: {
          id: 'customer-123',
        } as any,
      }

      const checkoutData: CheckoutData = {
        items: [
          {
            productId: 'prod-1',
            variantId: 'var-1',
            productName: 'Product 1',
            variantName: 'Variant 1',
            quantity: 2,
            price: 50000,
            subtotal: 100000,
          },
          {
            productId: 'prod-2',
            variantId: 'var-2',
            productName: 'Product 2',
            variantName: 'Variant 2',
            quantity: 1,
            price: 75000,
            subtotal: 75000,
          },
        ],
        shippingAddress: {
          fullName: 'John Doe',
          phone: '+628123456789',
          address: '123 Main St',
          city: 'Jakarta',
          postalCode: '12345',
          country: 'ID',
        },
        paymentMethod: 'VA',
        subtotal: 175000,
        shipingCost: 15000,
        tax: 0,
        total: 190000,
      }

      const mockOrder: Order = {
        id: 'order-789',
        orderNumber: 'ORD-1234567890-1234',
        totalAmount: 190000,
      } as Order

      vi.mocked(mockPayload.create).mockResolvedValue(mockOrder)

      const result = await OrderService.create({
        context: mockServiceContext,
        checkoutData,
      })

      expect(result.data).toEqual(mockOrder)
      // 1 order + 2 order items
      expect(mockPayload.create).toHaveBeenCalledTimes(3)
    })

    it('should handle create order error', async () => {
      const checkoutData: CheckoutData = {
        items: [],
        shippingAddress: {
          fullName: 'Test',
          phone: '123',
          address: 'Test',
          city: 'Test',
          postalCode: '123',
          country: 'ID',
        },
        paymentMethod: 'VA',
        subtotal: 0,
        shipingCost: 0,
        tax: 0,
        total: 0,
      }

      vi.mocked(mockPayload.create).mockRejectedValue(new Error('Database error'))

      await expect(
        OrderService.create({
          context: mockServiceContext,
          checkoutData,
        }),
      ).rejects.toThrow('Database error')
    })

    it('should handle empty items array gracefully', async () => {
      const checkoutData: CheckoutData = {
        items: [],
        shippingAddress: {
          fullName: 'Test User',
          phone: '+628123456789',
          address: '123 Test St',
          city: 'Jakarta',
          postalCode: '12345',
          country: 'ID',
        },
        paymentMethod: 'VA',
        subtotal: 0,
        shipingCost: 15000,
        tax: 0,
        total: 15000,
      }

      const mockOrder: Order = {
        id: 'order-empty',
        orderNumber: 'ORD-1234567890-1234',
        totalAmount: 15000,
        shippingCost: 15000,
      } as Order

      vi.mocked(mockPayload.create).mockResolvedValue(mockOrder)

      const result = await OrderService.create({
        context: mockServiceContext,
        checkoutData,
      })

      expect(result.data).toEqual(mockOrder)
      expect(result.error).toBe(false)
      // Only order should be created, no items
      expect(mockPayload.create).toHaveBeenCalledTimes(1)
    })
  })

  describe('findByOrderNumber', () => {
    it('should find order by order number successfully', async () => {
      const mockOrder: Order = {
        id: 'order-123',
        orderNumber: 'ORD-1234567890-1234',
        orderStatus: 'pending',
        paymentStatus: 'pending',
      } as Order

      vi.mocked(mockPayload.find).mockResolvedValue({
        docs: [mockOrder],
        totalDocs: 1,
        limit: 1,
        totalPages: 1,
        page: 1,
        pagingCounter: 1,
        hasPrevPage: false,
        hasNextPage: false,
        prevPage: null,
        nextPage: null,
      })

      const result = await OrderService.findByOrderNumber({
        serviceContext: mockServiceContext,
        orderNumber: 'ORD-1234567890-1234',
      })

      expect(result.data).toEqual(mockOrder)
      expect(result.error).toBe(false)
      expect(mockPayload.find).toHaveBeenCalledWith({
        collection: 'orders',
        where: {
          orderNumber: {
            equals: 'ORD-1234567890-1234',
          },
        },
        limit: 1,
      })
    })

    it('should return error when order not found', async () => {
      vi.mocked(mockPayload.find).mockResolvedValue({
        docs: [],
        totalDocs: 0,
        limit: 1,
        totalPages: 0,
        page: 1,
        pagingCounter: 0,
        hasPrevPage: false,
        hasNextPage: false,
        prevPage: null,
        nextPage: null,
      })

      const result = await OrderService.findByOrderNumber({
        serviceContext: mockServiceContext,
        orderNumber: 'INVALID-ORDER',
      })

      expect(result.error).toBe(true)
      expect(result.message).toBe('Order not found')
      expect(result.data).toBeUndefined()
    })

    it('should handle find error', async () => {
      vi.mocked(mockPayload.find).mockRejectedValue(new Error('Database connection failed'))

      await expect(
        OrderService.findByOrderNumber({
          serviceContext: mockServiceContext,
          orderNumber: 'ORD-1234567890-1234',
        }),
      ).rejects.toThrow('Database connection failed')
    })
  })

  describe('findById', () => {
    it('should find order by ID successfully', async () => {
      const mockOrder: Order = {
        id: 'order-123',
        orderNumber: 'ORD-1234567890-1234',
        orderStatus: 'pending',
        paymentStatus: 'pending',
        totalAmount: 115000,
        shippingCost: 15000,
      } as Order

      vi.mocked(mockPayload.findByID).mockResolvedValue(mockOrder)

      const result = await OrderService.findById({
        serviceContext: mockServiceContext,
        orderId: 'order-123',
      })

      expect(result.data).toEqual(mockOrder)
      expect(result.error).toBe(false)
      expect(mockPayload.findByID).toHaveBeenCalledWith({
        collection: 'orders',
        id: 'order-123',
      })
    })

    it('should return error when order not found', async () => {
      vi.mocked(mockPayload.findByID).mockResolvedValue(undefined as any)

      const result = await OrderService.findById({
        serviceContext: mockServiceContext,
        orderId: 'invalid-id',
      })

      expect(result.error).toBe(true)
      expect(result.message).toBe('Order not found')
      expect(result.data).toBeUndefined()
    })

    it('should handle findByID error', async () => {
      vi.mocked(mockPayload.findByID).mockRejectedValue(new Error('Database error'))

      const result = await OrderService.findById({
        serviceContext: mockServiceContext,
        orderId: 'order-123',
      })

      expect(result.error).toBe(true)
      expect(result.message).toBe('Database error')
      expect(result.data).toBeUndefined()
    })
  })

  describe('updateOrderStatus', () => {
    it('should update order status successfully', async () => {
      const mockUpdatedOrder: Order = {
        id: 'order-123',
        orderNumber: 'ORD-1234567890-1234',
        orderStatus: 'processing',
        paymentStatus: 'paid',
        paymentReference: 'REF-123',
      } as Order

      vi.mocked(mockPayload.update).mockResolvedValue(mockUpdatedOrder)

      const result = await OrderService.updateOrderStatus({
        serviceContext: mockServiceContext,
        orderId: 'order-123',
        orderStatus: 'processing',
        paymentStatus: 'paid',
        paymentReference: 'REF-123',
      })

      expect(result.data).toEqual(mockUpdatedOrder)
      expect(result.error).toBe(false)
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

    it('should update order status without payment reference', async () => {
      const mockUpdatedOrder: Order = {
        id: 'order-456',
        orderStatus: 'cancelled',
        paymentStatus: 'failed',
      } as Order

      vi.mocked(mockPayload.update).mockResolvedValue(mockUpdatedOrder)

      const result = await OrderService.updateOrderStatus({
        serviceContext: mockServiceContext,
        orderId: 'order-456',
        orderStatus: 'cancelled',
        paymentStatus: 'failed',
      })

      expect(result.data).toEqual(mockUpdatedOrder)
      expect(mockPayload.update).toHaveBeenCalledWith({
        collection: 'orders',
        id: 'order-456',
        data: {
          orderStatus: 'cancelled',
          paymentStatus: 'failed',
        },
      })
    })

    it('should handle all valid order statuses', async () => {
      const statuses: OrderStatus[] = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']

      for (const status of statuses) {
        vi.mocked(mockPayload.update).mockResolvedValue({
          id: 'order-123',
          orderStatus: status,
        } as Order)

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

    it('should handle all valid payment statuses', async () => {
      const statuses: PaymentStatus[] = ['pending', 'paid', 'failed', 'refunded']

      for (const status of statuses) {
        vi.mocked(mockPayload.update).mockResolvedValue({
          id: 'order-123',
          paymentStatus: status,
        } as Order)

        const result = await OrderService.updateOrderStatus({
          serviceContext: mockServiceContext,
          orderId: 'order-123',
          orderStatus: 'pending',
          paymentStatus: status,
        })

        expect(result.data?.paymentStatus).toBe(status)
        vi.clearAllMocks()
      }
    })

    it('should handle update error', async () => {
      vi.mocked(mockPayload.update).mockRejectedValue(new Error('Update failed'))

      await expect(
        OrderService.updateOrderStatus({
          serviceContext: mockServiceContext,
          orderId: 'order-123',
          orderStatus: 'processing',
          paymentStatus: 'paid',
        }),
      ).rejects.toThrow('Update failed')
    })
  })

  describe('updatePaymentReference', () => {
    it('should update payment reference successfully', async () => {
      const mockUpdatedOrder: Order = {
        id: 'order-123',
        paymentReference: 'DUITKU-REF-123456',
      } as Order

      vi.mocked(mockPayload.update).mockResolvedValue(mockUpdatedOrder)

      const result = await OrderService.updatePaymentReference({
        serviceContext: mockServiceContext,
        orderId: 'order-123',
        paymentReference: 'DUITKU-REF-123456',
      })

      expect(result.data).toEqual(mockUpdatedOrder)
      expect(result.error).toBe(false)
      expect(mockPayload.update).toHaveBeenCalledWith({
        collection: 'orders',
        id: 'order-123',
        data: {
          paymentReference: 'DUITKU-REF-123456',
        },
      })
    })

    it('should update payment reference with VA number', async () => {
      const mockUpdatedOrder: Order = {
        id: 'order-456',
        paymentReference: 'DUITKU-REF-789',
        vaNumber: '8001234567890123',
      } as Order

      vi.mocked(mockPayload.update).mockResolvedValue(mockUpdatedOrder)

      const result = await OrderService.updatePaymentReference({
        serviceContext: mockServiceContext,
        orderId: 'order-456',
        paymentReference: 'DUITKU-REF-789',
        vaNumber: '8001234567890123',
      })

      expect(result.data).toEqual(mockUpdatedOrder)
      expect(mockPayload.update).toHaveBeenCalledWith({
        collection: 'orders',
        id: 'order-456',
        data: {
          paymentReference: 'DUITKU-REF-789',
          vaNumber: '8001234567890123',
        },
      })
    })

    it('should update payment reference without VA number', async () => {
      const mockUpdatedOrder: Order = {
        id: 'order-789',
        paymentReference: 'QRIS-REF-111',
      } as Order

      vi.mocked(mockPayload.update).mockResolvedValue(mockUpdatedOrder)

      const result = await OrderService.updatePaymentReference({
        serviceContext: mockServiceContext,
        orderId: 'order-789',
        paymentReference: 'QRIS-REF-111',
      })

      expect(result.data).toEqual(mockUpdatedOrder)
      expect(mockPayload.update).toHaveBeenCalledWith({
        collection: 'orders',
        id: 'order-789',
        data: {
          paymentReference: 'QRIS-REF-111',
        },
      })
    })

    it('should handle update error', async () => {
      vi.mocked(mockPayload.update).mockRejectedValue(new Error('Payment reference update failed'))

      await expect(
        OrderService.updatePaymentReference({
          serviceContext: mockServiceContext,
          orderId: 'order-123',
          paymentReference: 'REF-123',
        }),
      ).rejects.toThrow('Payment reference update failed')
    })
  })

  describe('updateOrderFromReturnUrl', () => {
    it('should update order from return URL with success code', async () => {
      const mockFoundOrder = {
        success: true,
        order: {
          id: 'order-123',
          orderNumber: 'ORD-1234567890-1234',
        },
      }

      const mockUpdatedOrder: Order = {
        id: 'order-123',
        orderNumber: 'ORD-1234567890-1234',
        orderStatus: 'processing',
        paymentStatus: 'paid',
        paymentReference: 'REF-SUCCESS',
      } as Order

      // Mock findByOrderNumber
      vi.spyOn(OrderService, 'findByOrderNumber').mockResolvedValue({
        data: mockFoundOrder,
        error: false,
      })

      // Mock updateOrderStatus
      vi.spyOn(OrderService, 'updateOrderStatus').mockResolvedValue({
        data: mockUpdatedOrder,
        error: false,
      })

      const result = await OrderService.updateOrderFromReturnUrl({
        serviceContext: mockServiceContext,
        orderNumber: 'ORD-1234567890-1234',
        resultCode: '00',
        reference: 'REF-SUCCESS',
      })

      expect(result.data).toEqual(mockUpdatedOrder)
      expect(result.error).toBe(false)
    })

    it('should update order from return URL with pending code', async () => {
      const mockFoundOrder = {
        success: true,
        order: {
          id: 'order-456',
          orderNumber: 'ORD-1234567890-5678',
        },
      }

      const mockUpdatedOrder: Order = {
        id: 'order-456',
        orderStatus: 'pending',
        paymentStatus: 'pending',
      } as Order

      vi.spyOn(OrderService, 'findByOrderNumber').mockResolvedValue({
        data: mockFoundOrder,
        error: false,
      })

      vi.spyOn(OrderService, 'updateOrderStatus').mockResolvedValue({
        data: mockUpdatedOrder,
        error: false,
      })

      const result = await OrderService.updateOrderFromReturnUrl({
        serviceContext: mockServiceContext,
        orderNumber: 'ORD-1234567890-5678',
        resultCode: '01',
        reference: 'REF-PENDING',
      })

      expect(result.data).toEqual(mockUpdatedOrder)
    })

    it('should update order from return URL with cancelled code', async () => {
      const mockFoundOrder = {
        success: true,
        order: {
          id: 'order-789',
          orderNumber: 'ORD-1234567890-9012',
        },
      }

      const mockUpdatedOrder: Order = {
        id: 'order-789',
        orderStatus: 'cancelled',
        paymentStatus: 'failed',
      } as Order

      vi.spyOn(OrderService, 'findByOrderNumber').mockResolvedValue({
        data: mockFoundOrder,
        error: false,
      })

      vi.spyOn(OrderService, 'updateOrderStatus').mockResolvedValue({
        data: mockUpdatedOrder,
        error: false,
      })

      const result = await OrderService.updateOrderFromReturnUrl({
        serviceContext: mockServiceContext,
        orderNumber: 'ORD-1234567890-9012',
        resultCode: '02',
        reference: 'REF-CANCELLED',
      })

      expect(result.data).toEqual(mockUpdatedOrder)
    })

    it('should return error when order not found', async () => {
      vi.spyOn(OrderService, 'findByOrderNumber').mockResolvedValue({
        data: {
          success: false,
          order: undefined,
        },
        error: true,
      })

      const result = await OrderService.updateOrderFromReturnUrl({
        serviceContext: mockServiceContext,
        orderNumber: 'INVALID-ORDER',
        resultCode: '00',
        reference: 'REF-123',
      })

      expect(result.error).toBe(true)
      expect(result.message).toBe('Order not found')
    })
  })
})
