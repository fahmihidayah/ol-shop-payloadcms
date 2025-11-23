'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import type { Address } from '@/payload-types'
import { getMeCustomer } from '@/actions/customer/getMeCustomer'

interface ActionResponse {
  success: boolean
  message?: string
}

interface GetAddressesResponse {
  success: boolean
  addresses: Address[]
  message?: string
}

interface GetAddressResponse {
  success: boolean
  address?: Address
  message?: string
}

/**
 * Get current customer ID from session
 */
async function getCurrentCustomerId(): Promise<string | undefined> {
  try {
    const { user } = await getMeCustomer()
    return user.id
  } catch (err: any) {
    console.log('error ', err)
    return undefined
  }
}

/**
 * Get all addresses for current customer
 */
export async function getAddresses(): Promise<GetAddressesResponse> {
  try {
    const customerId = await getCurrentCustomerId()
    if (!customerId) {
      return {
        success: false,
        addresses: [],
        message: 'Not authenticated',
      }
    }

    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'addresses',
      where: {
        customer: {
          equals: customerId,
        },
      },
      sort: '-createdAt',
    })

    return {
      success: true,
      addresses: result.docs,
    }
  } catch (error) {
    console.error('Get addresses error:', error)
    return {
      success: false,
      addresses: [],
      message: 'Failed to fetch addresses',
    }
  }
}

/**
 * Get a single address by ID
 */
export async function getAddress(id: string): Promise<GetAddressResponse> {
  try {
    const customerId = await getCurrentCustomerId()

    if (!customerId) {
      return {
        success: false,
        message: 'Not authenticated',
      }
    }

    const payload = await getPayload({ config })
    const address = await payload.findByID({
      collection: 'addresses',
      id,
    })

    // Verify ownership
    const addressCustomerId =
      typeof address.customer === 'string' ? address.customer : address.customer?.id
    if (addressCustomerId !== customerId) {
      return {
        success: false,
        message: 'Address not found',
      }
    }

    return {
      success: true,
      address,
    }
  } catch (error) {
    console.error('Get address error:', error)
    return {
      success: false,
      message: 'Failed to fetch address',
    }
  }
}

/**
 * Create a new address
 */
export async function createAddress(data: {
  label: string
  recipientName: string
  phone: string
  addressLine1: string
  addressLine2?: string
  city: string
  province: string
  postalCode: string
  country?: string
}): Promise<ActionResponse> {
  try {
    const customerId = await getCurrentCustomerId()

    console.log('customer ', customerId)
    if (!customerId) {
      return {
        success: false,
        message: 'Not authenticated',
      }
    }

    const payload = await getPayload({ config })
    await payload.create({
      collection: 'addresses',
      data: {
        ...data,
        customer: customerId,
      },
    })

    return {
      success: true,
      message: 'Address created successfully',
    }
  } catch (error) {
    console.error('Create address error:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to create address',
    }
  }
}

/**
 * Update an existing address
 */
export async function updateAddress(
  id: string,
  data: {
    label: string
    recipientName: string
    phone: string
    addressLine1: string
    addressLine2?: string
    city: string
    province: string
    postalCode: string
    country?: string
  },
): Promise<ActionResponse> {
  try {
    const customerId = await getCurrentCustomerId()

    if (!customerId) {
      return {
        success: false,
        message: 'Not authenticated',
      }
    }

    const payload = await getPayload({ config })

    // Verify ownership before updating
    const existingAddress = await payload.findByID({
      collection: 'addresses',
      id,
    })

    const addressCustomerId =
      typeof existingAddress.customer === 'string'
        ? existingAddress.customer
        : existingAddress.customer?.id

    if (addressCustomerId !== customerId) {
      return {
        success: false,
        message: 'Address not found',
      }
    }

    await payload.update({
      collection: 'addresses',
      id,
      data,
    })

    return {
      success: true,
      message: 'Address updated successfully',
    }
  } catch (error) {
    console.error('Update address error:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to update address',
    }
  }
}

/**
 * Delete an address
 */
export async function deleteAddress(id: string): Promise<ActionResponse> {
  try {
    const customerId = await getCurrentCustomerId()

    if (!customerId) {
      return {
        success: false,
        message: 'Not authenticated',
      }
    }

    const payload = await getPayload({ config })

    // Verify ownership before deleting
    const existingAddress = await payload.findByID({
      collection: 'addresses',
      id,
    })

    const addressCustomerId =
      typeof existingAddress.customer === 'string'
        ? existingAddress.customer
        : existingAddress.customer?.id

    if (addressCustomerId !== customerId) {
      return {
        success: false,
        message: 'Address not found',
      }
    }

    await payload.delete({
      collection: 'addresses',
      id,
    })

    return {
      success: true,
      message: 'Address deleted successfully',
    }
  } catch (error) {
    console.error('Delete address error:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to delete address',
    }
  }
}
