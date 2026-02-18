import { ServiceContext } from '@/types/service-context'
import { addressFormSchema, AddressFormSchema } from '../types/address'
import { ServiceResult } from '@/types/service-result'
import { Address } from '@/payload-types'
import { formatZodError } from '@/lib/zod'
import { PaginatedDocs } from 'payload'

export const AddressService = {
  create: async ({
    data,
    serviceContext,
  }: {
    data: AddressFormSchema
    serviceContext: ServiceContext
  }): Promise<ServiceResult<Address>> => {
    const { user, sessionId, payload } = serviceContext
    if (user) {
      data.customer = user.id
    } else {
      data.sessionId = sessionId
    }
    const validated = addressFormSchema.safeParse(data)
    if (!validated.success) {
      return {
        data: undefined,
        error: true,
        errorMessage: formatZodError(validated.error),
        message: '',
      }
    }

    const validatedData = validated.data

    const address = await payload.create({
      collection: 'addresses',
      data: validatedData,
    })
    return {
      data: address,
      error: false,
      message: 'Success',
    }
  },

  delete: async ({
    id,
    serviceContext,
  }: {
    id: string
    serviceContext: ServiceContext
  }): Promise<ServiceResult<Address>> => {
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
  },

  findAll: async (props: {
    serviceContext: ServiceContext
  }): Promise<ServiceResult<PaginatedDocs<Address>>> => {
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
  },
}
