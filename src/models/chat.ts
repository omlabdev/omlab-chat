import { Document, Model, model, models, Schema } from 'mongoose'

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
  font: String,
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
  font?: string
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