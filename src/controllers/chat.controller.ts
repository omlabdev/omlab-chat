import { randomBytes } from 'crypto'
import { Request, Response } from 'express'

import OpenAIService from '../services/openAI.service'

function setChatId(req: Request, res: Response) {
  const chatId = randomBytes(32).toString('hex')
  res.cookie('chatId', chatId, { maxAge: 24 * 60 * 60, sameSite: 'none', secure: !!req.secure, httpOnly: true, domain: req.hostname })
  return chatId
}

class ChatController {  
  /**
   * Express handler for 
   *
   * @param {Express.Request} req The request object
   * @param {Express.Response} res The response object
   */
  static home(req: Request, res: Response) {
    let { chatId } = req.cookies
    if (!chatId) chatId = setChatId(req, res)
    const messages = OpenAIService.getMessages(chatId)
    res.render('chat/home', { messages })
  }

  static async messagePost(req: Request, res: Response) {
    const { chatId } = req.cookies
    const { message } = req.body
    if ((!message) || (!chatId)) return res.sendStatus(400)
    const response = await OpenAIService.sendMessage(chatId, message, false)
    res.json(response)
  }
}

export default ChatController