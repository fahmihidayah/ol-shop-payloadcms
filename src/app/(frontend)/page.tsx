import { getHomeConfig } from '@/feature/home/actions'
import {
  HeroComponent,
  Promotions,
  FeaturedProducts,
  NewArrivals,
  CategoriesShowcase,
} from '@/feature/home/components'
import { getNewArrival } from '@/feature/products/actions/get-list-products'
import { getStoreConfig } from '@/feature/store/actions'
import { Metadata } from 'next'
import { Media } from '@/payload-types'

export async function generateMetadata(): Promise<Metadata> {
  const storeConfig = await getStoreConfig()

  // Default fallback values
  const defaultTitle = 'Online Store | Shop Quality Products with Fast Delivery'
  const defaultDescription =
    'Discover amazing products at great prices. Browse our collection of quality items, enjoy exclusive promotions, and get fast delivery to your doorstep. Shop now!'
  const defaultKeywords = [
    'online shopping',
    'buy online',
    'online store',
    'shop products',
    'best deals',
    'quality products',
    'fast delivery',
    'secure shopping',
    'new arrivals',
    'featured products',
  ]

  // Use store config values with fallbacks
  const metaTitle = storeConfig?.metaTitle || defaultTitle
  const metaDescription = storeConfig?.metaDescription || defaultDescription

  // Handle keywords (array of objects from CMS)
  const keywords = storeConfig?.keywords
    ? storeConfig.keywords.map((k) => k.keyword).filter(Boolean)
    : defaultKeywords

  // OpenGraph settings
  const ogTitle = storeConfig?.ogTitle || metaTitle
  const ogDescription = storeConfig?.ogDescription || metaDescription
  const ogImageUrl =
    storeConfig?.ogImage && typeof storeConfig.ogImage !== 'string'
      ? (storeConfig.ogImage as Media).url
      : undefined

  // Twitter settings
  const twitterCard = (storeConfig?.twitterCard as 'summary' | 'summary_large_image') || 'summary_large_image'
  const twitterTitle = storeConfig?.twitterTitle || ogTitle
  const twitterDescription = storeConfig?.twitterDescription || ogDescription
  const twitterImageUrl =
    storeConfig?.twitterImage && typeof storeConfig.twitterImage !== 'string'
      ? (storeConfig.twitterImage as Media).url
      : ogImageUrl

  // Canonical URL
  const canonicalUrl = storeConfig?.canonicalUrl || '/'

  return {
    title: metaTitle,
    description: metaDescription,
    keywords,
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      type: 'website',
      url: '/',
      images: ogImageUrl
        ? [
            {
              url: ogImageUrl,
              alt: storeConfig?.storeName || 'Online Store',
            },
          ]
        : undefined,
    },
    twitter: {
      card: twitterCard,
      title: twitterTitle,
      description: twitterDescription,
      images: twitterImageUrl ? [twitterImageUrl] : undefined,
    },
    robots: {
      index: !storeConfig?.noIndex,
      follow: !storeConfig?.noFollow,
    },
    alternates: {
      canonical: canonicalUrl,
    },
  }
}

export default async function HomePage() {
  const homeConfig = await getHomeConfig()

  if (!homeConfig) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Unable to load home page content</p>
      </div>
    )
  }

  const products = await getNewArrival(homeConfig.newArrivals?.limit ?? 0)

  return (
    <div className="min-h-screen">
      <HeroComponent hero={homeConfig.hero} />
      <Promotions promotions={homeConfig.promotions} />
      <FeaturedProducts featuredProducts={homeConfig.featuredProducts} />
      <NewArrivals newArrivals={homeConfig.newArrivals} products={products} />
      <CategoriesShowcase categoriesShowcase={homeConfig.categoriesShowcase} />
    </div>
  )
}
