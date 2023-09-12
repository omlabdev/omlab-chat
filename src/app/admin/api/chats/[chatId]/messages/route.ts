import { NextRequest, NextResponse } from 'next/server'

import message from '@/models/message'

import ChatService from '@/services/chat.service'

export const dynamic = 'force-dynamic' // Don't pre-render this GET method

// Get all system messages for a given chat
export async function GET(_: NextRequest, { params }: { params: { chatId: string } }) {
  const { chatId } = params
  const messages = await message.find({ chatId, sessionId: undefined }).exec()
  return NextResponse.json(messages)
}

// Create a system message for a given chat
export async function POST(request: NextRequest, { params }: { params: { chatId: string } }) {
  const { chatId } = params
  const { message, role } = await request.json()
  if ((!message) || (!role)) return NextResponse.json({}, { status: 400 })
  const response = await ChatService.addAdminMessage(role, message, chatId)
  return NextResponse.json(response)
}