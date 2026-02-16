'use server'
import { getMeUser } from '@/lib/customer-utils'
import { revalidateTag } from 'next/cache'
import { cookies } from 'next/headers'
import { getPayload } from 'payload'

import config from '@payload-config'
import { deleteService } from '@/lib/services/delete-service'
import { Address } from '@/payload-types'
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

    const payload = await getPayload({ config })
    const { user } = await getMeUser()
    const cookieStore = await cookies()

    // Fetch address to verify ownership
    const address = await deleteService<Address>({
      serviceContext: {
        collection: 'addresses',
        payload,
      },
      id: addressId,
      overrideAccess: true,
    })

    if (!address) {
      return { success: false, error: 'Address not found' }
    }

    // Verify ownership: only the owner (user or session) can delete
    if (user) {
      const customerId =
        typeof address.customer === 'string' ? address.customer : address.customer?.id
      if (customerId !== user.id) {
        return { success: false, error: 'You are not authorized to delete this address' }
      }
    } else {
      const sessionId = cookieStore.get('cart-session-id')?.value
      if (!sessionId || address.sessionId !== sessionId) {
        return { success: false, error: 'You are not authorized to delete this address' }
      }
    }

    await payload.delete({
      collection: 'addresses',
      id: addressId,
      overrideAccess: true,
    })

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
