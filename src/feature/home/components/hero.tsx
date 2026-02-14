import Image from 'next/image'
import Link from 'next/link'
import { Hero } from '../type'
import { getMedia } from '@/lib/type-utils'
import { Button } from '@/components/ui/button'

export function HeroComponent({ hero }: { hero: Hero }) {
  if (!hero?.enabled || !hero?.title) {
    return null
  }

  const image = getMedia(hero.image)
  const imageUrl = image?.url
  const imageAlt = image?.alt || hero.title

  return (
    <section className="relative w-full">
      <div className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-primary/5 to-background">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8 items-center">
            <div className="flex flex-col justify-center">
              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">{hero.title}</h1>
              {hero.subtitle && (
                <p className="mt-6 text-lg leading-8 text-muted-foreground">{hero.subtitle}</p>
              )}
              {hero.primaryCTA?.label && hero.primaryCTA?.href && (
                <div className="mt-10">
                  <Button asChild size="lg">
                    <Link href={hero.primaryCTA.href}>{hero.primaryCTA.label}</Link>
                  </Button>
                </div>
              )}
            </div>

            {imageUrl && (
              <div className="relative aspect-square lg:aspect-auto lg:h-[500px]">
                <Image
                  src={imageUrl}
                  alt={imageAlt}
                  fill
                  className="object-cover rounded-2xl"
                  priority
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
