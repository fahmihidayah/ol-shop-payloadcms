'use server'

import { ServiceContext } from '@/types/service-context'
import { ServiceResult } from '@/types/service-result'

type Props = {
  serviceContext: ServiceContext
  orderNumber: string
}
export const getOrderByOrderNumberService = async (props: Props): Promise<ServiceResult<any>> => {
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
}
