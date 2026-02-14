'use client'

import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { CalendarIcon, Search, X } from 'lucide-react'
import type { DateRange } from 'react-day-picker'
import type { OrderStatusFilter } from '../../actions/order'
import { Card } from '@/components/ui/card'

const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'pending', label: 'Pending' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
]

interface OrderFiltersProps {
  search: string
  status: OrderStatusFilter
  dateRange: DateRange | undefined
  onSearchChange: (value: string) => void
  onStatusChange: (value: OrderStatusFilter) => void
  onDateRangeChange: (range: DateRange | undefined) => void
  onClearFilters: () => void
  hasActiveFilters: boolean
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function OrderFilters({
  search,
  status,
  dateRange,
  onSearchChange,
  onStatusChange,
  onDateRangeChange,
  onClearFilters,
  hasActiveFilters,
}: OrderFiltersProps) {
  return (
    <Card className="flex flex-col gap-3 sm:flex-row w-full overflow-x-auto sm:flex-wrap sm:items-center p-4">
      {/* Search */}

      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search order number or recipient..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Status */}
      <Select value={status} onValueChange={(v) => onStatusChange(v as OrderStatusFilter)}>
        <SelectTrigger className="w-full sm:w-[160px]">
          <SelectValue placeholder="All Status" />
        </SelectTrigger>
        <SelectContent>
          {statusOptions.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Date Range */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full sm:w-1/3 sm:w-auto justify-start text-left font-normal"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange?.from ? (
              dateRange.to ? (
                <span>
                  {formatDate(dateRange.from)} - {formatDate(dateRange.to)}
                </span>
              ) : (
                formatDate(dateRange.from)
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar mode="range" selected={dateRange} onSelect={onDateRangeChange} />
        </PopoverContent>
      </Popover>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={onClearFilters}>
          <X className="h-4 w-4 mr-1" />
          Clear
        </Button>
      )}
    </Card>
  )
}
