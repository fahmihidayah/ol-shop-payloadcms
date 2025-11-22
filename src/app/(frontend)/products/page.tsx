import ListProduct from '@/modules/products/templates/list-products-page'
import { getPayload } from 'payload'
import config from '@payload-config'

type Props = {
  params: Promise<{}>
}

export default async function Page(props: Props) {
  const payload = await getPayload({
    config: config,
  })

  const productDocs = await payload.find({
    collection: 'products',
  })
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
      <h3 className="font-semibold text-2xl mb-6 sm:mb-8">Products</h3>
      <ListProduct productsDoc={productDocs} />
    </div>
  )
}
