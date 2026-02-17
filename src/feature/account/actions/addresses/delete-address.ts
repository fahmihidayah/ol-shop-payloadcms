'use server'
import { getMeUser } from '@/lib/customer-utils'
import { revalidateTag } from 'next/cache'
import { cookies } from 'next/headers'
import { getPayload } from 'payload'

import config from '@payload-config'
import { deleteAddressService } from '../../services/addresses/delete-address-service'
type ActionState = {
  success: boolean
  error?: string
}

export async function deleteAddress(formData: FormData): Promise<ActionState> {
  try {
    const addressId = formData.get('addressId') as string
    if (!addressId) {
      return { success: false, error: 'Address ID is required' }
    }

    const { user } = await getMeUser()
    const cookieStore = await cookies()
    const sessionId = cookieStore.get('cart-session-id')?.value

    const result = await deleteAddressService({
      id: addressId,
      serviceContext: {
        collection: 'addresses',
        payload: await getPayload({
          config,
        }),
        user: user,
        sessionId,
      },
    })
    if (result.error) {
      return {
        success: false,
        error: result.message,
      }
    }
    revalidateTag('addresses')
    return { success: true }
  } catch (error) {
    console.error('[DELETE_ADDRESS] Error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete address',
    }
  }
}
