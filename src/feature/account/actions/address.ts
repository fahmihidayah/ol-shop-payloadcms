'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import { cookies } from 'next/headers'
import { getMeUser } from '@/lib/customer-utils'
import { addressFormSchema } from '../types/address'
import { revalidateTag } from 'next/cache'
import type { Address } from '@/payload-types'

type ActionState = {
  success: boolean
  error?: string
}

export async function getListAddresses(): Promise<Address[]> {
  try {
    const payload = await getPayload({ config })
    const { user } = await getMeUser()
    const cookieStore = await cookies()

    if (user) {
      const result = await payload.find({
        collection: 'addresses',
        where: {
          customer: { equals: user.id },
        },
        sort: '-createdAt',
        overrideAccess: true,
      })
      return result.docs as Address[]
    }

    // Guest user: find by sessionId
    const sessionId = cookieStore.get('cart-session-id')?.value
    if (sessionId) {
      const result = await payload.find({
        collection: 'addresses',
        where: {
          sessionId: { equals: sessionId },
        },
        sort: '-createdAt',
        overrideAccess: true,
      })
      return result.docs as Address[]
    }

    return []
  } catch (error) {
    console.error('[GET_LIST_ADDRESSES] Error:', error)
    return []
  }
}

export async function createAddress(formData: FormData): Promise<ActionState> {
  try {
    const payload = await getPayload({ config })
    const { user } = await getMeUser()
    const cookieStore = await cookies()

    const rawData = {
      label: formData.get('label') as string,
      recipientName: formData.get('recipientName') as string,
      phoneNumber: formData.get('phoneNumber') as string,
      addressLine1: formData.get('addressLine1') as string,
      addressLine2: (formData.get('addressLine2') as string) || undefined,
      city: formData.get('city') as string,
      province: formData.get('province') as string,
      postalCode: formData.get('postalCode') as string,
      country: formData.get('country') as string,
      isDefault: formData.get('isDefault') === 'on' || formData.get('isDefault') === 'true',
    }

    const validated = addressFormSchema.safeParse(rawData)
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.issues[0]?.message || 'Invalid form data',
      }
    }

    const data = validated.data

    const addressData: Record<string, unknown> = {
      label: data.label,
      recipientName: data.recipientName,
      phone: data.phoneNumber,
      addressLine1: data.addressLine1,
      addressLine2: data.addressLine2 || undefined,
      city: data.city,
      province: data.province,
      postalCode: data.postalCode,
      country: data.country,
      isDefault: data.isDefault || false,
    }

    if (user) {
      addressData.customer = user.id
    } else {
      const sessionId = cookieStore.get('cart-session-id')?.value
      if (!sessionId) {
        return { success: false, error: 'No session found. Please try again.' }
      }
      addressData.sessionId = sessionId
    }

    await payload.create({
      collection: 'addresses',
      data: addressData as never,
      overrideAccess: true,
    })

    revalidateTag('addresses')
    return { success: true }
  } catch (error) {
    console.error('[CREATE_ADDRESS] Error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create address',
    }
  }
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
    const address = await payload.findByID({
      collection: 'addresses',
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
