'use server'

import { cookies } from 'next/headers'
import { session } from 'node_modules/@payloadcms/payload-cloud/dist/utilities/getStorageClient'

export const getSession = async (): Promise<string> => {
  const cookieStore = await cookies()
  const sessionID = cookieStore.get('cart_session_id')?.value
  if (!sessionID) {
    const newSessionID = crypto.randomUUID()
    cookieStore.set('cart_session_id', newSessionID, {
      httpOnly: true, // More secure - not accessible via JavaScript
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    })
    return newSessionID
  }
  return sessionID
}
