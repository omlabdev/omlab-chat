'use client'

import { useEffect, useState } from 'react'

import { Chat as ChatInterface } from '@/models/chat'

import { getChats } from '@/api'

import AdminChat from '@/components/adminChat'

export default function Setup() {
  const [chats, setChats] = useState<ChatInterface[]>([])

  useEffect(updateChats, [])

  function updateChats() {
    getChats().then(setChats)
  }

  return (
    <main className="container page-admin">
      <h1 className="title admin__title">
        Om Lab GPT | Setup
      </h1>
      <AdminChat chats={chats} onChatUpdateHandler={updateChats} />
    </main>
  )
}