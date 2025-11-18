import { ImageMedia } from '@/modules/media/image-media'
import { Media, Product } from '@/payload-types'
import Image from 'next/image'

export default function ProductItem({ product }: { product: Product }) {
  return (
    <div className="flex flex-col gap-2 items-center rounded-lg border border-slate-600/20 p-3">
      <ImageMedia
        media={product.thumbnail as Media}
        width={200}
        height={200}
        className="object-contain"
      />
      <h3 className="text-lg font-semibold w-full text-center">{product.title}</h3>
      <p className="text-lg font-medium w-full text-center">
        {product['product-variant']?.at(0)?.price}
      </p>
    </div>
  )
}
