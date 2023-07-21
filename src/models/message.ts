import { Document, Model, model, Schema } from 'mongoose'
import { ChatCompletionRequestMessage } from 'openai'

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

interface Message {
  content: String
  active: Boolean
  chatId: String
  sessionId: String
  role: 'system' | 'assistant' | 'sandwich' | 'user'
  order: Number
}

interface MessageBaseDocument extends Message, Document {
  toMessage(): ChatCompletionRequestMessage
}

// Methods
MessageSchema.methods.toMessage = function(this: MessageBaseDocument) {
  const role = this.role === 'sandwich' ? 'system' : this.role
  return { role, content: this.content }
}

// For model
interface MessageModel extends Model<MessageBaseDocument> {}

// Default export
export default model<MessageBaseDocument, MessageModel>('Message', MessageSchema)