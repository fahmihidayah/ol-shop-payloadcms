'use server'

import config from '@payload-config'
import { getPayload } from 'payload'
import { cookies } from 'next/headers'
import { Customer } from '@/payload-types'

type CustomerSessionResponse = {
  user: Customer | null
  token: string | null
}

export async function getCustomerSession(): Promise<CustomerSessionResponse> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('payload-token')?.value

    if (!token) {
      return {
        user: null,
        token: null,
      }
    }

    const payload = await getPayload({
      config,
    })

    // Verify the token and get the customer
    const customer = await payload.findByID({
      collection: 'customers',
      id: token,
    })

    if (!customer) {
      return {
        user: null,
        token: null,
      }
    }

    return {
      user: customer as Customer,
      token,
    }
  } catch (error) {
    console.error('Error getting customer session:', error)
    return {
      user: null,
      token: null,
    }
  }
}
