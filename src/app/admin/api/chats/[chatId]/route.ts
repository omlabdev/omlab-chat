import { NextRequest, NextResponse } from 'next/server'

import Database from '@/services/database.service'
import ChatService from '@/services/chat.service'

import { default as Chat, Chat as ChatInterface } from '@/models/chat'

export const dynamic = 'force-dynamic' // Don't pre-render this GET method

export async function GET(_: NextRequest, { params }: { params: { chatId: string } }) {
  const { chatId } = params
  if (!chatId) return NextResponse.json({}, { status: 400 })
  await Database.connect()
  const chat = await Chat.findOne({ chatId }).lean().exec()
  if (!chat) return NextResponse.json({}, { status: 404 })
  return NextResponse.json(chat)
}

export async function POST(request: NextRequest, { params }: { params: { chatId: string } }) {
  const { chatId } = params
  const data = await request.json()
  const update = {
    name: data.name,
    siteUrl: data.siteUrl,
    avatar: data.avatar,
    fontConfig: data.fontConfig,
    colors: { main: data.accent, background: data.background },
    functions: data.functions,
    users: data.users,
  }
  await Database.connect()
  const chat = await Chat.findOneAndUpdate<ChatInterface>({ chatId }, update).lean().exec()
  if (!chat) return NextResponse.json({}, { status: 404 })
  return NextResponse.json({ success: true })
}

export async function DELETE(request: NextRequest, { params }: { params: { chatId: string } }) {
  const { chatId } = params
  const sessionId = request.nextUrl.searchParams.get('sessionId')
  if ((!sessionId) || (!chatId)) return NextResponse.json({}, { status: 400 })
  const result = await ChatService.deleteChat(chatId, sessionId)
  return NextResponse.json({ success: result.acknowledged })
}