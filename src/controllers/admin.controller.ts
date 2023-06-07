import { Request, Response } from 'express'

import OpenAIService from '../services/openAI.service'

class AdminController {
  static async admin(req: Request, res: Response) {
    res.render('pages/admin', { title: 'Admin' })
  }
}

export default AdminController