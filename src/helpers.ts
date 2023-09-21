import { v4 as uuidv4 } from 'uuid'

import { NextRequest, NextResponse } from 'next/server'

import { MediaImage } from './types'

const { SESSION_TTL } = process.env

declare type SameSite = boolean | 'strict' | 'lax' | 'none' | undefined

export function generateSessionId() {
  return uuidv4()
}

export function setSessionIdCookie(response: NextResponse, request: NextRequest) {
  const sessionId = generateSessionId()
  const maxAge = Number(SESSION_TTL) || 86400000 // [SESSION_TTL] || 24hs
  const url = new URL(request.url)
  const domain = url.hostname
  const secure = url.protocol === 'https:'
  let sameSite: SameSite = 'lax'
  if (secure) sameSite = 'none'
  response.cookies.set({ name: 'sessionId', value: sessionId, httpOnly: true, sameSite, secure, domain, maxAge })
}

export function getImageUrl(image: MediaImage) {
  return `https://uploadthing.com/f/${image.key}`
}
