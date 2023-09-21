'use client'

import { useEffect, useState } from 'react'

import { Chat as ChatInterface } from '@/models/chat'

import { getChats } from '@/api'

import AdminChat from '@/components/adminChat'
import Chevron from '@/components/icons/chevron'

export default function SetupChat({ params }: { params: { chatId: string } }) {
  const { chatId } = params
  const [chats, setChats] = useState<ChatInterface[]>([])

  useEffect(() => {
    getChats().then(setChats)
  }, [])

  return (
    <main className="container page-admin">
      <h1 className="title admin__title">
        <a className="admin__back" href="/admin">
          <Chevron orientation="left" height={30} width={30} color="#fff" />
        </a>
        Om Lab GPT | Setup
      </h1>
      <AdminChat chats={chats} chatId={chatId} />
    </main>
  )
}