import { Request, Response } from 'express'

import { resetSessionId } from '../helpers'

import ChatService from '../services/chat.service'

import Chat from '../models/chat'

class ChatController {
  static async home(req: Request, res: Response) {
    const chat = await Chat.findOne().exec()
    if (!chat) return res.sendStatus(503)
    return res.redirect(`/store/${chat.chatId}`)
  }

  static async store(req: Request, res: Response) {
    const { chatId } = req.params
    const chat = await Chat.findOne({ chatId }).exec()
    return res.render('pages/store', { title: 'Store view', bodyClass: 'store', chat })
  }

  static async widget(req: Request, res: Response) {
    const { chatId } = req.query
    const { sessionId } = req.body.jwtPayload
    if ((!sessionId) || (!chatId)) return res.status(400).send('No chat')
    return res.render('pages/widget', { title: 'Chat', chatId })
  }

  static async reset(req: Request, res: Response) {
    const { chatId } = req.query
    const { sessionId } = req.body.jwtPayload
    if ((sessionId) && (chatId)) await ChatService.deleteChat(chatId as string, sessionId)
    resetSessionId(res, req)
    return res.redirect('/widget')
  }

  static async messages(req: Request, res: Response) {
    const { chatId } = req.query
    const { sessionId } = req.body.jwtPayload
    if ((!sessionId) || (!chatId)) return res.sendStatus(400)
    if (!(await ChatService.chatExists(chatId.toString()))) return res.sendStatus(400)
    const messages = await ChatService.getMessages(chatId as string, sessionId as string)
    res.set('Cache-Control', 'no-store')
    return res.json(messages)
  }

  static async messagePost(req: Request, res: Response) {
    const { sessionId } = req.body.jwtPayload
    const { chatId, message } = req.body
    if ((!message) || (!sessionId) || (!chatId)) return res.sendStatus(400)
    const response = await ChatService.sendMessage(chatId, sessionId, message)
    return res.json(response)
  }
}

export default ChatController