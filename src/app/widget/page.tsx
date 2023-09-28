'use client'

import Image from 'next/image'

import { useCallback, useEffect, useState } from 'react'

import '@/styles/widget.scss'

import { getChat, saveSessionId } from '@/api'

import { Chat as ChatInterface } from '@/models/chat'

import Chat from '@/components/chat'
import Theme from '@/components/theme'
import ChatHeader from '@/components/chatHeader'

import chatImg from '../../../public/imgs/chat.svg'

export default function Widget({ searchParams }: { searchParams: { chatId: string } }) {
  const { chatId } = searchParams
  const [chat, setChat] = useState<ChatInterface | undefined>(undefined)
  const [open, setOpen] = useState(false)
  const [showBadge, setShowBadge] = useState(true)

  const postMessage = useCallback((element: Window, key: string, value?: string) => {
    const message = { namespace: 'omlab-chat', key, value }
    element.postMessage(message, '*')
  }, [])

  useEffect(() => {
    window.addEventListener('message', (event) => {
      const { namespace, key, value } = event.data
      if (namespace !== 'omlab-chat') return
      if (key === 'open') {
        setOpen(true)
      } else if (key === 'close') {
        setOpen(false)
      } else if (key === 'sessionId') {
        // With a sessionId we can now load the chat
        saveSessionId(value)
        getChat(chatId).then(setChat)
      }
    })
    // Let the parent window script know we're ready to get a sessionId
    if (window.top) postMessage(window.top, 'ready')
  }, [chatId, postMessage])
  
  useEffect(() => {
    if (open) {
      if (showBadge) setShowBadge(false)
      if (window.top) postMessage(window.top, 'open')
    } else {
      if (window.top) postMessage(window.top, 'close')
    }
  }, [open, showBadge, postMessage])

  if (!chatId) return null

  function toggleChat() {
    setOpen(!open)
  }

  function onMessageReceivedHandler() {
    setShowBadge(true)
  }

  function closeWidget() {
    setOpen(false)
  }

  if (!chat) return null

  return (
    <div className="widget theme">
      <Theme chat={chat} />
      <div className={`widget__chat-wrapper ${open ? 'show' : ''}`} aria-hidden={!open}>
        <ChatHeader chat={chat} onCloseHandler={closeWidget} />
        <Chat chat={chat} onMessageReceived={onMessageReceivedHandler} />
      </div>
      <button className={`widget__toggle-btn ${showBadge ? 'badge' : ''}`} aria-expanded={open} onClick={toggleChat}>
        <span className="widget__badge"></span>
        <Image className="widget__toggle-btn__img" src={chatImg} alt="Open chat" />
      </button>
    </div>
  )
}