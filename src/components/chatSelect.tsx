import { ChangeEventHandler } from 'react'

import { Chat } from '@/models/chat'

export default function ChatSelect({ chats, value = '', onChange }: { chats: Chat[], value?: string, onChange: ChangeEventHandler<HTMLSelectElement> }) {
  return (
    <select className="chats-select" autoComplete="off" value={value} onChange={onChange}>
      <option value="">All chats</option>
      {chats.map((chat, index) => (<option key={index} value={chat.chatId}>{chat.name}</option>))}
    </select>
  )
}