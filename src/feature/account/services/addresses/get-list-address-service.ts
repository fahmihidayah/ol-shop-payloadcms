import { Address } from '@/payload-types'
import { ServiceContext } from '@/types/service-context'
import { ServiceResult } from '@/types/service-result'
import { PaginatedDocs } from 'payload'
type Props = {
  serviceContext: ServiceContext
}
export const getListAddressService = async (
  props: Props,
): Promise<ServiceResult<PaginatedDocs<Address>>> => {
  const { user, sessionId, payload } = props.serviceContext
  if (user) {
    const result = await payload.find({
      collection: 'addresses',
      where: {
        customer: { equals: user.id },
      },
      sort: '-createdAt',
    })
    return {
      data: result,
      error: false,
    }
  }

  if (sessionId) {
    const result = await payload.find({
      collection: 'addresses',
      where: {
        sessionId: { equals: sessionId },
      },
      sort: '-createdAt',
    })
    return {
      data: result,
      error: false,
    }
  }
  return {
    error: true,
    message: 'Address Not found',
  }
}
