'use client'

import Image from 'next/image'

import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from 'react'

import { MessageRole, MessageType } from '@/types'

import { Chat as ChatInterface } from '@/models/chat'

import { deleteAdminChatMessage, getAdminChatMessages, getChatMessages, sendAdminChatMessage, sendChatMessage } from '@/api'

import Loader from './loader'

import Send from './icons/send'
import Close from './icons/close'

const errorMessage: MessageType = { role: 'error', content: 'There was an error processing your message, please try again' }

const adminMessageRoles: { id: MessageRole, label: string }[] = [{ id: 'system', label: 'System' }, { id: 'assistant', label: 'Assistant' }, { id: 'sandwich', label: 'Sandwich' }]

declare type ChatPropsType = ({ chat: ChatInterface, admin?: false } | { chat?: ChatInterface, admin: true }) & ({ onMessageReceived?: (message: MessageType) => void, onMessageSent?: (message: MessageType) => void })

export default function Chat({ chat, onMessageReceived, admin }: ChatPropsType) {
  const messagesWrapper = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<MessageType[]>([])
  const [message, setMessage] = useState('')
  const [role, setRole] = useState<MessageRole>(admin ? 'system' : 'user')

  useEffect(() => {
    if ((!chat) && (!admin)) return
    setLoading(true)
    const getMessages = admin ? getAdminChatMessages(chat?.chatId) : getChatMessages(chat?.chatId)
    getMessages.then(setMessages).catch(() => setMessages([errorMessage])).finally(() => setLoading(false))
  }, [admin, chat])

  useEffect(() => {
    if (!messagesWrapper.current) return
    messagesWrapper.current.scrollTop = messagesWrapper.current.scrollHeight
  }, [messages])

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') submit()
  }

  async function handleAdminMessageDelete(messageId: string) {
    setLoading(true)
    try {
      const response = await deleteAdminChatMessage(messageId)
      if (response.success) setMessages((messages) => {
        const index = messages.findIndex((message) => message._id === messageId)
        messages.splice(index, 1)
        return [...messages]
      })
    } catch (error) {
      setMessages((currentMessages) => [...currentMessages, errorMessage])
    }
    setLoading(false)
  }

  async function submit(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault()
    if (!message) return
    const messageSent: MessageType = { role, content: message }
    if (!admin) setMessages((currentMessages) => [...currentMessages, messageSent])
    setLoading(true)
    setMessage('')
    onMessageReceived?.(messageSent)
    let newMessage = errorMessage
    try {
      newMessage = admin ? await sendAdminChatMessage(message, role, chat?.chatId) : await sendChatMessage(message, chat.chatId)
    } catch (error) {
      console.error(error)
    }
    setMessages((currentMessages) => [...currentMessages, newMessage])
    onMessageReceived?.(newMessage)
    setLoading(false)
  }

  return (
    <>
      <div className="messages-wrapper" ref={messagesWrapper}>
        <ol className="messages">
          {messages.map((message, index) => (
            <li key={index} className={`message message--${message.role}`}>
              {(!admin) && (message.role === 'assistant') && (chat?.avatar) && (
                <span className="message__img-wrapper">
                  <Image className="message__img" src={chat.avatar} alt="" height={20} width={20} />
                </span>
              )}
              <div className="message__content">
                {message.content}
                {admin && (
                  <button className="delete-btn" type="button" onClick={() => handleAdminMessageDelete(message._id!)}>
                    <Close color="#fff" />
                  </button>
                )}
              </div>
            </li>
          ))}
        </ol>
        <Loader active={loading} />
      </div>
      {admin && (
        <div className="radio-group">
          {adminMessageRoles.map((messageRole, index) => (
            <div className="radio-wrapper" key={index}>
              <input className="radio-input" id={`radio-${messageRole.id}`} type="radio" checked={role === messageRole.id} onChange={() => setRole(messageRole.id)} />
              <label className="radio-label" htmlFor={`radio-${messageRole.id}`}>
                {messageRole.label}
              </label>
            </div>
          ))}
        </div>
      )}
      <form className="form" noValidate onSubmit={submit}>
        <input className="input" type="text" autoComplete="off" value={message} onKeyDown={handleKeyDown} onChange={(event) => setMessage(event.target.value)} />
        <button className="btn" type="submit" disabled={message === ''}>
          <Send color={chat?.colors?.main} />
        </button>
      </form>
    </>
  )
}