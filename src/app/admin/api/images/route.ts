import { NextRequest, NextResponse } from 'next/server'

import { utapi } from 'uploadthing/server'

export const dynamic = 'force-dynamic' // Don't pre-render this GET method

export async function GET() {
  return NextResponse.json(await utapi.listFiles())
}

export async function DELETE(request: NextRequest) {
  const { key } = await request.json()
  return NextResponse.json(await utapi.deleteFiles([key]))
}