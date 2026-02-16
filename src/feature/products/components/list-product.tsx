'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useDebounce } from '@/hooks/use-debounce'
import { ProductSearchInput } from './product-search-input'
import { ProductFilters } from './product-filters'
import { ProductGrid } from './product-grid'
import { ProductPagination } from './product-pagination'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { SlidersHorizontal } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getFilters } from '../actions/get-filter'
import { SortByOption } from '../types'
import { getProducts } from '../actions/get-list-products'

export function ListProduct({ initialCategory }: { initialCategory?: string }) {
  // Filter states
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialCategory ? [initialCategory] : [],
  )
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000])
  const [sortBy, setSortBy] = useState<SortByOption>('price-asc')
  const [currentPage, setCurrentPage] = useState(1)
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)

  // Debounce search query
  const debouncedSearch = useDebounce(searchQuery, 500)

  // Fetch filters
  const { data: filters, isLoading: filtersLoading } = useQuery({
    queryKey: ['product-filters'],
    queryFn: getFilters,
  })

  // Initialize price range when filters are loaded
  if (filters && priceRange[0] === 0 && priceRange[1] === 1000000) {
    setPriceRange([filters.priceRange.min, filters.priceRange.max])
  }

  // Fetch products with filters
  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ['products', debouncedSearch, selectedCategories, priceRange, sortBy, currentPage],
    queryFn: () =>
      getProducts({
        search: debouncedSearch,
        categories: selectedCategories,
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
        sortBy,
        page: currentPage,
        limit: 12,
      }),
    enabled: !!filters,
  })

  // Handlers
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
    )
    setCurrentPage(1)
  }

  const handlePriceRangeChange = (range: [number, number]) => {
    setPriceRange(range)
    setCurrentPage(1)
  }

  const handleSortByChange = (newSortBy: SortByOption) => {
    setSortBy(newSortBy)
    setCurrentPage(1)
  }

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setCurrentPage(1)
  }

  const handleClearFilters = () => {
    setSelectedCategories([])
    setPriceRange(filters ? [filters.priceRange.min, filters.priceRange.max] : [0, 1000000])
    setSearchQuery('')
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // Scroll to top of product grid
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (filtersLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading products...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!filters) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-muted-foreground">Failed to load filters</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Products</h1>
        <p className="text-muted-foreground">Discover our collection of amazing products</p>
      </div>

      {/* Search and Mobile Sort */}
      <div className="mb-6 space-y-4">
        <ProductSearchInput
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search products by name or description..."
        />

        {/* Mobile Controls */}
        <div className="flex items-center gap-2 lg:hidden">
          {/* Mobile Filter Button */}
          <Sheet open={isMobileFilterOpen} onOpenChange={setIsMobileFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="flex-1">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Filters
                {(selectedCategories.length > 0 ||
                  priceRange[0] !== filters.priceRange.min ||
                  priceRange[1] !== filters.priceRange.max) && (
                  <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                    {selectedCategories.length +
                      (priceRange[0] !== filters.priceRange.min ||
                      priceRange[1] !== filters.priceRange.max
                        ? 1
                        : 0)}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] overflow-y-auto">
              <div className="mt-6">
                <ProductFilters
                  filters={filters}
                  selectedCategories={selectedCategories}
                  onCategoryChange={handleCategoryChange}
                  priceRange={priceRange}
                  onPriceRangeChange={handlePriceRangeChange}
                  sortBy={sortBy}
                  onSortByChange={handleSortByChange}
                  onClearFilters={handleClearFilters}
                />
              </div>
            </SheetContent>
          </Sheet>

          {/* Mobile Sort */}
          <Select
            value={sortBy}
            onValueChange={(value) => handleSortByChange(value as SortByOption)}
          >
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              {filters.sortByOptions.map((option) => (
                <SelectItem key={option.value} value={option.value ?? ''}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters - Desktop */}
        <aside className="hidden lg:block">
          <div className="sticky top-20">
            <ProductFilters
              filters={filters}
              selectedCategories={selectedCategories}
              onCategoryChange={handleCategoryChange}
              priceRange={priceRange}
              onPriceRangeChange={handlePriceRangeChange}
              sortBy={sortBy}
              onSortByChange={handleSortByChange}
              onClearFilters={handleClearFilters}
            />
          </div>
        </aside>

        {/* Products Grid */}
        <div className="lg:col-span-3">
          {/* Results Info */}
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {productsData ? (
                <>
                  Showing {(currentPage - 1) * 12 + 1}-
                  {Math.min(currentPage * 12, productsData.totalDocs)} of {productsData.totalDocs}{' '}
                  products
                </>
              ) : (
                'Loading...'
              )}
            </p>
          </div>

          {/* Product Grid */}
          <ProductGrid products={productsData?.docs || []} isLoading={productsLoading} />

          {/* Pagination */}
          {productsData && productsData.totalPages > 1 && (
            <ProductPagination
              currentPage={currentPage}
              totalPages={productsData.totalPages}
              hasNextPage={productsData.hasNextPage}
              hasPrevPage={productsData.hasPrevPage}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>
    </div>
  )
}
