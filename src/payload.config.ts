// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users/config'
import { Customers } from './collections/Customers/config'
import { Media } from './collections/Media/config'
import { Categories } from './collections/Categories/config'
import { Products } from './collections/Products/config'
import { Carts } from './collections/Carts/config'
import { CartItems } from './collections/CartItems/config'
import { Orders } from './collections/Orders/config'
import { OrderItems } from './collections/OrderItems/config'
import { Payments } from './collections/Payments/config'
import { Addresses } from './collections/Addresses/config'
import { PaymentOptions } from './collections/PaymentOptions/config'
import { HomePageSettings } from './globals'
import { ProductVariant } from './collections/Products/Variants/config'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Users,
    Customers,
    Media,
    Categories,
    Products,
    ProductVariant,
    Carts,
    CartItems,
    Orders,
    OrderItems,
    Payments,
    PaymentOptions,
    Addresses,
  ],
  globals: [HomePageSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    // storage-adapter-placeholder
  ],
})
