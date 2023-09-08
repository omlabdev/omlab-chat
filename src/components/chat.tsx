'use client'

import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from 'react'

import { MessageRole, MessageType } from '@/types'

import { deleteAdminChatMessage, getAdminChatMessages, getChatMessages, sendAdminChatMessage, sendChatMessage } from '@/api'

import Loader from './loader'

const errorMessage: MessageType = { role: 'error', content: 'There was an error processing your message, please try again' }

const adminMessageRoles: { id: MessageRole, label: string }[] = [{ id: 'system', label: 'System' }, { id: 'assistant', label: 'Assistant' }, { id: 'sandwich', label: 'Sandwich' }]

declare type ChatPropsType = ({ chatId: string, admin?: false } | { chatId?: string, admin: true }) & ({ onMessageReceived?: (message: MessageType) => void, onMessageSent?: (message: MessageType) => void })

export default function Chat({ chatId, onMessageReceived, admin }: ChatPropsType) {
  const messagesWrapper = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<MessageType[]>([])
  const [message, setMessage] = useState('')
  const [role, setRole] = useState<MessageRole>(admin ? 'system' : 'user')

  useEffect(() => {
    if (!chatId) return
    setLoading(true)
    const getMessages = admin ? getAdminChatMessages : getChatMessages
    getMessages(chatId).then(setMessages).catch(() => setMessages([errorMessage])).finally(() => setLoading(false))
  }, [admin, chatId])

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
      newMessage = admin ? await sendAdminChatMessage(message, role, chatId) : await sendChatMessage(message, chatId)
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
              {message.content}
              {admin && (<button className="delete-btn" type="button" onClick={() => handleAdminMessageDelete(message._id!)}>X</button>)}
            </li>
          ))}
        </ol>
        <Loader active={loading} />
      </div>
      <form noValidate onSubmit={submit}>
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
        <div className="form">
          <input className="input" type="text" autoComplete="off" value={message} onKeyDown={handleKeyDown} onChange={(event) => setMessage(event.target.value)} />
          <button className="btn" type="submit">
            Send
          </button>
        </div>
      </form>
    </>
  )
}