import { OpenAI } from 'openai'

import { Function } from '@/types'

import Message from '@/models/message'
import Chat, { Chat as ChatInterface } from '@/models/chat'

import Database from './database.service'
import FunctionsService from './functions.service'

type ChatCompletionMessage = OpenAI.Chat.Completions.ChatCompletionMessage

// Load env variables
const { OPENAI_API_KEY, MAX_CHATS } = process.env
const MAX_CHATS_NUMBER = Number(MAX_CHATS) || 1000

class ChatService {
  private static instance: OpenAI | undefined
  private static chats: Map<string, ChatCompletionMessage[]> = new Map()
  private static adminMessages: ChatCompletionMessage[]
  private static chatAdminMessages: Map<string, ChatCompletionMessage[]> = new Map()
  private static sandwichMessages: ChatCompletionMessage[]
  private static chatSandwichMessages: Map<string, ChatCompletionMessage[]> = new Map()

  constructor() {
    ChatService.instance = new OpenAI({ apiKey: OPENAI_API_KEY })
  }
  
  private static getInstance(): OpenAI {
    if (ChatService.instance) return ChatService.instance
    new ChatService()
    return this.getInstance()
  }

  private static async refershAdminMessages(chatId?: string) {
    await Database.connect()
    ChatService.adminMessages = (await Message.find({ chatId: undefined, sessionId: undefined, active: true, role: ['system', 'assistant'] }).exec()).map((adminMessage) => adminMessage.toMessage())
    if (chatId) {
      ChatService.chatAdminMessages.set(chatId, (await Message.find({ chatId, sessionId: undefined, active: true, role: ['system', 'assistant'] }).exec()).map((adminMessage) => adminMessage.toMessage()))
    }
  }

  private static async getAdminMessages(chatId?: string) {
    if (((chatId) && (!ChatService.chatAdminMessages.has(chatId))) || (!ChatService.adminMessages)) await ChatService.refershAdminMessages(chatId)
    if (chatId) return ChatService.adminMessages.concat(ChatService.chatAdminMessages.get(chatId) || [])
    return ChatService.adminMessages
  }

  private static async refershSandwichMessages(chatId?: string) {
    await Database.connect()
    ChatService.sandwichMessages = (await Message.find({ active: true, role: 'sandwich' }).exec()).map((sandwichMessage) => sandwichMessage.toMessage())
    if (chatId) {
      ChatService.chatSandwichMessages.set(chatId, (await Message.find({ chatId, active: true, role: 'sandwich' }).exec()).map((sandwichMessage) => sandwichMessage.toMessage()))
    }
  }

  private static async getSandwichMessages(chatId?: string) {
    if (((chatId) && (!ChatService.chatSandwichMessages.has(chatId))) || (!ChatService.sandwichMessages)) await ChatService.refershSandwichMessages(chatId)
    if (chatId) return ChatService.sandwichMessages.concat(ChatService.chatSandwichMessages.get(chatId) || [])
    return ChatService.sandwichMessages
  }

  private static async getAllMessages(chatId: string, sessionId: string) {
    await Database.connect()
    return (await Message.find({ chatId, sessionId }).exec()).map((message) => message.toMessage())
    // Disable chat message caching for now
    // if (!this.chats.has(sessionId)) {
    //   const messages = (await Message.find({ sessionId })).map((message) => message.toMessage())
    //   ChatService.chats.set(sessionId, messages)
    // }
    // return ChatService.chats.get(sessionId) as ChatCompletionMessage[]
  }

  private static async saveMessage(chatId: string, sessionId: string, message: ChatCompletionMessage) {
    await Database.connect()
    const newMessage = await Message.create({ ...message, chatId, sessionId })
    await newMessage.save()
  }

  public static async chatExists(chatId: string) {
    await Database.connect()
    return !!(await Chat.findOne({ chatId }).exec())
  }

  public static async activeChatLimitReached(chatId: string) {
    await Database.connect()
    const currentChatCount = (await Message.find({ chatId }).distinct('sessionId').exec()).length
    return (currentChatCount >= MAX_CHATS_NUMBER)
  }

  public static async addAdminMessage(role: 'system' | 'assistant', content: string, chatId?: string, order?: number, active?: boolean) {
    await Database.connect()
    const adminMessage = await Message.create({ role, content, order, active, chatId })
    await ChatService.refershAdminMessages(chatId)
    return adminMessage
  }

  public static async deleteAdminMessage(messageId: string) {
    await Database.connect()
    const { acknowledged } = await Message.deleteOne({ _id: messageId }).exec()
    if (acknowledged) ChatService.refershAdminMessages()
    return acknowledged
  }

  public static async deleteChat(chatId: string, sessionId: string) {
    await Database.connect()
    return await Message.deleteMany({ chatId, sessionId }).exec()
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
    const chat = await Chat.findOne({ chatId }).lean().exec() as ChatInterface | null | undefined
    if (!chat) return { role: 'error', content: 'Chat not found' }
    const adminMessages = await ChatService.getAdminMessages(chatId)
    const sandwichMessages = await ChatService.getSandwichMessages(chatId)
    const chatMessages = await ChatService.getAllMessages(chatId, sessionId)
    const message: ChatCompletionMessage = { role: 'user', content }
    ChatService.saveMessage(chatId, sessionId, message)
    chatMessages.push(message)
    const messages = adminMessages.concat([...chatMessages, ...sandwichMessages])
    const functions = FunctionsService.getFunctions(chat.functions) 
    const response = await ChatService.getInstance().chat.completions.create({ model: 'gpt-3.5-turbo', messages, functions })
    let reply = response.choices[0].message
    if (reply) {
      if (reply.function_call) {
        const functionResponse = await FunctionsService.callFunction(reply.function_call.name, reply.function_call.arguments)
        if (functionResponse) {
          const functionMessage: ChatCompletionMessage = { role: 'system', content: `Present this response to the user: ${JSON.stringify(functionResponse)}` }
          const finalResponse = await ChatService.getInstance().chat.completions.create({ model: 'gpt-3.5-turbo', messages: [...messages, functionMessage] })
          reply = finalResponse.choices[0].message
        } else {
          const functionMessage: ChatCompletionMessage = { role: 'system', content: 'Tell the user you could not find any products for them' }
          const finalResponse = await ChatService.getInstance().chat.completions.create({ model: 'gpt-3.5-turbo', messages: [...messages, functionMessage] })
          reply = finalResponse.choices[0].message
        }
      }
      ChatService.saveMessage(chatId, sessionId, reply)
      chatMessages.push(reply)
    }
    return reply
  }
}

export default ChatService