import { Document, Model, model, Schema } from 'mongoose'

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

interface Chat {
  name: String
  chatId: String
}

interface ChatBaseDocument extends Chat, Document {}

// For model
interface ChatModel extends Model<ChatBaseDocument> {}

// Default export
export default model<ChatBaseDocument, ChatModel>('Chat', ChatSchema)