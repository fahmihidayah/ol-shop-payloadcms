'use client'

import { useEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Promotion } from '../type'
import { Media } from '@/payload-types'

function getMediaFromPromo(data?: number | null | Media): Media | null {
  if (!data || typeof data === 'number') return null
  return data as Media
}

interface PromotionsProps {
  promotions?: Promotion[] | null
}

export function Promotions({ promotions }: PromotionsProps) {
  const [current, setCurrent] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const validPromos = promotions?.filter((p) => {
    const icon = getMediaFromPromo(p.icon)
    return icon?.url
  })

  const count = validPromos?.length ?? 0

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % count)
  }, [count])

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + count) % count)
  }, [count])

  useEffect(() => {
    if (count <= 1 || isPaused) return
    const interval = setInterval(next, 4000)
    return () => clearInterval(interval)
  }, [count, isPaused, next])

  if (!validPromos || validPromos.length === 0) {
    return null
  }

  return (
    <section
      className="relative w-full overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {validPromos.map((promo, index) => {
          const icon = getMediaFromPromo(promo.icon)
          const imageUrl = icon!.url!
          const imageAlt = icon?.alt || promo.title

          const slide = (
            <div key={index} className="relative w-full flex-shrink-0 aspect-[3/1] min-h-[200px] sm:min-h-[300px] lg:min-h-[400px]">
              <Image
                src={imageUrl}
                alt={imageAlt}
                fill
                className="object-cover"
                priority={index === 0}
              />
              <div className="absolute inset-0 bg-black/30" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-6 text-center">
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold drop-shadow-lg">
                  {promo.title}
                </h3>
                {promo.description && (
                  <p className="mt-2 text-sm sm:text-base lg:text-lg max-w-2xl drop-shadow-md">
                    {promo.description}
                  </p>
                )}
              </div>
            </div>
          )

          if (promo.link) {
            return (
              <Link key={index} href={promo.link} className="w-full flex-shrink-0">
                {slide}
              </Link>
            )
          }

          return slide
        })}
      </div>

      {/* Navigation arrows */}
      {count > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors"
            aria-label="Previous slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors"
            aria-label="Next slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </>
      )}

      {/* Dots */}
      {count > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {validPromos.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                index === current ? 'bg-white' : 'bg-white/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  )
}
