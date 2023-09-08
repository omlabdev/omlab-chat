import { NextRequest, NextResponse } from 'next/server'

import message from '@/models/message'

import ChatService from '@/services/chat.service'
import Database from '@/services/database.service'


export async function GET(_: NextRequest) {
  await Database.connect()
  const messages = await message.find({ chatId: undefined, sessionId: undefined }).exec()
  return NextResponse.json(messages)
}

export async function POST(request: NextRequest) {
  const { message, role } = await request.json()
  if ((!message) || (!role)) return NextResponse.json({}, { status: 400 })
  const response = await ChatService.addAdminMessage(role, message)
  return NextResponse.json(response)
}

export async function DELETE(request: NextRequest) {
  const { messageId } = await request.json()
  if (!messageId) return NextResponse.json({}, { status: 400 })
  const success = await ChatService.deleteAdminMessage(messageId)
  return NextResponse.json({ success }, { status: 200 })
}