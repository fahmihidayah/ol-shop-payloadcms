import { ImageMedia } from '@/modules/media/image-media'
import { Media } from '@/payload-types'
import { RichText } from '@payloadcms/richtext-lexical/react'

type ContentBlock = {
  type: 'text-image' | 'image-grid' | 'testimonials' | 'newsletter'
  title?: string
  content?: any
  image?: Media | string
  layout?: 'left' | 'right' | 'full'
  id?: string
}

type ContentBlocksProps = {
  blocks?: ContentBlock[]
}

function TextImageBlock({ block }: { block: ContentBlock }) {
  return (
    <div
      className={`flex flex-col ${
        block.layout === 'right' ? 'lg:flex-row-reverse' : 'lg:flex-row'
      } gap-8 lg:gap-12 items-center`}
    >
      {block.image && (
        <div className="w-full lg:w-1/2">
          <ImageMedia
            media={block.image as Media}
            className="w-full h-auto rounded-lg"
            width={600}
            height={400}
          />
        </div>
      )}
      <div className="w-full lg:w-1/2">
        {block.title && <h2 className="text-2xl sm:text-3xl font-bold mb-4">{block.title}</h2>}
        {block.content && (
          <div className="prose prose-sm sm:prose-base max-w-none">
            <RichText data={block.content} />
          </div>
        )}
      </div>
    </div>
  )
}

function NewsletterBlock({ block }: { block: ContentBlock}) {
  return (
    <div className="bg-primary text-primary-foreground rounded-lg p-8 sm:p-12 text-center">
      {block.title && <h2 className="text-2xl sm:text-3xl font-bold mb-4">{block.title}</h2>}
      {block.content && (
        <div className="prose prose-sm sm:prose-base max-w-2xl mx-auto mb-6 text-primary-foreground">
          <RichText data={block.content} />
        </div>
      )}
      <form className="max-w-md mx-auto flex gap-2">
        <input
          type="email"
          placeholder="Enter your email"
          className="flex-1 px-4 py-2 rounded-md text-foreground"
        />
        <button
          type="submit"
          className="px-6 py-2 bg-background text-foreground rounded-md font-medium hover:opacity-90 transition-opacity"
        >
          Subscribe
        </button>
      </form>
    </div>
  )
}

export function ContentBlocks({ blocks }: ContentBlocksProps) {
  if (!blocks || blocks.length === 0) return null

  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-20">
        {blocks.map((block, index) => {
          if (block.type === 'text-image') {
            return <TextImageBlock key={block.id || index} block={block} />
          }

          if (block.type === 'newsletter') {
            return <NewsletterBlock key={block.id || index} block={block} />
          }

          // Placeholder for other block types
          return null
        })}
      </div>
    </section>
  )
}
