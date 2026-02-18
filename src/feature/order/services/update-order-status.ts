// 'use server'
// import { ServiceContext } from '@/types/service-context'
// import { DuitkuResultCode, OrderStatus, PaymentStatus } from '../types/order'
// import { clearCartItems } from '@/feature/cart/actions'
// import { ServiceResult } from '@/types/service-result'
// import { Order } from '@/payload-types'
// import { getOrderByOrderNumberService } from './get-by-order-number'

// export const updateOrderFromReturnUrlService = async ({
//   serviceContext,
//   orderNumber,
//   resultCode,
//   reference,
// }: {
//   serviceContext: ServiceContext
//   orderNumber: string
//   resultCode: DuitkuResultCode
//   reference: string
// }): Promise<ServiceResult<Order>> => {
//   const result = await getOrderByOrderNumberService({
//     serviceContext,
//     orderNumber,
//   })
//   const { data: orderResult } = result
//   if (!orderResult.success || !orderResult.order) {
//     return { error: true, message: 'Order not found' }
//   }

//   const order = orderResult.order

//   // Map result code to order status
//   const { orderStatus, paymentStatus } = mapReturnUrlResultCode(resultCode)

//   // Update order
//   const { data } = await updateOrderStatusService({
//     serviceContext: serviceContext,
//     orderId: order.id,
//     orderStatus,
//     paymentStatus,
//     paymentReference: reference,
//   })
//   return {
//     data: data,
//     error: false,
//   }
// }

// export const updateOrderStatusService = async ({
//   serviceContext,
//   orderId,
//   orderStatus,
//   paymentStatus,
//   paymentReference,
// }: {
//   serviceContext: ServiceContext
//   orderId: string
//   orderStatus: OrderStatus
//   paymentStatus: PaymentStatus
//   paymentReference?: string
// }): Promise<ServiceResult<Order>> => {
//   const updateData: any = {
//     orderStatus,
//     paymentStatus,
//   }

//   if (paymentReference) {
//     updateData.paymentReference = paymentReference
//   }

//   const updatedOrder = await serviceContext.payload.update({
//     collection: 'orders',
//     id: orderId,
//     data: updateData,
//   })
//   return {
//     error: false,
//     data: updatedOrder,
//   }
// }
