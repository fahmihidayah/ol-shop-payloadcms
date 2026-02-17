// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres'
// import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users/config'
import { Pages } from './collections/Page/config'
import { Posts } from './collections/Posts/config'
import { Categories } from './collections/Categories/config'
import { Media } from './collections/Media'
import getCloudStoragePlugin from './plugins/cloud-storage-plugin'
import { Products } from './collections/Products/config'
import { Addresses } from './collections/Addresses/config'
import { Orders } from './collections/Orders/config'
import { OrderItems } from './collections/OrderItems/config'
import { Payments } from './collections/Payments/config'
import { PaymentOptions } from './collections/PaymentOptions/config'
import { Customers } from './collections/Customers/config'
import { Carts } from './collections/Carts/config'
import { CartItems } from './collections/CartItems/config'
import { HomeConfig } from './globals/home/config'
import { endpointsV1 } from './feature/api/v1'
import { StoreConfig } from './globals/store/config'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  endpoints: [...endpointsV1],
  collections: [
    Users,
    Posts,
    Categories,
    Media,
    Products,
    Addresses,
    Orders,
    OrderItems,
    Payments,
    PaymentOptions,
    Customers,
    Carts,
    CartItems,
    Pages,
  ],
  globals: [HomeConfig, StoreConfig],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  // db : postgresAdapter({

  // })
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL,
    },
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    getCloudStoragePlugin(),
    // storage-adapter-placeholder
  ],
})
