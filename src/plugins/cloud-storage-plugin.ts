import { s3Storage } from '@payloadcms/storage-s3'

export default function getCloudStoragePlugin() {
  return s3Storage({
    collections: {
      media: true,
    },
    bucket: process.env.CLOUD_STORAGE_BUCKET ?? '',

    config: {
      forcePathStyle: true,
      endpoint: process.env.CLOUD_STORAGE_ENDPOINT ?? '',
      credentials: {
        accessKeyId: process.env.CLOUD_STORAGE_ACCESS_KEY ?? '',
        secretAccessKey: process.env.CLOUD_STORAGE_SECRET ?? '',
      },
      region: 'us-east-1',
    },
  })
}
