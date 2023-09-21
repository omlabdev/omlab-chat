'use client'

import { useEffect, useState } from 'react'

import { Chat as ChatInterface } from '@/models/chat'

import Chat from './chat'
import ChatSelect from './chatSelect'
import Theme from './theme'
import Config from './config'

export default function AdminChat({ chats, chatId }: { chats: ChatInterface[], chatId?: string }) {
  const [tab, setTab] = useState<'chat' | 'config'>('chat')
  const [chat, setChat] = useState<ChatInterface | undefined>(undefined)

  function selectChat(chatId?: string) {
    history.pushState(null, '', `/admin/setup/${chatId}`)
    window.location = window.location
  }

  useEffect(() => {
    const chat = chatId ? chats.find((chat) => chat.chatId === chatId) : undefined
    setChat(chat)
    if (!chat) setTab('chat')
  }, [chats, chatId])

  return (
    <div className="admin">
      <Theme chat={chat} />
      <ChatSelect chats={chats} value={chat?.chatId} onChange={selectChat} />
      {(chat) && (
        <div className="radio-group radio-group--admin">
          <div className="radio-wrapper">
            <input className="radio-input" id="radio-chat" type="radio" checked={tab === 'chat'} onChange={() => setTab('chat')} />
            <label className="radio-label theme" htmlFor="radio-chat">
              Chat
            </label>
          </div>
          <div className="radio-wrapper">
            <input className="radio-input" id="radio-config" type="radio" checked={tab === 'config'} onChange={() => setTab('config')} />
            <label className="radio-label theme" htmlFor="radio-config">
              Configuration
            </label>
          </div>
        </div>
      )}
      {(tab === 'chat') && (<Chat chat={chat} admin={true} />)}
      {(tab === 'config') && (<Config chat={chat} />)}
    </div>
  )
}