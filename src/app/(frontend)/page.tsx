import { getHomeConfig } from '@/feature/home/actions'
import {
  HeroComponent,
  Promotions,
  FeaturedProducts,
  NewArrivals,
  CategoriesShowcase,
} from '@/feature/home/components'
import { getNewArrival } from '@/feature/products/actions'

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
