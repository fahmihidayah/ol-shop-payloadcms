'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ImageMedia } from '@/modules/media/image-media'
import { Media } from '@/payload-types'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type Banner = {
  image: Media | string
  title?: string
  description?: string
  link?: string
  buttonText?: string
  active?: boolean
  id?: string
}

type BannerSliderProps = {
  banners?: Banner[]
}

export function BannerSlider({ banners }: BannerSliderProps) {
  const activeBanners = banners?.filter((banner) => banner.active !== false) || []

  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (activeBanners.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeBanners.length)
    }, 5000) // Auto-slide every 5 seconds

    return () => clearInterval(interval)
  }, [activeBanners.length])

  if (!activeBanners.length) return null

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + activeBanners.length) % activeBanners.length)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activeBanners.length)
  }

  return (
    <section className="relative w-full bg-muted">
      <div className="relative h-[400px] sm:h-[500px] lg:h-[600px] overflow-hidden">
        {activeBanners.map((banner, index) => (
          <div
            key={banner.id || index}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <ImageMedia
              media={banner.image as Media}
              className="w-full h-full object-cover"
              width={1920}
              height={600}
            />

            {(banner.title || banner.description || banner.buttonText) && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-end pb-12 sm:pb-16 lg:pb-20">
                  <div className="max-w-2xl text-white">
                    {banner.title && (
                      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">
                        {banner.title}
                      </h2>
                    )}
                    {banner.description && (
                      <p className="text-base sm:text-lg lg:text-xl mb-6 text-white/90">
                        {banner.description}
                      </p>
                    )}
                    {banner.buttonText && banner.link && (
                      <Button asChild size="lg">
                        <Link href={banner.link}>{banner.buttonText}</Link>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Navigation Arrows */}
        {activeBanners.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-2 rounded-full transition-colors"
              aria-label="Previous banner"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-2 rounded-full transition-colors"
              aria-label="Next banner"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}

        {/* Dots Indicator */}
        {activeBanners.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {activeBanners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex ? 'bg-white w-8' : 'bg-white/50'
                }`}
                aria-label={`Go to banner ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
