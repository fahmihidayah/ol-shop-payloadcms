'use server'
import { Customer, User } from '@/payload-types'
import { cookies } from 'next/headers'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { getUserFromToken } from './jwt-utils'

/**
 * Gets the current authenticated employee from JWT token in cookies
 * Returns null employee if token is invalid, expired, or employee not found
 */
export const getMeUser = async (): Promise<{
    token: string
    user?: Customer
}> => {
    const cookieStore = await cookies()
    const token = cookieStore.get('payload-token')?.value

    if (!token) {
        return { token: '', user: undefined }
    }

    const decodedToken = await getUserFromToken(token)

    if (!decodedToken) {
        return { token: '', user: undefined }
    }

    try {
        const payload = await getPayload({ config })

        const customer = await payload.findByID({
            collection: 'customers',
            id: decodedToken.id,
            overrideAccess: true,
        })

        if (!customer) {
            return { token: '', user: undefined }
        }

        return {
            token,
            user: customer as Customer,
        }
    } catch (error) {
        return { token: '', user: undefined }
    }
}