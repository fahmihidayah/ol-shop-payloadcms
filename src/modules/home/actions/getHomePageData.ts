'use server'

import config from '@payload-config'
import { getPayload } from 'payload'

export async function getHomePageData() {
  try {
    const payload = await getPayload({
      config,
    })

    const homeData = await payload.findGlobal({
      slug: 'home-page',
    })

    return homeData
  } catch (error) {
    console.error('Error fetching home page data:', error)
    return null
  }
}
