'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import { cookies } from 'next/headers'
import { getMeUser } from '@/lib/customer-utils'
import type { Address } from '@/payload-types'
import { AddressService } from '../../services/address-service'

export async function getListAddresses(): Promise<Address[]> {
  try {
    const { user } = await getMeUser()
    const cookieStore = await cookies()
    const sessionId = cookieStore.get('cart-session-id')?.value
    const result = await AddressService.findAll({
      serviceContext: {
        payload: await getPayload({ config }),
        sessionId,
        user,
      },
    })
    if (result.error) {
      return []
    }
    return result.data?.docs ?? []
  } catch (error) {
    console.error('[GET_LIST_ADDRESSES] Error:', error)
    return []
  }
}
