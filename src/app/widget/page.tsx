'use client'

import Image from 'next/image'

import { useEffect, useState } from 'react'

import '@/styles/widget.scss'

import Chat from '@/components/chat'

import chatImg from '../../../public/imgs/chat.svg'

export default function Widget({ searchParams }: { searchParams: { chatId: string } }) {
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
  }, [])
  
  useEffect(() => {
    if (open) {
      if (showBadge) setShowBadge(false)
      window.top?.postMessage('omlab-chat/open', '*')
    } else {
      window.top?.postMessage('omlab-chat/close', '*')
    }
  }, [open, showBadge])

  const { chatId } = searchParams
  if (!chatId) return null

  function toggleChat() {
    setOpen(!open)
  }

  function onMessageReceivedHandler() {
    setShowBadge(true)
  }

  return (
    <div className="widget">
      <div className={`widget__chat-wrapper ${open ? 'show' : ''}`} aria-hidden={!open}>
        <Chat chatId={chatId} onMessageReceived={onMessageReceivedHandler} />
      </div>
      <button className={`widget__toggle-btn ${showBadge ? 'badge' : ''}`} aria-expanded={open} onClick={toggleChat}>
        <span className="widget__badge"></span>
        <Image className="widget__toggle-btn__img" src={chatImg} alt="Open chat" />
      </button>
    </div>
  )
}