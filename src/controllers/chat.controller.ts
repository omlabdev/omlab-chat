import { Request, Response } from 'express'

import { resetChatId } from '../helpers'

import OpenAIService from '../services/openAI.service'

class ChatController {
  static async chat(req: Request, res: Response) {
    const { reset } = req.query
    const { chatId } = req.body.jwtPayload
    if (reset === 'true') {
      if (chatId) await OpenAIService.deleteChat(chatId)
      resetChatId(res, req)
      return res.redirect('/')
    }
    if (!chatId) return res.status(400).send('No chat')
    res.render('pages/chat', { title: 'Chat' })
  }

  static async messages(req: Request, res: Response) {
    const { chatId } = req.body.jwtPayload
    if (!chatId) res.sendStatus(500)
    const messages = await OpenAIService.getMessages(chatId as string)
    res.set('Cache-Control', 'no-store')
    res.json(messages)
  }

  static async messagePost(req: Request, res: Response) {
    const { chatId } = req.body.jwtPayload
    const { message } = req.body
    if ((!message) || (!chatId)) return res.sendStatus(400)
    const response = await OpenAIService.sendMessage(chatId, message)
    res.json(response)
  }
}

export default ChatController