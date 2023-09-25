import { NextRequest, NextResponse } from 'next/server'

import Database from '@/services/database.service'
import ChatService from '@/services/chat.service'

import { default as Chat, Chat as ChatInterface } from '@/models/chat'

export async function POST(request: NextRequest, { params }: { params: { chatId: string } }) {
  const { chatId } = params
  const data = await request.json()
  const update = {
    name: data.name,
    avatar: data.avatar,
    font: data.font,
    colors: { main: data.accent, background: data.background },
    functions: data.functions,
  }
  await Database.connect()
  const chat = await Chat.findOneAndUpdate<ChatInterface>({ chatId }, update).lean().exec()
  if (!chat) return NextResponse.json({}, { status: 404 })
  return NextResponse.json({ success: true })
}

export async function DELETE(request: NextRequest, { params }: { params: { chatId: string } }) {
  const { chatId } = params
  const sessionId = request.cookies.get('sessionId')?.value
  if ((!sessionId) || (!chatId)) return NextResponse.json({}, { status: 400 })
  const result = await ChatService.deleteChat(chatId, sessionId)
  return NextResponse.json({ success: result.acknowledged })
}