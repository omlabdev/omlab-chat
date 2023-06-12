import dotenv from 'dotenv'
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from 'openai'

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
    if (!this.chats.has(chatId)) OpenAIService.chats.set(chatId, [])
    return OpenAIService.chats.get(chatId) as ChatCompletionRequestMessage[]
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

  public static deleteChat(chatId: string) {
    return OpenAIService.chats.delete(chatId)
  }

  public static async getMessages(chatId: string) {
    const adminMessages = await OpenAIService.getAdminMessages()
    const messages = await OpenAIService.getAllMessages(chatId)
    return adminMessages.concat(messages)
    return messages.filter((message) => message.role !== 'system')
  }
  
  public static async sendMessage(chatId: string, message: string, test: boolean = false) {
    const adminMessages = await OpenAIService.getAdminMessages()
    const sandwichMessages = await OpenAIService.getSandwichMessages()
    const chatMessages = await OpenAIService.getAllMessages(chatId)
    chatMessages.push({ role: 'user', content: message })
    let reply: ChatCompletionRequestMessage | undefined
    if (test) {
      reply = { role: 'assistant', content: 'Lorem ipsum dolor sit amet.' }
      return await new Promise ((resolve) => setTimeout(() => {
        if (reply) chatMessages.push(reply)
        resolve(reply)
      }, (800)))
    }
    const messages = adminMessages.concat([...chatMessages, ...sandwichMessages])
    // console.log('Sending messages', messages)
    const response = await OpenAIService.getInstance().createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages,
    })
    reply = response.data.choices[0].message
    if (reply) chatMessages.push(reply)
    return reply
  }
}

export default OpenAIService