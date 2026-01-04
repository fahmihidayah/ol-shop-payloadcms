import Link from 'next/link'
import { Product } from '@/payload-types'
import ProductItem from '@/modules/products/components/product-item'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

type FeaturedProductsProps = {
  featuredProducts?: {
    enabled?: boolean | null
    title?: string | null
    selectionMode?: ('auto' | 'manual') | null
    products?: (string | Product)[] | null
    limit?: number | null
  }
}

export function FeaturedProducts({ featuredProducts }: FeaturedProductsProps) {
  if (!featuredProducts?.enabled || featuredProducts.products?.length === 0) return null

  const displayProducts = featuredProducts.products?.slice(
    0,
    featuredProducts.limit || 8,
  ) as Product[]

  return (
    <section className="container mx-auto px-4 sm:px-6  py-4 sm:py-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 sm:mb-12">
        <div>
          <h2 className="text-lg sm:text-4xl font-bold">
            {featuredProducts.title || 'Featured Products'}
          </h2>
        </div>
        <Button asChild variant="outline">
          <Link href="/products" className="gap-2">
            View All
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
        {displayProducts?.map((product) => (
          <ProductItem key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
