import { Document, Model, model, models, Schema } from 'mongoose'

import { FontConfig } from '@/types'

// Schema
const ChatSchema = new Schema<ChatBaseDocument, ChatModel>({
  name: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  siteUrl: String,
  avatar: String,
  fontConfig: Schema.Types.Mixed,
  colors: Schema.Types.Mixed,
  chatId: {
    type: String,
    required: true,
    unique: true,
  },
  functions: Schema.Types.Array,
  users: Schema.Types.Array,
}, { timestamps: true })

export interface Chat {
  name: string
  siteUrl?: string
  avatar?: string
  fontConfig?: FontConfig
  colors?: { main?: string, background?: string }
  chatId: string
  functions?: string[]
  users?: string[]
}

interface ChatBaseDocument extends Chat, Document {}

// For model
interface ChatModel extends Model<ChatBaseDocument> {}

// Default export
export default models.Chat || model<ChatBaseDocument, ChatModel>('Chat', ChatSchema)