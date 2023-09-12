import { Chat as ChatInterface } from './models/chat'

import { MessageType } from './types'

export async function getChat(chatId: string): Promise<ChatInterface> {
  const response = await fetch(`/api/chats/${chatId}`, { cache: 'no-cache' })
  if ((response.status < 200) || (response.status >= 300)) throw response
  const chat = await response.json()
  return chat
}

export async function getChatMessages(chatId: string): Promise<MessageType[]> {
  const response = await fetch(`/api/chats/${chatId}/messages`, { cache: 'no-cache' })
  if ((response.status < 200) || (response.status >= 300)) throw response
  const messages = await response.json()
  return messages
}

export async function sendChatMessage(message: string, chatId: string): Promise<MessageType> {
  const body = JSON.stringify({ message })
  const response = await fetch(`/api/chats/${chatId}/messages`, { method: 'POST', body })
  if ((response.status < 200) || (response.status >= 300)) throw response
  const responseMessage = await response.json()
  return responseMessage
}

export async function getAdminChatMessages(chatId?: string): Promise<MessageType[]> {
  const endpoint = chatId ? `/admin/api/chats/${chatId}/messages` : `/admin/api/chats/messages`
  const response = await fetch(endpoint, { cache: 'no-cache' })
  if ((response.status < 200) || (response.status >= 300)) throw response
  const messages = await response.json()
  return messages
}

export async function sendAdminChatMessage(message: string, role: string, chatId?: string): Promise<MessageType> {
  const body = JSON.stringify({ message, role })
  const endpoint = chatId ? `/admin/api/chats/${chatId}/messages` : `/admin/api/chats/messages`
  const response = await fetch(endpoint, { method: 'POST', body })
  if ((response.status < 200) || (response.status >= 300)) throw response
  const responseMessage = await response.json()
  return responseMessage
}

export async function deleteAdminChatMessage(messageId: string): Promise<{ success: boolean }> {
  const response = await fetch(`/admin/api/chats/messages/${messageId}`, { method: 'DELETE' })
  if ((response.status < 200) || (response.status >= 300)) throw response
  const responseMessage = await response.json()
  return responseMessage
}