import { NextResponse } from 'next/server'

import { v4 as uuidv4 } from 'uuid'

export const dynamic = 'force-dynamic' // Don't pre-render this GET method

export function GET() {
  const sessionId = uuidv4()
  return NextResponse.json({ sessionId })
}