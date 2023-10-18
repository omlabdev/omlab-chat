'use client'

import { useRouter } from 'next/navigation'

import { useEffect, useState } from 'react'

import { StoreProvider } from '@/context/store'

import { Chat as ChatInterface } from '@/models/chat'

import Chat from './chat'
import ChatSelect from './chatSelect'
import Theme from './theme'
import Config from './config'
import SpinnerLoader from './spinnerLoader'

export default function AdminChat({ chats, chatId, onChatUpdateHandler }: { chats: ChatInterface[], chatId?: string, onChatUpdateHandler?: () => void }) {
  const [tab, setTab] = useState<'prompts' | 'config' | 'chat'>('chat')
  const [chat, setChat] = useState<ChatInterface | undefined>(undefined)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  function selectChat(chatId?: string) {
    setLoading(true)
    router.push(`/admin/${chatId}`)
  }

  useEffect(() => {
    const chat = chatId ? chats.find((chat) => chat.chatId === chatId) : undefined
    setChat(chat)
    if (!chat) setTab('prompts')
  }, [chats, chatId])

  return (
    <div className="admin">
      <SpinnerLoader active={loading} />
      <Theme chat={chat} />
      <ChatSelect chats={chats} value={chat?.chatId} onChange={selectChat} />
      {(chat) && (
        <div className="radio-group radio-group--admin">
          <div className="radio-wrapper">
            <input className="radio-input" id="radio-prompts" type="radio" checked={tab === 'prompts'} onChange={() => setTab('prompts')} />
            <label className="radio-label theme" htmlFor="radio-prompts">
              Prompts
            </label>
          </div>
          <div className="radio-wrapper">
            <input className="radio-input" id="radio-config" type="radio" checked={tab === 'config'} onChange={() => setTab('config')} />
            <label className="radio-label theme" htmlFor="radio-config">
              Config
            </label>
          </div>
          <div className="radio-wrapper">
            <input className="radio-input" id="radio-chat" type="radio" checked={tab === 'chat'} onChange={() => setTab('chat')} />
            <label className="radio-label theme" htmlFor="radio-chat">
              Chat
            </label>
          </div>
        </div>
      )}
      {(tab === 'config') && (<Config chat={chat} onUpdateHandler={onChatUpdateHandler} />)}
      <StoreProvider>
        {(tab === 'prompts') && (<Chat chat={chat} admin={true} />)}
        {(tab === 'chat') && (chat) && (<Chat chat={chat} demo={true} />)}
      </StoreProvider>
    </div>
  )
}