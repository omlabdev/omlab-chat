'use client'

import Image from 'next/image'

import { FormEvent, KeyboardEvent, useCallback, useEffect, useRef, useState } from 'react'

import { MessageRole, MessageType } from '@/types'

import { Chat as ChatInterface } from '@/models/chat'

import { deleteAdminChatMessage, getAdminChatMessages, getChatMessages, resetChat, sendAdminChatMessage, sendChatMessage } from '@/api'

import DotsLoader from './dotsLoader'

import Send from './icons/send'
import Close from './icons/close'
import Refresh from './icons/refresh'
import { useStoreContext } from '@/context/store'

const errorMessage: MessageType = { role: 'error', content: 'There was an error processing your message, please try again' }

const adminMessageRoles: { id: MessageRole, label: string }[] = [{ id: 'system', label: 'System' }, { id: 'assistant', label: 'Assistant' }, { id: 'sandwich', label: 'Sandwich' }]

declare type ChatPropsType = ({ chat: ChatInterface, admin?: false } | { chat?: ChatInterface, admin: true }) & ({ onMessageReceived?: (message: MessageType) => void, onMessageSent?: (message: MessageType) => void, demo?: boolean })

export default function Chat({ chat, onMessageReceived, admin, demo }: ChatPropsType) {
  const messagesWrapper = useRef<HTMLDivElement>(null)
  const { setStatus, status } = useStoreContext()
  const [messages, setMessages] = useState<MessageType[]>([])
  const [message, setMessage] = useState('')
  const [role, setRole] = useState<MessageRole>(admin ? 'system' : 'user')

  const loadMessages = useCallback(() => {
    if ((!chat) && (!admin)) return
    setStatus('typing')
    const getMessages = admin ? getAdminChatMessages(chat?.chatId) : getChatMessages(chat?.chatId)
    getMessages.then(setMessages).catch(() => setMessages([errorMessage])).finally(() => setStatus('idle'))
  }, [admin, chat, setStatus])

  // Detect if the mobile virtual keyboard has been opened and scroll to the last messge if so
  const viewportResizeHandler = useCallback(() => {
    if (!window?.visualViewport) return
    if (window.screen.height - 300 > window.visualViewport.height) messagesWrapper.current?.scrollTo({ top: messagesWrapper.current.scrollHeight })
  }, [])

  useEffect(() => {
    window?.visualViewport?.addEventListener('resize', viewportResizeHandler)
    return () => window?.visualViewport?.removeEventListener('resize', viewportResizeHandler)
  }, [viewportResizeHandler])

  useEffect(loadMessages, [loadMessages])

  useEffect(() => {
    if (!messagesWrapper.current) return
    messagesWrapper.current.scrollTop = messagesWrapper.current.scrollHeight
  }, [messages])

  function processMessage(message: string) {
    return message
      // Escape HTML
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;')
      // Replace line breaks
      .replaceAll('\n', '<br/>')
      // Add line breaks after ". "
      .replaceAll('. ', '.<br/>')
      // Markdown urls
      .replaceAll(/(\[([^\]]+)])\(([^)]+)\)/g, '<a target="_blank" rel="nofollow noopener noreferrer" href="$3">$2</a>')
      // Regular urls
      .replaceAll(/(?: |^)((https?|ftp|file)\:\/\/[a-zA-Z\d+&@#\/%?=~_\-|!:,.;]+)/g, '<a target="_blank" rel="nofollow noopener noreferrer" href="$1">$1</a>')
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') submit()
  }

  async function handleAdminMessageDelete(messageId: string) {
    setStatus('typing')
    try {
      const response = await deleteAdminChatMessage(messageId)
      if (response.success) setMessages((messages) => {
        const index = messages.findIndex((message) => message._id === messageId)
        if (index > -1) messages.splice(index, 1)
        return [...messages]
      })
    } catch (error) {
      setMessages((currentMessages) => [...currentMessages, errorMessage])
    }
    setStatus('idle')
  }

  async function submit(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault()
    if ((status !== 'idle') || (!message)) return
    const messageSent: MessageType = { role, content: message }
    if (!admin) setMessages((currentMessages) => [...currentMessages, messageSent])
    setStatus('typing')
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
    setStatus('idle')
  }

  async function reset() {
    if (!chat) return
    setStatus('typing')
    await resetChat(chat?.chatId)
    loadMessages()
  }

  return (
    <div className="chat theme">
      <div className="messages-wrapper" ref={messagesWrapper}>
        <ol className="messages">
          {messages.map((message, index) => (
            <li key={index} className={`message message--${message.role}`}>
              {(message.role === 'assistant') && (chat?.avatar) && (
                <span className="message__img-wrapper">
                  <Image className="message__img" src={chat.avatar} alt="" height={20} width={20} />
                </span>
              )}
              <div className="message__content">
                <span dangerouslySetInnerHTML={{ __html: processMessage(message.content) }}></span>
                {admin && (
                  <button className="delete-btn" type="button" onClick={() => handleAdminMessageDelete(message._id!)}>
                    <Close color="#fff" />
                  </button>
                )}
              </div>
            </li>
          ))}
        </ol>
        <DotsLoader active={status === 'typing'} />
      </div>
      <form className="form" noValidate onSubmit={submit}>
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
        <div className="input-wrapper">
          <input className={`form-input message-input ${demo ? 'message-input--demo' : ''}`} type="text" autoComplete="off" value={message} onKeyDown={handleKeyDown} onChange={(event) => setMessage(event.target.value)} />
          <div className="chat-input-btns">
            <button className="btn" type="submit" disabled={((message === '') && (status !== 'idle'))} title="Send message">
              <Send color={chat?.colors?.main} />
            </button>
            {demo && (
              <button className="btn input-refresh" type="button" title="Reset chat" onClick={reset}>
                <Refresh color={chat?.colors?.main} />
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}