'use server'
import { Address } from '@/payload-types'
import { addressFormSchema, AddressFormSchema } from '../../types/address'
import { ServiceContext } from '@/types/service-context'
import { ServiceResult } from '@/types/service-result'
import { formatZodError } from '@/lib/zod'

type CreateAddressServiceProps = {
  data: AddressFormSchema
  serviceContext: ServiceContext
}

export const createAddressService = async ({
  data,
  serviceContext,
}: CreateAddressServiceProps): Promise<ServiceResult<Address>> => {
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
}
