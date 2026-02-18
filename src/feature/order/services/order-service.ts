import { ServiceContext } from '@/types/service-context'
import { ServiceResult } from '@/types/service-result'
import { DuitkuResultCode, OrderStatus, PaymentStatus } from '../types/order'
import { Order } from '@/payload-types'
import { mapReturnUrlResultCode } from '../utils/map-result-code'

export const OrderService = {
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
    const result = await OrderService.findByOrderNumber({
      serviceContext,
      orderNumber,
    })
    const { data: orderResult } = result
    if (!orderResult.success || !orderResult.order) {
      return { error: true, message: 'Order not found' }
    }

    const order = orderResult.order

    // Map result code to order status
    const { orderStatus, paymentStatus } = mapReturnUrlResultCode(resultCode)

    // Update order
    const { data } = await OrderService.updateOrderStatus({
      serviceContext: serviceContext,
      orderId: order.id,
      orderStatus,
      paymentStatus,
      paymentReference: reference,
    })
    return {
      data: data,
      error: false,
    }
  },

  updateOrderStatus: async ({
    serviceContext,
    orderId,
    orderStatus,
    paymentStatus,
    paymentReference,
  }: {
    serviceContext: ServiceContext
    orderId: string
    orderStatus: OrderStatus
    paymentStatus: PaymentStatus
    paymentReference?: string
  }): Promise<ServiceResult<Order>> => {
    const updateData: any = {
      orderStatus,
      paymentStatus,
    }

    if (paymentReference) {
      updateData.paymentReference = paymentReference
    }

    const updatedOrder = await serviceContext.payload.update({
      collection: 'orders',
      id: orderId,
      data: updateData,
    })
    return {
      error: false,
      data: updatedOrder,
    }
  },
}
