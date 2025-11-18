import { headers as getHeaders } from 'next/headers.js'
import Image from 'next/image'
import { getPayload } from 'payload'
import React from 'react'
import { fileURLToPath } from 'url'

import config from '@/payload.config'
import './styles.css'
import ListProduct from '@/modules/products/templates/list-products-page'

export default async function HomePage() {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })

  const fileURL = `vscode://file/${fileURLToPath(import.meta.url)}`

  const products = await payload.find({
    collection: 'products',
    limit: 100,
  })

  console.log('list of product ', products.docs.length)

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
      <h3 className="font-semibold text-2xl mb-6 sm:mb-8">Products</h3>
      <ListProduct productsDoc={products} />
    </div>
  )
}
