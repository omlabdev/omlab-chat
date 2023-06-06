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

  static async messagePost(req: Request, res: Response) {
    const { message } = req.body
    if (!message) return res.sendStatus(400)
    const response = await OpenAIService.sendMessage(message, false)
    res.json(response)
  }
}

export default ChatController