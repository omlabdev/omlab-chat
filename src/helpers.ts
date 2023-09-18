import { v4 as uuidv4 } from 'uuid'

import { NextResponse } from 'next/server'

import { MediaImage } from './types'

export function generateSessionId() {
  return uuidv4()
}

export function setSessionIdCookie(response: NextResponse) {
  const sessionId = generateSessionId()
  response.cookies.set({ name: 'sessionId', value: sessionId, httpOnly: true })
}

export function getImageUrl(image: MediaImage) {
  return `https://uploadthing.com/f/${image.key}`
}
