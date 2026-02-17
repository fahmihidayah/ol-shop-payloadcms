'use server'

import { Address } from '@/payload-types'
import { ServiceContext } from '@/types/service-context'
import { ServiceResult } from '@/types/service-result'

type Props = {
  id: string
  serviceContext: ServiceContext
}

export const deleteAddressService = async ({
  id,
  serviceContext,
}: Props): Promise<ServiceResult<Address>> => {
  const { user, sessionId } = serviceContext
  if (!user && !sessionId) {
    return {
      error: true,
      message: 'User not found',
    }
  }
  const address = await serviceContext.payload.delete({
    collection: 'addresses',

    where: {
      and: [
        {
          id: {
            equals: id,
          },
        },
        serviceContext.user
          ? {
              customer: {
                equals: serviceContext.user.id ?? '',
              },
            }
          : {
              sessionId: {
                equals: serviceContext.sessionId ?? '',
              },
            },
      ],
    },
  })

  if (address && address.docs && address.docs.length > 0) {
    return {
      data: address.docs[0],
      error: false,
    }
  } else {
    return {
      data: undefined,
      error: true,
      message: 'failed to delete ',
    }
  }
}
