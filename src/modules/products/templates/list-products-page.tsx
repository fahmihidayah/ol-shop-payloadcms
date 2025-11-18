import { Product } from '@/payload-types'
import { PaginatedDocs } from 'payload'
import ProductItem from '../components/product-item'

export default function ListProduct({ productsDoc }: { productsDoc: PaginatedDocs<Product> }) {
  return (
    <section className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 w-full">
      {productsDoc.docs.map((product, index) => {
        return <ProductItem product={product} key={index} />
      })}
    </section>
  )
}
