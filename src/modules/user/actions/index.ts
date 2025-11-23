'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import { getMeCustomer } from '@/actions/customer/getMeCustomer'

interface UpdateProfileInput {
  name: string
  email: string
  phone?: string
}

interface UpdatePasswordInput {
  currentPassword: string
  newPassword: string
}

interface ActionResponse {
  success: boolean
  message?: string
}

/**
 * Get current customer ID from session
 */
async function getCurrentCustomerId(): Promise<string | undefined> {
  try {
    const { user } = await getMeCustomer()
    return user?.id
  } catch {
    return undefined
  }
}

/**
 * Update customer profile
 */
export async function updateProfile(data: UpdateProfileInput): Promise<ActionResponse> {
  try {
    const customerId = await getCurrentCustomerId()

    if (!customerId) {
      return {
        success: false,
        message: 'Not authenticated',
      }
    }

    const payload = await getPayload({ config })

    // Check if email is already used by another customer
    if (data.email) {
      const existingCustomer = await payload.find({
        collection: 'customers',
        where: {
          and: [
            {
              email: {
                equals: data.email.toLowerCase(),
              },
            },
            {
              id: {
                not_equals: customerId,
              },
            },
          ],
        },
        limit: 1,
      })

      if (existingCustomer.docs.length > 0) {
        return {
          success: false,
          message: 'Email is already in use',
        }
      }
    }

    // Update customer
    await payload.update({
      collection: 'customers',
      id: customerId,
      data: {
        name: data.name,
        email: data.email.toLowerCase(),
        phone: data.phone || undefined,
      },
    })

    return {
      success: true,
      message: 'Profile updated successfully',
    }
  } catch (error) {
    console.error('Update profile error:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to update profile',
    }
  }
}

/**
 * Update customer password
 */
export async function updatePassword(data: UpdatePasswordInput): Promise<ActionResponse> {
  try {
    const customerId = await getCurrentCustomerId()

    if (!customerId) {
      return {
        success: false,
        message: 'Not authenticated',
      }
    }

    const payload = await getPayload({ config })

    // Get customer to verify current password
    const customer = await payload.findByID({
      collection: 'customers',
      id: customerId,
    })

    if (!customer) {
      return {
        success: false,
        message: 'Customer not found',
      }
    }

    // Verify current password by attempting login
    try {
      await payload.login({
        collection: 'customers',
        data: {
          email: customer.email,
          password: data.currentPassword,
        },
      })
    } catch {
      return {
        success: false,
        message: 'Current password is incorrect',
      }
    }

    // Update password
    await payload.update({
      collection: 'customers',
      id: customerId,
      data: {
        password: data.newPassword,
      },
    })

    return {
      success: true,
      message: 'Password updated successfully',
    }
  } catch (error) {
    console.error('Update password error:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to update password',
    }
  }
}
