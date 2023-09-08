'use client'

import { useState } from 'react'

import { Chat as ChatInterface } from '@/models/chat'

import Chat from './chat'

export default function AdminChat({ chats }: { chats: ChatInterface[] }) {
  const [chatId, setChatId] = useState<string | undefined>(undefined)

  return (
    <>
      <select className="chats-select" autoComplete="off" value={chatId ?? ''} onChange={(event) => setChatId(event.target.value)}>
        <option value="">Select a client</option>
        {chats.map((client, index) => (<option key={index} value={client.chatId}>{client.name}</option>))}
      </select>
      <Chat chatId={chatId} admin={true} />
    </>
  )
}