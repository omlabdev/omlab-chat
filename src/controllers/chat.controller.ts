import { randomBytes } from 'crypto'
import dotenv from 'dotenv'
import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'

import OpenAIService from '../services/openAI.service'

// Enviorment variables
dotenv.config()
const { JWT_SECRET } = process.env

async function verifyJWT(token: any) {
  if ((!token) || (!JWT_SECRET)) return false
  try {
    const jwtPayload = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload
    return jwtPayload
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) return false
    console.error(error)
    return false
  }
}

function setChatId(req: Request, res: Response) {
  if (!JWT_SECRET) return false
  const ttl = 24 * 60 * 60 * 1000
  const chatId = randomBytes(32).toString('hex')
  const token = jwt.sign({ chatId }, JWT_SECRET, { algorithm: 'HS256', expiresIn: ttl })
  res.cookie('token', token, { maxAge: ttl, sameSite: 'lax', secure: !!req.secure, httpOnly: true, domain: req.hostname })
  return chatId
}

async function getChatId(token: any): Promise<string|false> {
  const jwtPayload = await verifyJWT(token)
  if (!jwtPayload) return false
  return jwtPayload.chatId
}

class ChatController {
  static async  home(req: Request, res: Response) {
    const { token } = req.cookies
    let chatId = await getChatId(token)
    if (!chatId) chatId = setChatId(req, res)
    if (!chatId) res.sendStatus(500)
    const messages = OpenAIService.getMessages(chatId as string)
    res.render('chat/home', { messages })
  }

  static async messagePost(req: Request, res: Response) {
    const { token } = req.cookies
    const { message } = req.body
    const chatId = await getChatId(token)
    if ((!message) || (!chatId)) return res.sendStatus(400)
    const response = await OpenAIService.sendMessage(chatId, message, false)
    res.json(response)
  }
}

export default ChatController