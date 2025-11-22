import Link from 'next/link'
import { Product } from '@/payload-types'
import ProductItem from '@/modules/products/components/product-item'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles } from 'lucide-react'

type NewArrivalsProps = {
  config?: {
    enabled?: boolean
    title?: string
    subtitle?: string
    limit?: number
  }
  products: Product[]
}

export function NewArrivals({ config, products }: NewArrivalsProps) {
  if (!config?.enabled || products.length === 0) return null

  const displayProducts = products.slice(0, config.limit || 8)

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 sm:mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-6 w-6 text-primary" />
              <h2 className="text-3xl sm:text-4xl font-bold">
                {config.title || 'New Arrivals'}
              </h2>
            </div>
            {config.subtitle && (
              <p className="text-muted-foreground text-base sm:text-lg">{config.subtitle}</p>
            )}
          </div>
          <Button asChild variant="outline">
            <Link href="/products?sort=newest" className="gap-2">
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
          {displayProducts.map((product) => (
            <ProductItem key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
