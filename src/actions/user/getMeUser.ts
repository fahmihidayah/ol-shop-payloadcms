'use server'
import { getClientSideURL } from '@/lib/getURL'
import { User } from '@/payload-types'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const getMeUser = async (args?: {
  nullUserRedirect?: string
  validUserRedirect?: string
}): Promise<{
  token: string
  user: User
}> => {
  const { nullUserRedirect, validUserRedirect } = args || {}
  const cookieStore = await cookies()
  const token = cookieStore.get('payload-token')?.value

  const meUserReq = await fetch(`${getClientSideURL()}/api/users/me`, {
    headers: {
      Authorization: `JWT ${token}`,
      'x-api-key': process.env.PAYLOAD_API_KEY || '',
    },
  })

  const {
    user,
  }: {
    user: User
  } = await meUserReq.json()

  if (validUserRedirect && meUserReq.ok && user) {
    redirect(validUserRedirect)
  }

  if (nullUserRedirect && (!meUserReq.ok || !user)) {
    redirect(nullUserRedirect)
  }

  // delete role from user
  if ('role' in user) {
    delete user?.role
  }

  // Token will exist here because if it doesn't the user will be redirected
  return {
    token: token!,
    user,
  }
}

export const getMeUserByToken = async (args?: {
  token: string
}): Promise<{
  token: string
  user: User
}> => {
  const token = args?.token

  const meUserReq = await fetch(`${getClientSideURL()}/api/users/me`, {
    headers: {
      Authorization: `JWT ${token}`,
      'x-api-key': process.env.PAYLOAD_API_KEY || '',
    },
  })

  const {
    user,
  }: {
    user: User
  } = await meUserReq.json()

  // delete role from user
  if ('role' in user) {
    delete user?.role
  }

  // Token will exist here because if it doesn't the user will be redirected
  return {
    token: token!,
    user,
  }
}
