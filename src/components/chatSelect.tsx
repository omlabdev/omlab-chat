'use client'

import { useEffect, useState } from 'react'

import { Chat } from '@/models/chat'

import Chevron from './icons/chevron'

export default function ChatSelect({ chats, value = '', allChats = true, onChange }: { chats: Chat[], value?: string, allChats?: boolean, onChange: (value: string) => void }) {
  const [selected, setSelected] = useState<Chat | undefined>()
  const [open, setOpen] = useState<boolean>(false)

  useEffect(() => {
    if (value) {
      const chat = chats.find((chat) => chat.chatId === value)
      if (chat) setSelected(chat)
    }
  }, [value, chats])
  
  function setValue(chat: Chat | undefined) {
    onChange(chat?.chatId || '')
    setSelected(chat)
    setOpen(false)
  }
  
  return (
    <div className="chat-select-wrapper">
      <div className="chat-select">
        <button className="chat-select__toggle" type="button" onClick={() => setOpen(!open)}>
          {selected?.name || (allChats ? 'All Chats' : 'Select a Chat')}
          <span className="chat-select__chevron">
            <Chevron orientation={open ? 'down' : 'right'} />
          </span>
        </button>
        {open && (
          <ul className="chat-select__list">
            {(allChats) && (
              <li className={`chat-select__item ${!selected ? 'active' : ''}`}>
                <button className="chat-select__btn" type="button" onClick={() => setValue(undefined)}>
                  All Chats
                </button>
              </li>
            )}
            {chats.map((chat, index) => (
              <li className={`chat-select__item ${chat.chatId === selected?.chatId ? 'active' : ''}`} key={index}>
                <button className="chat-select__btn" type="button" onClick={() => setValue(chat)}>
                  {chat.name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}