'use client'

import Image from 'next/image'

import { useEffect, useState } from 'react'

import '@/styles/widget.scss'

import { getChat } from '@/api'

import { Chat as ChatInterface } from '@/models/chat'

import Chat from '@/components/chat'

import chatImg from '../../../public/imgs/chat.svg'
import Close from '@/components/icons/close'
import Theme from '@/components/theme'

export default function Widget({ searchParams }: { searchParams: { chatId: string } }) {
  const { chatId } = searchParams
  const [chat, setChat] = useState<ChatInterface | undefined>(undefined)
  const [open, setOpen] = useState(false)
  const [showBadge, setShowBadge] = useState(true)

  useEffect(() => {
    window.addEventListener('message', (message) => {
      const { data } = message
      if (data === 'omlab-chat/open') {
        setOpen(true)
      } else if (data === 'omlab-chat/close') {
        setOpen(false)
      }
    })
    getChat(chatId).then(setChat)
  }, [chatId])
  
  useEffect(() => {
    if (open) {
      if (showBadge) setShowBadge(false)
      window.top?.postMessage('omlab-chat/open', '*')
    } else {
      window.top?.postMessage('omlab-chat/close', '*')
    }
  }, [open, showBadge])

  if (!chatId) return null

  function toggleChat() {
    setOpen(!open)
  }

  function onMessageReceivedHandler() {
    setShowBadge(true)
  }

  if (!chat) return null

  return (
    <div className="widget theme">
      <Theme chat={chat} />
      <div className={`widget__chat-wrapper ${open ? 'show' : ''}`} aria-hidden={!open}>
        <Chat chat={chat} onMessageReceived={onMessageReceivedHandler} />
      </div>
      <button className={`widget__toggle-btn ${showBadge ? 'badge' : ''}`} aria-expanded={open} onClick={toggleChat}>
        <span className="widget__badge"></span>
        <Image className="widget__toggle-btn__img" src={chatImg} alt="Open chat" />
        <span className="widget__toggle-btn__close">
          <Close color={chat.colors?.main} />
        </span>
      </button>
    </div>
  )
}