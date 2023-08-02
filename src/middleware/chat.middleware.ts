import { Request, Response, NextFunction } from 'express'
import ChatService from '../services/chat.service'

class ChatMiddleware {
  static async chatLimit(req: Request, res: Response, next: NextFunction) {
    const { chatId } = req.query
    if (!chatId) return res.sendStatus(400)
    if (await ChatService.activeChatLimitReached(chatId.toString())) return res.sendStatus(503)
    next()
  }
}

export default ChatMiddleware
