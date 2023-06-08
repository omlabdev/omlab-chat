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
  private static initMessages: ChatCompletionRequestMessage[] = [
    { role: 'system', content: 'You are a sales person for SalamHello, a Morrocan rug store' },
    { role: 'system', content: 'Your name is Stan S. Stanman' },
    { role: 'system', content: 'The store offers in stock rugs as well as custom rugs tailored to the client\'s taste' },
    { role: 'system', content: 'For custom rugs the clients can select the size, color and tassels of the rug' },
    { role: 'system', content: 'Custom rugs usally take between 8 to 10 weeks to produce and ship' },
    { role: 'system', content: 'For custom rugs larger than  9\' x 12\' the production may take up between 10 to 13 weeks' },
    { role: 'system', content: 'Do not fabricate information that is not explicitly provided to you regarding the store or its products' },
    { role: 'system', content: 'If you do not have enough explicitly provided information to respond just apologize' },
    { role: 'system', content: 'Respond as succinctly as possible' },
    { role: 'assistant', content: 'Hello there, wanna buy some rugs?' },
  ]

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
    OpenAIService.adminMessages = (await AdminMessage.find({ active: true })).map((adminMessage) => adminMessage.toMessage())
    return OpenAIService.adminMessages
  }

  private static async getAdminMessages() {
    if (!OpenAIService.adminMessages) await OpenAIService.refershAdminMessages()
    return OpenAIService.adminMessages
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

  public static async getMessages(chatId: string) {
    const adminMessages = await OpenAIService.getAdminMessages()
    const messages = await OpenAIService.getAllMessages(chatId)
    return adminMessages.concat(messages)
    return messages.filter((message) => message.role !== 'system')
  }
  
  public static async sendMessage(chatId: string, message: string, test: boolean = false) {
    const adminMessages = await OpenAIService.getAdminMessages()
    const messages = await OpenAIService.getAllMessages(chatId)
    messages.push({ role: 'user', content: message })
    let reply: ChatCompletionRequestMessage | undefined
    if (test) {
      reply = { role: 'assistant', content: 'Lorem ipsum dolor sit amet.' }
      return await new Promise ((resolve) => setTimeout(() => {
        if (reply) messages.push(reply)
        resolve(reply)
      }, (800)))
    }
    const response = await OpenAIService.getInstance().createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: adminMessages.concat(messages),
    })
    reply = response.data.choices[0].message
    if (reply) messages.push(reply)
    return reply
  }
}

export default OpenAIService