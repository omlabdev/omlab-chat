import { Document, Model, model, models, Schema, Types } from 'mongoose'

import { OpenAI } from 'openai'

// Schema
const MessageSchema = new Schema<MessageBaseDocument, MessageModel>({
  content: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
  chatId: {
    type: String,
  },
  sessionId: {
    type: String,
  },
  role: {
    type: String,
    enum: ['system', 'assistant', 'sandwich', 'user'],
    default: 'system',
  },
  order: {
    type: Number,
    default: 0,
  },
}, { timestamps: true })

export interface Message {
  _id?: string,
  content: string
  active: boolean
  chatId: string
  sessionId: string
  role: 'system' | 'assistant' | 'sandwich' | 'user'
  order: number
}

interface MessageBaseDocument extends Message, Document {
  _id: string
  toMessage(): OpenAI.Chat.Completions.ChatCompletionMessage
}

// Methods
MessageSchema.methods.toMessage = function(this: MessageBaseDocument) {
  const role = this.role === 'sandwich' ? 'system' : this.role
  return { role, content: this.content }
}

// For model
interface MessageModel extends Model<MessageBaseDocument> {}

// Default export
export default models.Message || model<MessageBaseDocument, MessageModel>('Message', MessageSchema)