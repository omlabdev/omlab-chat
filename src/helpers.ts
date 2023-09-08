import { v4 as uuidv4 } from 'uuid'

import { NextResponse } from 'next/server'

export function generateSessionId() {
  return uuidv4()
}

export function setSessionIdCookie(response: NextResponse) {
  const sessionId = generateSessionId()
  response.cookies.set({ name: 'sessionId', value: sessionId, httpOnly: true })
}