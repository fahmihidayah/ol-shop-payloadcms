import { ServiceContext } from '@/types/service-context'
import { ServiceResult } from '@/types/service-result'
import { DuitkuResultCode, OrderStatus, PaymentStatus } from '../types/order'
import { Order } from '@/payload-types'
import { mapReturnUrlResultCode } from '../utils/map-result-code'
import { generateOrderNumber } from '../utils/generate-order-number'
import { CheckoutData, CheckoutItem } from '@/types/checkout'

/**
 * OrderService - Handles all order-related database operations
 *
 * This service provides methods for:
 * - Creating orders and order items
 * - Finding orders by order number
 * - Updating order status and payment information
 * - Processing payment return URL callbacks
 */
export const OrderService = {
  /**
   * Creates a new order with order items
   *
   * @param context - Service context containing payload instance and collection info
   * @param checkoutData - Complete checkout information including items, shipping, and payment details
   * @returns Promise resolving to ServiceResult containing the created Order
   *
   * @example
   * ```typescript
   * const result = await OrderService.create({
   *   context: { collection: 'orders', payload },
   *   checkoutData: {
   *     customerId: 'customer-123',
   *     items: [...],
   *     shippingAddress: {...},
   *     paymentMethod: 'VA',
   *     total: 150000,
   *   }
   * })
   * ```
   *
   * @throws {Error} If order creation fails
   */
  create: async ({
    context,
    checkoutData,
  }: {
    context: ServiceContext
    checkoutData: CheckoutData
  }): Promise<ServiceResult<Order>> => {
    // Generate unique order number
    const orderNumber = generateOrderNumber()

    // Create the order first
    const order = await context.payload.create({
      collection: 'orders',
      data: {
        orderNumber,
        customer: context.user?.id,
        orderStatus: 'pending', // Initial status - waiting for payment
        paymentStatus: 'pending',
        paymentMethod: checkoutData.paymentMethod,
        sessionId: context.sessionId,
        // Pricing
        totalAmount: checkoutData.total,
        shippingCost: checkoutData.shipingCost,

        // Shipping address
        shippingAddress: {
          recipientName: checkoutData.shippingAddress.fullName,
          phone: checkoutData.shippingAddress.phone,
          addressLine1: checkoutData.shippingAddress.address,
          city: checkoutData.shippingAddress.city,
          province: checkoutData.shippingAddress.state ?? '',
          postalCode: checkoutData.shippingAddress.postalCode,
          country: checkoutData.shippingAddress.country || 'ID',
        },

        // Notes
        notes: checkoutData.notes,
      },
    })

    // Create order items
    await OrderService._createOrderItems(context, order.id, checkoutData.items)

    return {
      data: order,
      error: false,
    }
  },

  /**
   * Finds an order by its order number
   *
   * @param serviceContext - Service context containing payload instance
   * @param orderNumber - The order number to search for (e.g., "ORD-1234567890-1234")
   * @returns Promise resolving to ServiceResult containing the found Order or error
   *
   * @example
   * ```typescript
   * const result = await OrderService.findByOrderNumber({
   *   serviceContext: { collection: 'orders', payload },
   *   orderNumber: 'ORD-1234567890-1234'
   * })
   *
   * if (!result.error) {
   *   console.log('Order found:', result.data)
   * }
   * ```
   */
  findByOrderNumber: async (props: {
    serviceContext: ServiceContext
    orderNumber: string
  }): Promise<ServiceResult<any>> => {
    const result = await props.serviceContext.payload.find({
      collection: 'orders',
      where: {
        orderNumber: {
          equals: props.orderNumber,
        },
      },
      limit: 1,
    })

    if (result.docs.length === 0) {
      return {
        error: true,
        message: 'Order not found',
      }
    }

    return {
      data: result.docs[0],
      error: false,
    }
  },

  /**
   * Updates order status based on payment gateway return URL result code
   *
   * This method is called when the user returns from the payment gateway.
   * It maps the Duitku result code to appropriate order and payment statuses.
   *
   * @param serviceContext - Service context containing payload instance
   * @param orderNumber - The order number to update
   * @param resultCode - Duitku result code ('00' = success, '01' = pending, '02' = cancelled)
   * @param reference - Payment reference from payment gateway
   * @returns Promise resolving to ServiceResult containing the updated Order
   *
   * @example
   * ```typescript
   * const result = await OrderService.updateOrderFromReturnUrl({
   *   serviceContext: { collection: 'orders', payload },
   *   orderNumber: 'ORD-1234567890-1234',
   *   resultCode: '00', // Success
   *   reference: 'DUITKU-REF-123'
   * })
   * ```
   *
   * @throws {Error} If order is not found or update fails
   */
  updateOrderFromReturnUrl: async ({
    serviceContext,
    orderNumber,
    resultCode,
    reference,
  }: {
    serviceContext: ServiceContext
    orderNumber: string
    resultCode: DuitkuResultCode
    reference: string
  }): Promise<ServiceResult<Order>> => {
    // Find the order
    // const result = await OrderService.findByOrderNumber({
    //   serviceContext,
    //   orderNumber,
    // })

    // console.log('updateOrderFromReturnUrl : Result : ', JSON.stringify(result, null, 2))

    // const { data: orderResult } = result

    // if (!orderResult.success || !orderResult.order) {
    //   return { error: true, message: 'Order not found' }
    // }

    // const order = orderResult.order

    // Map result code to order status
    const { orderStatus, paymentStatus } = mapReturnUrlResultCode(resultCode)

    // Update order
    const { data } = await OrderService.updateOrderStatus({
      serviceContext: serviceContext,
      orderNumber: orderNumber,
      orderStatus,
      paymentStatus,
      paymentReference: reference,
    })

    return {
      data: data,
      error: false,
    }
  },

  /**
   * Updates order and payment status
   *
   * @param serviceContext - Service context containing payload instance
   * @param orderId - Order ID to update
   * @param orderStatus - New order status (pending, processing, shipped, delivered, cancelled)
   * @param paymentStatus - New payment status (pending, paid, failed, refunded)
   * @param paymentReference - Optional payment reference from payment gateway
   * @returns Promise resolving to ServiceResult containing the updated Order
   *
   * @example
   * ```typescript
   * const result = await OrderService.updateOrderStatus({
   *   serviceContext: { collection: 'orders', payload },
   *   orderId: 'order-123',
   *   orderStatus: 'processing',
   *   paymentStatus: 'paid',
   *   paymentReference: 'DUITKU-REF-123'
   * })
   * ```
   *
   * @throws {Error} If order update fails
   */
  updateOrderStatus: async ({
    serviceContext,
    orderNumber,
    orderStatus,
    paymentStatus,
    paymentReference,
  }: {
    serviceContext: ServiceContext
    orderNumber: string
    orderStatus: OrderStatus
    paymentStatus: PaymentStatus
    paymentReference?: string
  }): Promise<ServiceResult<Order>> => {
    const updateData: Record<string, any> = {
      orderStatus,
      paymentStatus,
    }

    if (paymentReference) {
      updateData.paymentReference = paymentReference
    }

    return OrderService._updateOrder(serviceContext, orderNumber, updateData)
  },

  /**
   * Updates payment reference and virtual account number for an order
   *
   * This is typically called after creating a payment transaction with the payment gateway
   * to store the payment reference and VA number for tracking purposes.
   *
   * @param serviceContext - Service context containing payload instance
   * @param orderId - Order ID to update
   * @param paymentReference - Payment reference from payment gateway
   * @param vaNumber - Optional virtual account number (for bank transfer payments)
   * @returns Promise resolving to ServiceResult containing the updated Order
   *
   * @example
   * ```typescript
   * // For VA payment
   * const result = await OrderService.updatePaymentReference({
   *   serviceContext: { collection: 'orders', payload },
   *   orderId: 'order-123',
   *   paymentReference: 'DUITKU-REF-123',
   *   vaNumber: '8001234567890123'
   * })
   *
   * // For non-VA payment (QRIS, E-wallet)
   * const result = await OrderService.updatePaymentReference({
   *   serviceContext: { collection: 'orders', payload },
   *   orderId: 'order-456',
   *   paymentReference: 'DUITKU-REF-456'
   * })
   * ```
   *
   * @throws {Error} If order update fails
   */
  updatePaymentReference: async ({
    serviceContext,
    orderId,
    paymentReference,
    vaNumber,
  }: {
    serviceContext: ServiceContext
    orderId: string
    paymentReference: string
    vaNumber?: string
  }): Promise<ServiceResult<Order>> => {
    const updateData: Record<string, any> = {
      paymentReference,
    }

    if (vaNumber) {
      updateData.vaNumber = vaNumber
    }

    return OrderService._updateOrder(serviceContext, orderId, updateData)
  },

  /**
   * PRIVATE: Creates order items for an order
   *
   * This is a helper method that creates all order items in parallel.
   * Each order item stores a snapshot of the product and variant information
   * at the time of purchase for historical accuracy.
   *
   * @param context - Service context containing payload instance
   * @param orderId - ID of the order these items belong to
   * @param items - Array of checkout items to create
   * @returns Promise that resolves when all items are created
   *
   * @private
   * @throws {Error} If any order item creation fails
   */
  _createOrderItems: async (
    context: ServiceContext,
    orderId: string,
    items: CheckoutItem[],
  ): Promise<void> => {
    if (!items || items.length === 0) {
      return
    }

    const orderItemsPromises = items.map((item) =>
      context.payload.create({
        collection: 'order-items',
        data: {
          order: orderId,
          product: item.productId,
          variant: item.variantId,
          productSnapshot: {
            title: item.productName,
            variantTitle: item.variantName,
          },
          quantity: item.quantity,
          price: item.price,
          subtotal: item.subtotal,
        },
      }),
    )

    await Promise.all(orderItemsPromises)
  },

  /**
   * PRIVATE: Updates an order with given data
   *
   * This is a helper method used by other update methods to perform
   * the actual database update operation.
   *
   * @param serviceContext - Service context containing payload instance
   * @param orderId - Order ID to update
   * @param updateData - Data to update
   * @returns Promise resolving to ServiceResult containing the updated Order
   *
   * @private
   * @throws {Error} If order update fails
   */
  _updateOrder: async (
    serviceContext: ServiceContext,
    orderNumber: string,
    updateData: Record<string, any>,
  ): Promise<ServiceResult<Order>> => {
    const updatedOrder = await serviceContext.payload.update({
      collection: 'orders',
      where: {
        orderNumber: {
          equals: orderNumber,
        },
      },
      data: updateData,
    })
    console.log('data update order  : ', JSON.stringify(updatedOrder.docs[0], null, 2))

    return {
      error: false,
      data: updatedOrder.docs[0],
    }
  },
}
