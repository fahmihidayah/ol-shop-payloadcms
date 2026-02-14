import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { NewArrival } from '../type'
import { Product } from '@/payload-types'
import { getMedia } from '@/lib/type-utils'
import ProductItem from '@/feature/products/components/product-item'

interface NewArrivalsProps {
  newArrivals?: NewArrival
  products: Product[]
}

export function NewArrivals({ newArrivals, products }: NewArrivalsProps) {
  if (!newArrivals?.enabled || !products || products.length === 0) {
    return null
  }

  return (
    <section className="py-16 px-6">
      <div className="mx-auto max-w-7xl">
        {newArrivals.title && (
          <h2 className="text-3xl font-bold text-center mb-12">{newArrivals.title}</h2>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => {
            return <ProductItem key={product.id} product={product} />
          })}
        </div>
      </div>
    </section>
  )
}
