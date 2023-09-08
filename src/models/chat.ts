import { Document, Model, model, models, Schema } from 'mongoose'

// Schema
const ChatSchema = new Schema<ChatBaseDocument, ChatModel>({
  name: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  chatId: {
    type: String,
    required: true,
    unique: true,
  },
}, { timestamps: true })

export interface Chat {
  name: string
  chatId: string
}

interface ChatBaseDocument extends Chat, Document {}

// For model
interface ChatModel extends Model<ChatBaseDocument> {}

// Default export
export default models.Chat || model<ChatBaseDocument, ChatModel>('Chat', ChatSchema)