import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your Next.js config here
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.duitku.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ol-shop-payloadcms-production.up.railway.app',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['your.domain.com'],
    },
  },
  webpack: (webpackConfig, { isServer }) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    // Externalize server-only packages to prevent bundling native modules
    if (isServer) {
      const externals = Array.isArray(webpackConfig.externals)
        ? webpackConfig.externals
        : webpackConfig.externals
          ? [webpackConfig.externals]
          : []

      webpackConfig.externals = [
        ...externals,
        'nunjucks',
        'chokidar',
        'fsevents',
      ]
    }

    return webpackConfig
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
