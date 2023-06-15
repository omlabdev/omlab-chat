import { Request, Response } from 'express'

import OpenAIService from '../services/openAI.service'

import AdminMessage from '../models/adminMessage'

class AdminController {
  static async admin(req: Request, res: Response) {
    const messages = await AdminMessage.find({ chatId: undefined })
    res.render('pages/admin', { title: 'Admin', messages })
  }

  static async messagePost(req: Request, res: Response) {
    const { message, role } = req.body
    if (!message) return res.sendStatus(400)
    const response = await OpenAIService.addAdminMessage(role, message)
    res.json(response)
  }

  static async messageDelete(req: Request, res: Response) {
    const { messageId } = req.body
    if (!messageId) return res.sendStatus(400)
    const success = await OpenAIService.deleteAdminMessage(messageId)
    res.json({ success })
  }
}

export default AdminController