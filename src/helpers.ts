import { MediaImage } from './types'

const { ADMIN_EMAILS } = process.env

const adminEmails = ADMIN_EMAILS?.split(',')

export function getImageUrl(image: MediaImage) {
  return `https://uploadthing.com/f/${image.key}`
}

export function isAdmin(email: string) {
  return !!adminEmails?.includes(email)
}