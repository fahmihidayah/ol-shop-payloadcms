import { Page, Media } from '@/payload-types'
import { RichText as RichTextConverter } from '@payloadcms/richtext-lexical/react'
import Image from 'next/image'

interface PageContentProps {
  page: Page
}

export function PageContent({ page }: PageContentProps) {
  const heroImage = page.heroImage as Media | undefined

  return (
    <article className="w-full">
      <header className="relative mb-12 h-[40vh] w-full overflow-hidden md:h-[50vh]">
        {heroImage && heroImage.url && (
          <Image
            src={heroImage.url}
            alt={heroImage.alt || page.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 896px, 896px"
          />
        )}

        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/30">
          <h1 className="text-center text-4xl font-bold tracking-tight text-white md:text-5xl">
            {page.title}
          </h1>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4">
        <div className="prose prose-gray max-w-none dark:prose-invert">
          {page.content && <RichTextConverter data={page.content} />}
        </div>
      </div>
    </article>
  )
}
