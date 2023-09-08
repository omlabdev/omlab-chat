import { MessageType } from './types'

export async function getChatMessages(chatId: string): Promise<MessageType[]> {
  const response = await fetch(`/api/chats/${chatId}`, { cache: 'no-cache' })
  if ((response.status < 200) || (response.status >= 300)) throw response
  const messages = await response.json()
  return messages
}

export async function sendChatMessage(message: string, chatId: string): Promise<MessageType> {
  const body = JSON.stringify({ message })
  const response = await fetch(`/api/chats/${chatId}`, { method: 'POST', body })
  if ((response.status < 200) || (response.status >= 300)) throw response
  const responseMessage = await response.json()
  return responseMessage
}

export async function getAdminChatMessages(chatId?: string): Promise<MessageType[]> {
  const response = await fetch(`/admin/api/chats/${chatId}`, { cache: 'no-cache' })
  if ((response.status < 200) || (response.status >= 300)) throw response
  const messages = await response.json()
  return messages
}

export async function sendAdminChatMessage(message: string, role: string, chatId?: string): Promise<MessageType> {
  const body = JSON.stringify({ message, role })
  const response = await fetch(`/admin/api/chats/${chatId}`, { method: 'POST', body })
  if ((response.status < 200) || (response.status >= 300)) throw response
  const responseMessage = await response.json()
  return responseMessage
}

export async function deleteAdminChatMessage(messageId: string): Promise<{ success: boolean }> {
  const body = JSON.stringify({ messageId })
  const response = await fetch(`/admin/api/chats`, { method: 'DELETE', body })
  if ((response.status < 200) || (response.status >= 300)) throw response
  const responseMessage = await response.json()
  return responseMessage
}