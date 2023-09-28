import { MediaImage } from './types'

export function getImageUrl(image: MediaImage) {
  return `https://uploadthing.com/f/${image.key}`
}
