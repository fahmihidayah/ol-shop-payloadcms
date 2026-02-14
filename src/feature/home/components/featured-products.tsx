import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { getMedia } from '@/lib/type-utils'
import { FeaturedProduct } from '../type'
import { Product } from '@/payload-types'
import ProductItem from '@/feature/products/components/product-item'

interface FeaturedProductsProps {
  featuredProducts?: FeaturedProduct | null
}

export function FeaturedProducts({ featuredProducts }: FeaturedProductsProps) {
  if (
    !featuredProducts?.enabled ||
    !featuredProducts?.products ||
    featuredProducts.products.length === 0
  ) {
    return null
  }

  return (
    <section className="py-16 px-6 bg-muted/50">
      <div className="mx-auto max-w-7xl">
        {featuredProducts.title && (
          <h2 className="text-3xl font-bold text-center mb-12">{featuredProducts.title}</h2>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.products.map((p) => {
            const product = p as Product
            return <ProductItem key={product.id} product={product} />
          })}
        </div>
      </div>
    </section>
  )
}
