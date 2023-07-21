import { Request, Response, NextFunction } from 'express'

import { verifyJWT } from '../helpers'

import User from '../models/user'

class AuthMiddleware {
  /**
   * Checks to see if a user is authenticated
   * 
   * If the user is authenticated then the flow continues
   * If the user is not authenticated then it gets redirected to /login
   *
   * @param {Express.Request} req The request object
   * @param {Express.Response} res The response object
   * @param {Express.NextFunction} next
   */
  static async auth(req: Request, res: Response, next: NextFunction) {
    // Get the JWT from the cookies
    const { token } = req.cookies
    if (!token) return res.redirect('/login')
    // Verify the token
    const jwtPayload = await verifyJWT(token)
    if ((!jwtPayload) || (!jwtPayload?.id)) return res.redirect('/login')
    // Try to find the user using the ID on the JWT payload
    try {
      const user = await User.findById(jwtPayload.id)
      if (!user) return res.redirect('/login')
    } catch (error) {
      return res.redirect('/login')
    }
    // Save the JWT payload to the request body
    req.body['jwtPayload'] = jwtPayload
    next()
  }

  /**
   * Checks to see if a user is not authenticated
   * 
   * If the user is not authenticated then the flow continues
   * If the user is authenticated then it gets redirected to /
   *
   * @param {Express.Request} req The request object
   * @param {Express.Response} res The response object
   * @param {Express.NextFunction} next
   */
  static async noAuth(req: Request, res: Response, next: NextFunction) {
    // Get the JWT from the cookies
    const { token } = req.cookies
    if (!token) return next()
    // Verify the token
    const jwtPayload = await verifyJWT(token)
    if ((!jwtPayload) || (!jwtPayload?.id)) return next()
    // Try to find the user using the ID on the JWT payload
    try {
      const user = await User.findById(jwtPayload.id)
      if (!user) return next()
    } catch (error) {
      return next()
    }
    // Save the JWT payload to the request body
    return res.redirect('/')
  }
}


export default AuthMiddleware
