import dotenv from 'dotenv'
import { ChatCompletionRequestMessage, ChatCompletionResponseMessage, Configuration, OpenAIApi } from 'openai'

import Message from '../models/message'

// Load env variables
dotenv.config()
const { OPENAI_API_KEY, MAX_CHATS } = process.env
const MAX_CHATS_NUMBER = Number(MAX_CHATS) || 1000

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
    OpenAIService.adminMessages = (await Message.find({ sessionId: undefined, active: true, role: ['system', 'assistant'] })).map((adminMessage) => adminMessage.toMessage())
    return OpenAIService.adminMessages
  }

  private static async getAdminMessages() {
    if (!OpenAIService.adminMessages) await OpenAIService.refershAdminMessages()
    return OpenAIService.adminMessages
  }

  private static async refershSandwichMessages() {
    OpenAIService.sandwichMessages = (await Message.find({ active: true, role: 'sandwich' })).map((sandwichMessage) => sandwichMessage.toMessage())
    return OpenAIService.sandwichMessages
  }

  private static async getSandwichMessages() {
    if (!OpenAIService.sandwichMessages) await OpenAIService.refershSandwichMessages()
    return OpenAIService.sandwichMessages
  }

  private static async getAllMessages(sessionId: string) {
    return (await Message.find({ sessionId })).map((message) => message.toMessage())
    // Disable chat message caching for now
    // if (!this.chats.has(sessionId)) {
    //   const messages = (await Message.find({ sessionId })).map((message) => message.toMessage())
    //   OpenAIService.chats.set(sessionId, messages)
    // }
    // return OpenAIService.chats.get(sessionId) as ChatCompletionRequestMessage[]
  }

  private static async saveMessage(sessionId: string, message: ChatCompletionRequestMessage | ChatCompletionResponseMessage) {
    (await Message.create({ ...message, sessionId })).save()
  }

  public static async addAdminMessage(role: 'system' | 'assistant', content: string, order?: number, active?: boolean) {
    const adminMessage = await Message.create({ role, content, order, active })
    await OpenAIService.refershAdminMessages()
    return adminMessage
  }

  public static async deleteAdminMessage(messageId: string) {
    const { acknowledged } = await Message.deleteOne({ _id: messageId })
    if (acknowledged) OpenAIService.refershAdminMessages()
    return acknowledged
  }

  public static async deleteChat(sessionId: string) {
    await Message.deleteMany({ sessionId })
    return OpenAIService.chats.delete(sessionId)
  }

  public static async getMessages(sessionId: string) {
    const adminMessages = await OpenAIService.getAdminMessages()
    const messages = await OpenAIService.getAllMessages(sessionId)
    // return adminMessages.concat(messages)
    return adminMessages.filter((message) => message.role !== 'system').concat(messages)
  }
  
  public static async sendMessage(sessionId: string, content: string) {
    const currentChatCount = (await Message.distinct('sessionId')).length
    if (currentChatCount >= MAX_CHATS_NUMBER) return { role: 'error', content: 'Maximum active chats limit reached' }
    const adminMessages = await OpenAIService.getAdminMessages()
    const sandwichMessages = await OpenAIService.getSandwichMessages()
    const chatMessages = await OpenAIService.getAllMessages(sessionId)
    const message: ChatCompletionRequestMessage = { role: 'user', content }
    OpenAIService.saveMessage(sessionId, message)
    chatMessages.push(message)
    const messages = adminMessages.concat([...chatMessages, ...sandwichMessages])
    const response = await OpenAIService.getInstance().createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages,
    })
    const reply = response.data.choices[0].message
    if (reply) {
      OpenAIService.saveMessage(sessionId, reply)
      chatMessages.push(reply)
    }
    return reply
  }
}

export default OpenAIService