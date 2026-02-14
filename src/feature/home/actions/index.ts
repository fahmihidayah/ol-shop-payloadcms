import { getPayload } from 'payload'
import config from '@payload-config'
import { HomePage } from '@/payload-types'
export const getHomeConfig = async (): Promise<HomePage | null> => {
  try {
    const payload = await getPayload({
      config,
    })

    const home = await payload.findGlobal({
      slug: 'home-page',
    })

    return home
  } catch (error) {
    return null
  }
}
