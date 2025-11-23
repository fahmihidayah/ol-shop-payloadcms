'use server'
import { getClientSideURL, getServerSideURL } from '@/lib/getURL'
import { Customer } from '@/payload-types'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const getMeCustomer = async (args?: {
  nullUserRedirect?: string
  validUserRedirect?: string
}): Promise<{
  token: string
  user: Customer
}> => {
  const { nullUserRedirect, validUserRedirect } = args || {}
  const cookieStore = await cookies()
  const token = cookieStore.get('payload-token')?.value

  const meUserReq = await fetch(`${getServerSideURL()}/api/customers/me`, {
    headers: {
      Authorization: `JWT ${token}`,
      'x-api-key': process.env.PAYLOAD_API_KEY || '',
    },
  })

  const {
    user,
  }: {
    user: Customer
  } = await meUserReq.json()

  if (validUserRedirect && meUserReq.ok && user) {
    redirect(validUserRedirect)
  }

  if (nullUserRedirect && (!meUserReq.ok || !user)) {
    redirect(nullUserRedirect)
  }

  console.log('cutsomer is ', JSON.stringify(user))

  // Token will exist here because if it doesn't the user will be redirected
  return {
    token: token!,
    user,
  }
}
