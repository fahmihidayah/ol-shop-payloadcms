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

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection hero={homeData.hero} />

      {/* Banner Slider */}
      {/* <BannerSlider banners={homeData.banners} /> */}

      {/* Promotional Banners */}
      <PromotionalBanners banners={homeData.promotions} />

      {/* Featured Products */}
      <FeaturedProducts featuredProducts={homeData.featuredProducts} />

      {/* Categories Showcase */}
      <CategoriesShowcase categoryShowcase={homeData.categoriesShowcase} />
    </div>
  )
}
