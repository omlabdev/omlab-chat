import { NextRequest, NextResponse } from 'next/server'

import ChatService from '@/services/chat.service'

export const dynamic = 'force-dynamic' // Don't pre-render this GET method

// Delete a given system message
export async function DELETE(_: NextRequest, { params }: { params: { messageId: string } }) {
  const { messageId } = params
  if (!messageId) return NextResponse.json({}, { status: 400 })
  const success = await ChatService.deleteAdminMessage(messageId)
  return NextResponse.json({ success }, { status: 200 })
}