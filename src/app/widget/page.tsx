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
    if ((open) && (showBadge)) setShowBadge(false)
  }, [open, showBadge])

  const { chatId } = searchParams
  if (!chatId) return null

  function toggleChat() {
    setOpen((open) => {
      if (!open) setShowBadge(false)
      return !open
    })
  }

  function onMessageReceivedHandler() {
    setShowBadge(true)
  }

  return (
    <div className="widget">
      <div className={`widget__chat-wrapper ${open ? 'show' : ''}`} aria-hidden="true">
        <button type="button" className="widget__close-btn">
          X
        </button>
        <Chat chatId={chatId} onMessageReceived={onMessageReceivedHandler} />
      </div>
      <button className={`widget__toggle-btn ${showBadge ? 'badge' : ''}`} aria-expanded="false" onClick={toggleChat}>
        <span className="widget__badge"></span>
        <Image className="widget__toggle-btn__img" src={chatImg} alt="Open chat" />
      </button>
    </div>
  )
}