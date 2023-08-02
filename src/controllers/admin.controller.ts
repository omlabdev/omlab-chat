import { Request, Response } from 'express'

import ChatService from '../services/chat.service'

import Message from '../models/message'
import Chat from '../models/chat'

class AdminController {
  static async admin(req: Request, res: Response) {
    const messages = await Message.find({ chatId: undefined, sessionId: undefined })
    const chats = await Chat.find()
    res.render('pages/admin', { title: 'Admin', messages, chats, chatId: '' })
  }

  static async adminChat(req: Request, res: Response) {
    const { chatId } = req.params
    if (!chatId) return res.sendStatus(400)
    const chats = await Chat.find()
    const chat = chats.find((chat) => chat.chatId === chatId)
    if (!chat) return res.sendStatus(404)
    const messages = await Message.find({ chatId, sessionId: undefined })
    res.render('pages/admin', { title: `Admin - ${chat.name}`, messages, chats, chatId })
  }

  static async messagePost(req: Request, res: Response) {
    const { message, role, chatId } = req.body
    if (!message) return res.sendStatus(400)
    const response = await ChatService.addAdminMessage(role, message, chatId)
    res.json(response)
  }

  static async messageDelete(req: Request, res: Response) {
    const { messageId } = req.body
    if (!messageId) return res.sendStatus(400)
    const success = await ChatService.deleteAdminMessage(messageId)
    res.json({ success })
  }
}

export default AdminController