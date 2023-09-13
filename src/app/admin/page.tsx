'use client'

import { useEffect, useState } from 'react'

import { Chat as ChatInterface } from '@/models/chat'

import { getChats } from '@/api'

import AdminChat from '@/components/adminChat'

export default function Admin() {
  const [chats, setChats] = useState<ChatInterface[]>([])
  const title = 'Admin'

  useEffect(() => {
    getChats().then(setChats)
  }, [])

  return (
    <main className="container page-admin">
      <h1 className="title">
        Om Lab GPT | {title}
      </h1>
      <AdminChat chats={chats} />
    </main>
  )
}