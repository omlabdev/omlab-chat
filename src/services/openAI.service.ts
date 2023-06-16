import dotenv from 'dotenv'
import { ChatCompletionRequestMessage, ChatCompletionResponseMessage, Configuration, OpenAIApi } from 'openai'

import AdminMessage from '../models/adminMessage'

// Load env variables
dotenv.config()
const { OPENAI_API_KEY } = process.env

class OpenAIService {
  private static instance: OpenAIApi | undefined
  private static chats: Map<string, ChatCompletionRequestMessage[]> = new Map()
  private static adminMessages: ChatCompletionRequestMessage[]
  private static sandwichMessages: ChatCompletionRequestMessage[]

  constructor() {
    const configuration = new Configuration({ apiKey: OPENAI_API_KEY })
    OpenAIService.instance = new OpenAIApi(configuration)
  }
  
  private static getInstance(): OpenAIApi {
    if (OpenAIService.instance) return OpenAIService.instance
    new OpenAIService()
    return this.getInstance()
  }

  private static async refershAdminMessages() {
    OpenAIService.adminMessages = (await AdminMessage.find({ active: true, role: ['system', 'assistant'] })).map((adminMessage) => adminMessage.toMessage())
    return OpenAIService.adminMessages
  }

  private static async getAdminMessages() {
    if (!OpenAIService.adminMessages) await OpenAIService.refershAdminMessages()
    return OpenAIService.adminMessages
  }

  private static async refershSandwichMessages() {
    OpenAIService.sandwichMessages = (await AdminMessage.find({ active: true, role: 'sandwich' })).map((sandwichMessage) => sandwichMessage.toMessage())
    return OpenAIService.sandwichMessages
  }

  private static async getSandwichMessages() {
    if (!OpenAIService.sandwichMessages) await OpenAIService.refershSandwichMessages()
    return OpenAIService.sandwichMessages
  }

  private static async getAllMessages(chatId: string) {
    if (!this.chats.has(chatId)) {
      const messages = (await AdminMessage.find({ chatId })).map((message) => message.toMessage())
      OpenAIService.chats.set(chatId, messages)
    }
    return OpenAIService.chats.get(chatId) as ChatCompletionRequestMessage[]
  }

  private static async saveMessage(chatId: string, message: ChatCompletionRequestMessage | ChatCompletionResponseMessage) {
    (await AdminMessage.create({ ...message, chatId })).save()
  }

  public static async addAdminMessage(role: 'system' | 'assistant', content: string, order?: number, active?: boolean) {
    const adminMessage = await AdminMessage.create({ role, content, order, active })
    await OpenAIService.refershAdminMessages()
    return adminMessage
  }

  public static async deleteAdminMessage(messageId: string) {
    const { acknowledged } = await AdminMessage.deleteOne({ _id: messageId })
    if (acknowledged) OpenAIService.refershAdminMessages()
    return acknowledged
  }

  public static async deleteChat(chatId: string) {
    await AdminMessage.deleteMany({ chatId })
    return OpenAIService.chats.delete(chatId)
  }

  public static async getMessages(chatId: string) {
    const adminMessages = await OpenAIService.getAdminMessages()
    const messages = await OpenAIService.getAllMessages(chatId)
    // return adminMessages.concat(messages)
    return adminMessages.filter((message) => message.role !== 'system').concat(messages)
  }
  
  public static async sendMessage(chatId: string, content: string) {
    const adminMessages = await OpenAIService.getAdminMessages()
    const sandwichMessages = await OpenAIService.getSandwichMessages()
    const chatMessages = await OpenAIService.getAllMessages(chatId)
    const message: ChatCompletionRequestMessage = { role: 'user', content }
    OpenAIService.saveMessage(chatId, message)
    chatMessages.push(message)
    const messages = adminMessages.concat([...chatMessages, ...sandwichMessages])
    const response = await OpenAIService.getInstance().createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages,
    })
    const reply = response.data.choices[0].message
    if (reply) {
      OpenAIService.saveMessage(chatId, reply)
      chatMessages.push(reply)
    }
    return reply
  }
}

export default OpenAIService