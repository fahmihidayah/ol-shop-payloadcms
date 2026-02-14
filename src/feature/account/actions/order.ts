'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import { cookies } from 'next/headers'
import { getMeUser } from '@/lib/customer-utils'
import type { Order } from '@/payload-types'
import type { Where } from 'payload'

export type OrderStatusFilter =
  | 'all'
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'

export interface GetOrdersParams {
  status?: OrderStatusFilter
  search?: string
  dateFrom?: string
  dateTo?: string
  page?: number
  limit?: number
}

export interface GetOrdersResult {
  orders: Order[]
  totalDocs: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export async function getOrders(params: GetOrdersParams = {}): Promise<GetOrdersResult> {
  const empty: GetOrdersResult = {
    orders: [],
    totalDocs: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  }

  try {
    const payload = await getPayload({ config })
    const { user } = await getMeUser()
    const cookieStore = await cookies()

    const { status = 'all', search = '', dateFrom, dateTo, page = 1, limit = 10 } = params

    // Build where conditions
    const conditions: Record<string, unknown>[] = []

    // Filter by user or session
    if (user) {
      conditions.push({ customer: { equals: user.id } })
    } else {
      const sessionId = cookieStore.get('cart-session-id')?.value
      if (!sessionId) return empty
      conditions.push({ sessionId: { equals: sessionId } })
    }

    // Status filter
    if (status && status !== 'all') {
      conditions.push({ orderStatus: { equals: status } })
    }

    // Date range filter
    if (dateFrom) {
      conditions.push({ createdAt: { greater_than_equal: dateFrom } })
    }
    if (dateTo) {
      const endDate = new Date(dateTo)
      endDate.setDate(endDate.getDate() + 1)
      conditions.push({ createdAt: { less_than: endDate.toISOString() } })
    }

    // Search filter (order number or recipient name)
    if (search) {
      conditions.push({
        or: [
          { orderNumber: { contains: search } },
          { 'shippingAddress.recipientName': { contains: search } },
        ],
      })
    }

    const where: Where = conditions.length > 0 ? { and: conditions as Where[] } : {}

    const result = await payload.find({
      collection: 'orders',
      where,
      sort: '-createdAt',
      page,
      limit,
      overrideAccess: true,
    })

    return {
      orders: result.docs as Order[],
      totalDocs: result.totalDocs,
      totalPages: result.totalPages,
      hasNextPage: result.hasNextPage,
      hasPrevPage: result.hasPrevPage,
    }
  } catch (error) {
    console.error('[GET_ORDERS] Error:', error)
    return empty
  }
}
