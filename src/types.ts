import OpenAI from 'openai'

export type MessageRole = OpenAI.Chat.Completions.ChatCompletionMessage['role'] | 'error' | 'sandwich'
export type MessageType = { _id?: string, role: MessageRole, content: string }

export type FontConfig = { family?: string, size?: number, spacing?: number, height?: number, color?: string }

export type ChatUpdateValues = { name: string, siteUrl?: string, fontConfig?: FontConfig, background?: string, accent?: string, avatar?: string, functions?: string[], users: string[] }

export type MediaImage = { key: string, id: string }

export type Function = OpenAI.Chat.Completions.ChatCompletionCreateParams.Function

export type WidgetStyle = 'floating' | 'inline'

export type ChatStatus = 'idle' | 'typing'