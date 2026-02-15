import { Page } from '@/payload-types'
import { RichText as RichTextConverter } from '@payloadcms/richtext-lexical/react'

interface PageContentProps {
  page: Page
}

export function PageContent({ page }: PageContentProps) {
  return (
    <article className="mx-auto max-w-4xl px-4 py-12">
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">{page.title}</h1>
      </header>

      <div className="prose prose-gray max-w-none dark:prose-invert">
        {page.content && <RichTextConverter data={page.content} />}
      </div>
    </article>
  )
}
