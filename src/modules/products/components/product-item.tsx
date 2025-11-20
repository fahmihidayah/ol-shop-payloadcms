'use client'
import { Button } from '@/components/ui/button'
import { ImageMedia } from '@/modules/media/image-media'
import { Media, Product } from '@/payload-types'
import Link from 'next/link'
import { useState } from 'react'

export function formatPrice(value: number | string | null | undefined) {
  if (!value) return 'Rp 0'

  const number = typeof value === 'string' ? parseFloat(value) : value

  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(number)
}

export default function ProductItem({ product }: { product: Product }) {
  const [loading, setLoading] = useState(false)

  const handleAddToCart = async (e: any) => {
    try {
      setLoading(true)
      await new Promise((res) => setTimeout(res, 600))
      console.log('Added to cart', product)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Link
      prefetch
      href={`/products/${product.slug}`}
      className="flex flex-col gap-3 rounded-lg p-3 h-full hover:cursor-pointer"
    >
      {/* image section stays on top */}
      <div className="flex justify-center">
        <ImageMedia
          media={product.thumbnail as Media}
          width={200}
          height={200}
          className="object-contain rounded-md h-64 w-64"
        />
      </div>

      {/* content section follows naturally */}
      <div className="flex flex-col gap-2 flex-1">
        <h3 className="text-sm font-semibold text-center line-clamp-2">{product.title}</h3>

        <p className="font-medium text-center">
          {formatPrice(product['product-variant']?.at(0)?.price)}
        </p>

        <Button className="w-full" onClick={handleAddToCart} disabled={loading}>
          {loading ? 'Adding...' : 'Add to Cart'}
        </Button>
      </div>
    </Link>
  )
}
