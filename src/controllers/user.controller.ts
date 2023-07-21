import { Request, Response } from 'express'

import { setToken, unsetToken } from '../helpers'

import User from '../models/user'

class UserController {
  /**
   * Express handler for loggin a user in
   *
   * @param {Express.Request} req The request object
   * @param {Express.Response} res The response object
   */
  static async signin(req: Request, res: Response) {
    return res.render('pages/signin', { title: 'Signin' })
  }

  /**
   * Express handler for loggin a user in
   *
   * @param {Express.Request} req The request object
   * @param {Express.Response} res The response object
   */
  static async signinPost(req: Request, res: Response) {
    const { email, password, jwtPayload } = req.body
    // Check required fields
    if ((!email) || (!password) || (!jwtPayload)) return res.sendStatus(400)
    const { sessionId } = jwtPayload
    if (!sessionId) return res.sendStatus(400)
    // Get the user & verify it exists and its password is correct
    const user = await User.findOne({ email: email.toLowerCase() }, ['password', 'salt'])
    if ((!user) || (!user.checkPassword(password))) return res.sendStatus(403)
    // Set the auth token as a cookie
    setToken({ id: user.id, sessionId }, res, req)
    return res.redirect('/admin')
  }

  /**
   * Express handler for loggin out a user
   *
   * @param {Express.Request} req The request object
   * @param {Express.Response} res The response object
   */
  static async signout(req: Request, res: Response) {
    unsetToken(res, req)
    return res.json({ success: true })
  }
}

export default UserController