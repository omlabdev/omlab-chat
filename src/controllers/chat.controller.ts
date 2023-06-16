import { Request, Response } from 'express'

import { resetChatId } from '../helpers'

import OpenAIService from '../services/openAI.service'

class ChatController {
  static async home(req: Request, res: Response) {
    return res.redirect('/widget')
  }

  static async store(req: Request, res: Response) {
    return res.render('pages/store', { title: 'Store view', bodyClass: 'store' })
  }

  static async widget(req: Request, res: Response) {
    const { chatId } = req.body.jwtPayload
    if (!chatId) return res.status(400).send('No chat')
    return res.render('pages/widget', { title: 'Chat' })
  }

  static async reset(req: Request, res: Response) {
    const { chatId } = req.body.jwtPayload
    if (chatId) await OpenAIService.deleteChat(chatId)
    resetChatId(res, req)
    return res.redirect('/widget')
  }

  static async messages(req: Request, res: Response) {
    const { chatId } = req.body.jwtPayload
    if (!chatId) res.sendStatus(500)
    const messages = await OpenAIService.getMessages(chatId as string)
    res.set('Cache-Control', 'no-store')
    return res.json(messages)
  }

  static async messagePost(req: Request, res: Response) {
    const { chatId } = req.body.jwtPayload
    const { message } = req.body
    if ((!message) || (!chatId)) return res.sendStatus(400)
    const response = await OpenAIService.sendMessage(chatId, message)
    return res.json(response)
  }
}

export default ChatController