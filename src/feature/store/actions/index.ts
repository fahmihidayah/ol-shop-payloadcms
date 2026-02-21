'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import { StoreConfig } from '@/payload-types'

export const getStoreConfig = async (): Promise<StoreConfig | null> => {
  try {
    const payload = await getPayload({
      config,
    })

    const storeConfig = await payload.findGlobal({
      slug: 'store-config',
    })

    return storeConfig
  } catch (error) {
    return null
  }
}
