'use server'
import { getMeUser } from '@/lib/customer-utils'
import { cookies } from 'next/headers'
import { AddressFormSchema } from '../../types/address'
import { getPayload } from 'payload'
import { Address } from '@/payload-types'

import config from '@payload-config'
import { revalidateTag } from 'next/cache'
import { AddressService } from '../../services/address-service'

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

    const result = await AddressService.create({
      data: data,
      serviceContext: {
        user: user,
        sessionId: sessionId,
        payload: await getPayload({
          config,
        }),
      },
    })

    if (result.error) {
      return {
        success: false,
        error: result.errorMessage ? Object.values(result.errorMessage).join(', ') : result.message,
      }
    }

    revalidateTag('addresses')
    return {
      success: true,
      address: result.data,
    }
  } catch (error) {
    console.error('[CREATE_ADDRESS] Error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create address',
    }
  }
}
