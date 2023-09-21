import { NextRequest, NextResponse } from 'next/server'

import ChatService from '@/services/chat.service'

import { setSessionIdCookie } from '@/helpers'

export const dynamic = 'force-dynamic' // Don't pre-render this GET method

export async function GET(request: NextRequest, { params }: { params: { chatId: string } }) {
  const { chatId } = params
  const sessionId = request.cookies.get('sessionId')?.value
  if ((!sessionId) || (!chatId)) return NextResponse.json({}, { status: 400 })
  if (!(await ChatService.chatExists(chatId))) return NextResponse.json({}, { status: 400 })
  const messages = await ChatService.getMessages(chatId, sessionId)
  return NextResponse.json(messages)
}

export async function POST(request: NextRequest, { params }: { params: { chatId: string } }) {
  const { chatId } = params
  const { message } = await request.json()
  const sessionId = request.cookies.get('sessionId')?.value
  if ((!message) || (!sessionId) || (!chatId)) return NextResponse.json({}, { status: 400 })
  const response = await ChatService.sendMessage(chatId, sessionId, message)
  return NextResponse.json(response)
}

export async function DELETE(request: NextRequest, { params }: { params: { chatId: string } }) {
  const { chatId } = params
  const sessionId = request.cookies.get('sessionId')?.value
  if ((!sessionId) || (!chatId)) return NextResponse.json({}, { status: 400 })
  await ChatService.deleteChat(chatId, sessionId)
  const response = NextResponse.next()
  setSessionIdCookie(response, request)
  return NextResponse.json({}, { status: 200 })
}