import mongoose from 'mongoose'
import { ChatCompletionRequestMessage } from 'openai'

interface IAdminMessage extends mongoose.Document {
  message: String
  active: Boolean
  role: 'system' | 'assistant'
  order: Number
}

interface IAdminMessageMethods {
  toMessage(): ChatCompletionRequestMessage
}

const AdminMessageSchema = new mongoose.Schema<IAdminMessage, {}, IAdminMessageMethods>({
  message: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
  role: {
    type: String,
    enum: ['system', 'assistant'],
    default: 'system',
  },
  order: {
    type: Number,
    default: 0,
  },
})

AdminMessageSchema.method('toMessage', function(): ChatCompletionRequestMessage {
  return { role: this.role, content: this.message }
})

const AdminMessage = mongoose.model<IAdminMessage>('AdminMessage', AdminMessageSchema)

export default AdminMessage