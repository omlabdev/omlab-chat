import { Request, Response } from 'express'

import OpenAIService from '../services/openAI.service'

class ChatController {  
  /**
   * Express handler for 
   *
   * @param {Express.Request} req The request object
   * @param {Express.Response} res The response object
   */
  static home(req: Request, res: Response) {
    const messages = OpenAIService.getMessages()
    res.render('chat/home', { messages })
  }

  static async messgePost(req: Request, res: Response) {
    const { message } = req.body
    if (!message) return res.sendStatus(400)
    await OpenAIService.sendMessage(message)
    const messages = OpenAIService.getMessages()
    res.render('chat/home', { messages })
  }
}

export default ChatController