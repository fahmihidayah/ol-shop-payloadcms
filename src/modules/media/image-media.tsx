import { Media } from '@/payload-types'
import Image, { ImageProps } from 'next/image'
import { forwardRef } from 'react'

type ImageMediaProps = Omit<ImageProps, 'src' | 'alt'> & {
  media: Media
}

export const ImageMedia = forwardRef<HTMLImageElement, ImageMediaProps>((props, ref) => {
  const { media, ...rest } = props
  return <Image src={media.url ?? ''} alt={media.alt} {...rest} ref={ref} />
})

ImageMedia.displayName = 'ImageMedia'
