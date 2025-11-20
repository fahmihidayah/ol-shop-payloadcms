import ProductDetailPage from '@/modules/products/templates/product-detail-page'
import { getPayload } from 'payload'

import config from '@payload-config'
import { notFound } from 'next/navigation'

type Props = {
  params: Promise<{
    slug: string
  }>
}

export default async function Page(props: Props) {
  const payload = await getPayload({
    config: config,
  })

  const slug = (await props.params).slug

  const products = await payload.find({
    collection: 'products',
    where: {
      or: [
        {
          slug: {
            equals: slug,
          },
        },
      ],
    },
  })

  if (products.docs.length === 0) {
    notFound()
  }

  return (
    <main className="w-full px-5 sm:px-10 py-10">
      <ProductDetailPage product={products.docs[0]} />
    </main>
  )
}
