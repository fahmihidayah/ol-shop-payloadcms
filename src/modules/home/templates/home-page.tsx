import { getPayload } from 'payload'
import config from '@/payload.config'
import { Category, Product } from '@/payload-types'
import { HeroSection } from '../components/hero-section'
import { BannerSlider } from '../components/banner-slider'
import { PromotionalBanners } from '../components/promotional-banners'
import { FeaturedProducts } from '../components/featured-products'
import { NewArrivals } from '../components/new-arrivals'
import { CategoriesShowcase } from '../components/categories-showcase'
import { ContentBlocks } from '../components/content-blocks'

export async function HomePage() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  // Fetch home page global data
  const homeData = await payload.findGlobal({
    slug: 'home-page',
  })

  // Fetch products for featured section
  let featuredProducts: Product[] = []
  if (homeData.featuredProducts?.enabled) {
    if (homeData.featuredProducts.displayType === 'manual' && homeData.featuredProducts.products) {
      // Manual selection
      const productIds = homeData.featuredProducts.products
        .map((p) => (typeof p === 'string' ? p : p.id))
        .filter(Boolean)

      if (productIds.length > 0) {
        const result = await payload.find({
          collection: 'products',
          where: {
            id: {
              in: productIds,
            },
            isActive: {
              equals: true,
            },
          },
          limit: homeData.featuredProducts.limit || 8,
        })
        featuredProducts = result.docs
      }
    } else {
      // Auto - get featured products
      const result = await payload.find({
        collection: 'products',
        where: {
          featured: {
            equals: true,
          },
          isActive: {
            equals: true,
          },
        },
        limit: homeData.featuredProducts.limit || 8,
        sort: '-createdAt',
      })
      featuredProducts = result.docs
    }
  }

  // Fetch new arrivals
  let newArrivals: Product[] = []
  if (homeData.newArrivals?.enabled) {
    const result = await payload.find({
      collection: 'products',
      where: {
        isActive: {
          equals: true,
        },
      },
      limit: homeData.newArrivals.limit || 8,
      sort: '-createdAt',
    })
    newArrivals = result.docs
  }

  // Fetch categories
  let categories: Category[] = []
  if (homeData.categoriesShowcase?.enabled && homeData.categoriesShowcase.categories) {
    const categoryIds = homeData.categoriesShowcase.categories
      .map((c) => (typeof c === 'string' ? c : c.id))
      .filter(Boolean)

    if (categoryIds.length > 0) {
      const result = await payload.find({
        collection: 'categories',
        where: {
          id: {
            in: categoryIds,
          },
        },
      })
      categories = result.docs
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection hero={homeData.hero} />

      {/* Banner Slider */}
      <BannerSlider banners={homeData.banners} />

      {/* Promotional Banners */}
      <PromotionalBanners banners={homeData.promotionalBanners} />

      {/* Featured Products */}
      <FeaturedProducts config={homeData.featuredProducts} products={featuredProducts} />

      {/* Categories Showcase */}
      <CategoriesShowcase config={homeData.categoriesShowcase} categories={categories} />

      {/* New Arrivals */}
      <NewArrivals config={homeData.newArrivals} products={newArrivals} />

      {/* Content Blocks */}
      <ContentBlocks blocks={homeData.contentBlocks} />
    </div>
  )
}
