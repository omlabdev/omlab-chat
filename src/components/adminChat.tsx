'use client'

import { useState } from 'react'

import { Chat as ChatInterface } from '@/models/chat'

import Chat from './chat'
import ChatSelect from './chatSelect'

export default function AdminChat({ chats }: { chats: ChatInterface[] }) {
  const [chatId, setChatId] = useState<string>('')

  return (
    <>
      <ChatSelect chats={chats} onChange={(event) => setChatId(event.target.value)} />
      <Chat chatId={chatId} admin={true} />
    </>
  )
}