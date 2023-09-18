import OpenAI from 'openai'

export type MessageRole = OpenAI.Chat.Completions.ChatCompletionMessage['role'] | 'error' | 'sandwich'
export type MessageType = { _id?: string, role: MessageRole, content: string }

export type ChatUpdateValues = { name: string, font?: string, background?: string, accent?: string, avatar?: string }

export type MediaImage = { key: string, id: string }