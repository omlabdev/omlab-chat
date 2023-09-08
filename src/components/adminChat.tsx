'use client'

import { useState } from 'react'

import { Chat as ChatInterface } from '@/models/chat'

import Chat from './chat'

export default function AdminChat({ chats }: { chats: ChatInterface[] }) {
  const [chatId, setChatId] = useState<string>('')

  return (
    <>
      <select className="chats-select" autoComplete="off" value={chatId} onChange={(event) => setChatId(event.target.value)}>
        <option value="">All chats</option>
        {chats.map((chat, index) => (<option key={index} value={chat.chatId}>{chat.name}</option>))}
      </select>
      <Chat chatId={chatId} admin={true} />
    </>
  )
}