import { Product } from '@/payload-types'
import ProductDetailView from '../components/product-view'

export default function ProductDetailPage({ product }: { product: Product }) {
  return (
    <section>
      <ProductDetailView product={product} />
    </section>
  )
}
