import { Chat as ChatInterface } from './models/chat'

import { ChatUpdateValues, MediaImage, MessageType } from './types'

async function getSessionId() {
  let sessionId = localStorage.getItem('sessionId')
  if (!sessionId) {
    const response = (await fetch('/api/session', { cache: 'no-cache' }))
    sessionId = (await response.json()).sessionId as string
    saveSessionId(sessionId)
  }
  return sessionId
}

async function apiRequest(url: string, options?: { method?: string, headers?: HeadersInit | undefined, body?: BodyInit | null | undefined }) {
  let init: RequestInit = { cache: 'no-cache', credentials: 'include' }
  const sessionId = await getSessionId()
  if (options) {
    const { method, headers, body } = options
    init = { ...init, method, headers, body }
  }
  const input = new URL(url, window.location.origin)
  input.searchParams.set('sessionId', sessionId)
  const response = await fetch(input, init)
  if ((response.status < 200) || (response.status >= 300)) throw response
  return await response.json()
}

export function saveSessionId(sessionId: string) {
  localStorage.setItem('sessionId', sessionId)
}

export async function getChat(chatId: string): Promise<ChatInterface> {
  const chat = await apiRequest(`/api/chats/${chatId}`)
  return chat
}

export async function getChatMessages(chatId: string): Promise<MessageType[]> {
  const messages = await apiRequest(`/api/chats/${chatId}/messages`)
  return messages
}

export async function sendChatMessage(message: string, chatId: string): Promise<MessageType> {
  const body = JSON.stringify({ message })
  const responseMessage = await apiRequest(`/api/chats/${chatId}/messages`, { method: 'POST', body })
  return responseMessage
}

// Admin requests

export async function getChats(): Promise<ChatInterface[]> {
  const chats = await apiRequest('/admin/api/chats')
  return chats
}

export async function updateChat(chatId: string, data: ChatUpdateValues): Promise<{ success: boolean }> {
  const body = JSON.stringify(data)
  const response = await apiRequest(`/admin/api/chats/${chatId}`, { method: 'POST', body })
  return response
}

export async function resetChat(chatId: string): Promise<{ success: boolean }> {
  const response = await apiRequest(`/admin/api/chats/${chatId}`, { method: 'DELETE' })
  return response
}

export async function getAdminChatMessages(chatId?: string): Promise<MessageType[]> {
  const endpoint = chatId ? `/admin/api/chats/${chatId}/messages` : `/admin/api/chats/messages`
  const messages = await apiRequest(endpoint)
  return messages
}

export async function sendAdminChatMessage(message: string, role: string, chatId?: string): Promise<MessageType> {
  const body = JSON.stringify({ message, role })
  const endpoint = chatId ? `/admin/api/chats/${chatId}/messages` : '/admin/api/chats/messages'
  const response = await apiRequest(endpoint, { method: 'POST', body })
  return response
}

export async function deleteAdminChatMessage(messageId: string): Promise<{ success: boolean }> {
  const response = await apiRequest(`/admin/api/chats/messages/${messageId}`, { method: 'DELETE' })
  return response
}

export async function getImages(): Promise<MediaImage[]> {
  const response = await apiRequest('/admin/api/images')
  return response
}

export async function deleteImage(key: string): Promise<{ success: boolean }> {
  const headers = { 'Content-Type': 'application/json' }
  const body = JSON.stringify({ key })
  const response = await apiRequest('/admin/api/images', { method: 'DELETE', headers, body })
  return response
}