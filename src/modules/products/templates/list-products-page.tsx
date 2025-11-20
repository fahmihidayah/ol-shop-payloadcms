import { Product } from '@/payload-types'
import { PaginatedDocs } from 'payload'
import ProductItem from '../components/product-item'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@radix-ui/react-dropdown-menu'

export default function ListProduct({ productsDoc }: { productsDoc: PaginatedDocs<Product> }) {
  return (
    <section className="flex flex-col md:flex-row gap-5">
      <section className="flex flex-col w-full md:w-1/4 space-y-4">
        <Input placeholder="Search" />
        <h3 className="font-semibold">Category</h3>
        <div className="flex gap-2 items-center ">
          <Checkbox />
          <Label>Jaket</Label>
        </div>
        <div className="flex gap-2 items-center ">
          <Checkbox />
          <Label>Baju</Label>
        </div>
      </section>
      <section className="md:w-3/4 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 w-full">
        {productsDoc.docs.map((product, index) => {
          return <ProductItem product={product} key={index} />
        })}
      </section>
    </section>
  )
}
