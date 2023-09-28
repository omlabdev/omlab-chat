import { NextRequest, NextResponse } from 'next/server'

import ChatService from '@/services/chat.service'

export const dynamic = 'force-dynamic' // Don't pre-render this GET method

export async function GET(request: NextRequest, { params }: { params: { chatId: string } }) {
  const { chatId } = params
  const sessionId = request.nextUrl.searchParams.get('sessionId')
  if ((!sessionId) || (!chatId)) return NextResponse.json({}, { status: 400 })
  if (!(await ChatService.chatExists(chatId))) return NextResponse.json({}, { status: 400 })
  const messages = await ChatService.getMessages(chatId, sessionId)
  return NextResponse.json(messages)
}

export async function POST(request: NextRequest, { params }: { params: { chatId: string } }) {
  const { chatId } = params
  const { message } = await request.json()
  const sessionId = request.nextUrl.searchParams.get('sessionId')
  if ((!message) || (!sessionId) || (!chatId)) return NextResponse.json({}, { status: 400 })
  const response = await ChatService.sendMessage(chatId, sessionId, message)
  return NextResponse.json(response)
}