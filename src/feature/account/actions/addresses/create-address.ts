'use server'
import { getMeUser } from '@/lib/customer-utils'
import { cookies } from 'next/headers'
import { AddressFormSchema, addressFormSchema } from '../../types/types'
import { createService } from '@/lib/services/create-service'
import { getPayload } from 'payload'
import { Address } from '@/payload-types'

import config from '@payload-config'
import { revalidateTag } from 'next/cache'

type CreateAddressResult = {
  success: boolean
  error?: string
  address?: Address
}

export async function createAddress(data: AddressFormSchema): Promise<CreateAddressResult> {
  try {
    const { user } = await getMeUser()
    const cookieStore = await cookies()
    const sessionId = cookieStore.get('cart-session-id')?.value

    if (user) {
      data.customer = user.id
    } else {
      data.sessionId = sessionId
    }
    const validated = addressFormSchema.safeParse(data)
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.issues[0]?.message || 'Invalid form data',
      }
    }

    const validatedData = validated.data

    const address = await createService({
      serviceContext: {
        collection: 'addresses',
        payload: await getPayload({ config }),
      },
      data: validatedData,
    })

    revalidateTag('addresses')
    return {
      success: true,
      address: address as Address,
    }
  } catch (error) {
    console.error('[CREATE_ADDRESS] Error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create address',
    }
  }
}
