'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useDebounce } from '@/hooks/use-debounce'
import { getOrders, type OrderStatusFilter } from '../../actions/order'
import { OrderFilters } from './order-filters'
import { OrderCard } from './order-card'
import { OrderPagination } from './order-pagination'
import { Package } from 'lucide-react'
import type { DateRange } from 'react-day-picker'

export function OrderList() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<OrderStatusFilter>('all')
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [currentPage, setCurrentPage] = useState(1)

  const debouncedSearch = useDebounce(search, 500)

  const { data, isLoading } = useQuery({
    queryKey: [
      'orders',
      debouncedSearch,
      status,
      dateRange?.from?.toISOString(),
      dateRange?.to?.toISOString(),
      currentPage,
    ],
    queryFn: () =>
      getOrders({
        search: debouncedSearch,
        status,
        dateFrom: dateRange?.from?.toISOString(),
        dateTo: dateRange?.to?.toISOString(),
        page: currentPage,
        limit: 10,
      }),
  })

  const handleSearchChange = (value: string) => {
    setSearch(value)
    setCurrentPage(1)
  }

  const handleStatusChange = (value: OrderStatusFilter) => {
    setStatus(value)
    setCurrentPage(1)
  }

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range)
    setCurrentPage(1)
  }

  const handleClearFilters = () => {
    setSearch('')
    setStatus('all')
    setDateRange(undefined)
    setCurrentPage(1)
  }

  const hasActiveFilters = search !== '' || status !== 'all' || dateRange !== undefined

  return (
    <div className="space-y-6">
      <OrderFilters
        search={search}
        status={status}
        dateRange={dateRange}
        onSearchChange={handleSearchChange}
        onStatusChange={handleStatusChange}
        onDateRangeChange={handleDateRangeChange}
        onClearFilters={handleClearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Results info */}
      {data && data.totalDocs > 0 && (
        <p className="text-sm text-muted-foreground">
          Showing {(currentPage - 1) * 10 + 1}-
          {Math.min(currentPage * 10, data.totalDocs)} of {data.totalDocs} orders
        </p>
      )}

      {/* Loading skeleton */}
      {isLoading && <OrderListSkeleton />}

      {/* Order cards */}
      {!isLoading && data && data.orders.length > 0 && (
        <div className="space-y-4">
          {data.orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && data && data.orders.length === 0 && (
        <div className="text-center py-16">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            {hasActiveFilters ? 'No orders match your filters.' : 'You have no orders yet.'}
          </p>
        </div>
      )}

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <OrderPagination
          currentPage={currentPage}
          totalPages={data.totalPages}
          hasNextPage={data.hasNextPage}
          hasPrevPage={data.hasPrevPage}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  )
}

function OrderListSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="rounded-xl border p-6 animate-pulse">
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
            <div className="space-y-2">
              <div className="h-4 w-32 bg-muted rounded" />
              <div className="h-3 w-24 bg-muted rounded" />
            </div>
            <div className="flex gap-2">
              <div className="h-6 w-20 bg-muted rounded" />
              <div className="h-6 w-16 bg-muted rounded" />
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="h-3 w-40 bg-muted rounded" />
            <div className="h-3 w-32 bg-muted rounded" />
          </div>
          <div className="mt-4 pt-3 border-t flex justify-between">
            <div className="h-4 w-12 bg-muted rounded" />
            <div className="h-4 w-24 bg-muted rounded" />
          </div>
        </div>
      ))}
    </div>
  )
}
