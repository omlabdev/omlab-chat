import OpenAI from 'openai'

export type MessageRole = OpenAI.Chat.Completions.ChatCompletionMessage['role'] | 'error' | 'sandwich'
export type MessageType = { _id?: string, role: MessageRole, content: string }