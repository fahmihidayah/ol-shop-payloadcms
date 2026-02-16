'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import { cookies } from 'next/headers'
import { getMeUser } from '@/lib/customer-utils'
import type { Address } from '@/payload-types'
import { getListService } from '@/lib/services/get-list-service'

export async function getListAddresses(): Promise<Address[]> {
  try {
    const payload = await getPayload({ config })
    const { user } = await getMeUser()
    const cookieStore = await cookies()

    if (user) {
      const result = await getListService<Address>({
        serviceContext: {
          collection: 'addresses',
          payload,
        },
        options: {
          where: {
            customer: { equals: user.id },
          },
          sort: '-createdAt',
        },
      })
      // const result = await payload.find({
      //   collection: 'addresses',
      //   where: {
      //     customer: { equals: user.id },
      //   },
      //   sort: '-createdAt',
      //   overrideAccess: true,
      // })
      return result.docs as Address[]
    }

    // Guest user: find by sessionId
    const sessionId = cookieStore.get('cart-session-id')?.value
    if (sessionId) {
      // const result = await payload.find({
      //   collection: 'addresses',
      //   where: {
      //     sessionId: { equals: sessionId },
      //   },
      //   sort: '-createdAt',
      //   overrideAccess: true,
      // })
      const result = await getListService<Address>({
        serviceContext: {
          collection: 'addresses',
          payload,
        },
        options: {
          where: {
            sessionId: { equals: sessionId },
          },
          sort: '-createdAt',
        },
      })
      return result.docs as Address[]
    }

    return []
  } catch (error) {
    console.error('[GET_LIST_ADDRESSES] Error:', error)
    return []
  }
}
