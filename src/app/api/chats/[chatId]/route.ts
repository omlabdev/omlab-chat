import { NextRequest, NextResponse } from 'next/server'

import Chat, { Chat as ChatInterface } from '@/models/chat'

import Database from '@/services/database.service'

export const dynamic = 'force-dynamic' // Don't pre-render this GET method

export async function GET(_: NextRequest, { params }: { params: { chatId: string } }) {
  const { chatId } = params
  if (!chatId) return NextResponse.json({}, { status: 400 })
  await Database.connect()
  const chat = await Chat.findOne({ chatId }).select(['name', 'avatar', 'fontConfig', 'colors', 'chatId', 'functions']).lean<ChatInterface>().exec()
  if (!chat) return NextResponse.json({}, { status: 404 })
  return NextResponse.json(chat)
}