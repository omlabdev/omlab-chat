import { NextResponse } from 'next/server'

import Database from '@/services/database.service'

import Chat, { Chat as ChatInterface } from '@/models/chat'

export const dynamic = 'force-dynamic' // Don't pre-render this GET method

export async function GET() {
  await Database.connect()
  const chats: ChatInterface[] = await Chat.find().select('-_id').lean<ChatInterface[]>().exec()
  return NextResponse.json(chats)
}