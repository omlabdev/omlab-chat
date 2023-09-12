'use client'

import { useState } from 'react'

import { Chat as ChatInterface } from '@/models/chat'

import Chat from './chat'
import ChatSelect from './chatSelect'

export default function AdminChat({ chats }: { chats: ChatInterface[] }) {
  const [chat, setChat] = useState<ChatInterface | undefined>(undefined)

  function selectChat(chatId: string) {
    setChat(chats.find((chat) => chat.chatId === chatId))
  }

  return (
    <>
      <ChatSelect chats={chats} value={chat?.chatId} onChange={(event) => selectChat(event.target.value)} />
      <Chat chat={chat} admin={true} />
    </>
  )
}