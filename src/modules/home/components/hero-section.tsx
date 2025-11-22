import Link from 'next/link'
import { ImageMedia } from '@/modules/media/image-media'
import { Media } from '@/payload-types'
import { Button } from '@/components/ui/button'

type HeroSectionProps = {
  hero?: {
    enabled?: boolean
    title?: string
    subtitle?: string
    backgroundImage?: Media | string
    ctaButtons?: Array<{
      text: string
      link: string
      style?: 'primary' | 'secondary' | 'outline'
      id?: string
    }>
  }
}

export function HeroSection({ hero }: HeroSectionProps) {
  if (!hero?.enabled || !hero.title) return null

  return (
    <section className="relative w-full overflow-hidden">
      {/* Background Image */}
      {hero.backgroundImage && (
        <div className="absolute inset-0 z-0">
          <ImageMedia
            media={hero.backgroundImage as Media}
            className="w-full h-full object-cover"
            width={1920}
            height={800}
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
            {hero.title}
          </h1>

          {hero.subtitle && (
            <p className="text-lg sm:text-xl lg:text-2xl mb-8 sm:mb-10 text-white/90">
              {hero.subtitle}
            </p>
          )}

          {hero.ctaButtons && hero.ctaButtons.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {hero.ctaButtons.map((button, index) => (
                <Button
                  key={button.id || index}
                  asChild
                  size="lg"
                  variant={
                    button.style === 'secondary'
                      ? 'secondary'
                      : button.style === 'outline'
                        ? 'outline'
                        : 'default'
                  }
                  className="text-base sm:text-lg px-6 sm:px-8"
                >
                  <Link href={button.link}>{button.text}</Link>
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
