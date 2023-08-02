import dotenv from 'dotenv'
import { ChatCompletionRequestMessage, ChatCompletionResponseMessage, Configuration, OpenAIApi } from 'openai'

import Message from '../models/message'
import Chat from '../models/chat'

// Load env variables
dotenv.config()
const { OPENAI_API_KEY, MAX_CHATS } = process.env
const MAX_CHATS_NUMBER = Number(MAX_CHATS) || 1000

class ChatService {
  private static instance: OpenAIApi | undefined
  private static chats: Map<string, ChatCompletionRequestMessage[]> = new Map()
  private static adminMessages: ChatCompletionRequestMessage[]
  private static chatAdminMessages: Map<string, ChatCompletionRequestMessage[]> = new Map()
  private static sandwichMessages: ChatCompletionRequestMessage[]
  private static chatSandwichMessages: Map<string, ChatCompletionRequestMessage[]> = new Map()

  constructor() {
    const configuration = new Configuration({ apiKey: OPENAI_API_KEY })
    ChatService.instance = new OpenAIApi(configuration)
  }
  
  private static getInstance(): OpenAIApi {
    if (ChatService.instance) return ChatService.instance
    new ChatService()
    return this.getInstance()
  }

  private static async refershAdminMessages(chatId?: string) {
    ChatService.adminMessages = (await Message.find({ chatId: undefined, sessionId: undefined, active: true, role: ['system', 'assistant'] })).map((adminMessage) => adminMessage.toMessage())
    if (chatId) {
      ChatService.chatAdminMessages.set(chatId, (await Message.find({ chatId, sessionId: undefined, active: true, role: ['system', 'assistant'] })).map((adminMessage) => adminMessage.toMessage()))
    }
  }

  private static async getAdminMessages(chatId?: string) {
    if (((chatId) && (!ChatService.chatAdminMessages.has(chatId))) || (!ChatService.adminMessages)) await ChatService.refershAdminMessages(chatId)
    if (chatId) return ChatService.adminMessages.concat(ChatService.chatAdminMessages.get(chatId) || [])
    return ChatService.adminMessages
  }

  private static async refershSandwichMessages(chatId?: string) {
    ChatService.sandwichMessages = (await Message.find({ active: true, role: 'sandwich' })).map((sandwichMessage) => sandwichMessage.toMessage())
    if (chatId) {
      ChatService.chatSandwichMessages.set(chatId, (await Message.find({ chatId, active: true, role: 'sandwich' })).map((sandwichMessage) => sandwichMessage.toMessage()))
    }
  }

  private static async getSandwichMessages(chatId?: string) {
    if (((chatId) && (!ChatService.chatSandwichMessages.has(chatId))) || (!ChatService.sandwichMessages)) await ChatService.refershSandwichMessages(chatId)
    if (chatId) return ChatService.sandwichMessages.concat(ChatService.chatSandwichMessages.get(chatId) || [])
    return ChatService.sandwichMessages
  }

  private static async getAllMessages(chatId: string, sessionId: string) {
    return (await Message.find({ chatId, sessionId })).map((message) => message.toMessage())
    // Disable chat message caching for now
    // if (!this.chats.has(sessionId)) {
    //   const messages = (await Message.find({ sessionId })).map((message) => message.toMessage())
    //   ChatService.chats.set(sessionId, messages)
    // }
    // return ChatService.chats.get(sessionId) as ChatCompletionRequestMessage[]
  }

  private static async saveMessage(chatId: string, sessionId: string, message: ChatCompletionRequestMessage | ChatCompletionResponseMessage) {
    (await Message.create({ ...message, chatId, sessionId })).save()
  }

  public static async chatExists(chatId: string) {
    return !!(await Chat.findOne({ chatId }))
  }

  public static async activeChatLimitReached(chatId: string) {
    const currentChatCount = (await Message.find({ chatId }).distinct('sessionId')).length
    return (currentChatCount >= MAX_CHATS_NUMBER)
  }

  public static async addAdminMessage(role: 'system' | 'assistant', content: string, chatId?: string, order?: number, active?: boolean) {
    const adminMessage = await Message.create({ role, content, order, active, chatId })
    await ChatService.refershAdminMessages(chatId)
    return adminMessage
  }

  public static async deleteAdminMessage(messageId: string) {
    const { acknowledged } = await Message.deleteOne({ _id: messageId })
    if (acknowledged) ChatService.refershAdminMessages()
    return acknowledged
  }

  public static async deleteChat(chatId: string, sessionId: string) {
    await Message.deleteMany({ chatId, sessionId })
    // return ChatService.chats.delete(sessionId)
  }

  public static async getMessages(chatId: string, sessionId: string) {
    const adminMessages = await ChatService.getAdminMessages(chatId)
    const messages = await ChatService.getAllMessages(chatId, sessionId)
    // return adminMessages.concat(messages)
    return adminMessages.filter((message) => message.role !== 'system').concat(messages)
  }
  
  public static async sendMessage(chatId: string, sessionId: string, content: string) {
    if (await ChatService.activeChatLimitReached(chatId)) return { role: 'error', content: 'Maximum active chats limit reached' }
    const adminMessages = await ChatService.getAdminMessages(chatId)
    const sandwichMessages = await ChatService.getSandwichMessages(chatId)
    const chatMessages = await ChatService.getAllMessages(chatId, sessionId)
    const message: ChatCompletionRequestMessage = { role: 'user', content }
    ChatService.saveMessage(chatId, sessionId, message)
    chatMessages.push(message)
    const messages = adminMessages.concat([...chatMessages, ...sandwichMessages])
    const response = await ChatService.getInstance().createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages,
    })
    const reply = response.data.choices[0].message
    if (reply) {
      ChatService.saveMessage(chatId, sessionId, reply)
      chatMessages.push(reply)
    }
    return reply
  }
}

export default ChatService