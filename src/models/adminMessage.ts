import { Document, Model, model, Schema } from 'mongoose'
import { ChatCompletionRequestMessage } from 'openai'

// Schema
const AdminMessageSchema = new Schema<AdminMessageBaseDocument, AdminMessageModel>({
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
  role: {
    type: String,
    enum: ['system', 'assistant', 'sandwich', 'user'],
    default: 'system',
  },
  order: {
    type: Number,
    default: 0,
  },
})

interface AdminMessage {
  content: String
  active: Boolean
  chatId: String
  role: 'system' | 'assistant' | 'sandwich' | 'user'
  order: Number
}

interface AdminMessageBaseDocument extends AdminMessage, Document {
  toMessage(): ChatCompletionRequestMessage
}

// Methods
AdminMessageSchema.methods.toMessage = function(this: AdminMessageBaseDocument) {
  const role = this.role === 'sandwich' ? 'system' : this.role
  return { role, content: this.content }
}

// For model
interface AdminMessageModel extends Model<AdminMessageBaseDocument> {}

// Default export
export default model<AdminMessageBaseDocument, AdminMessageModel>('AdminMessage', AdminMessageSchema)