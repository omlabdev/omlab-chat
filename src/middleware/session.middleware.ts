import { randomBytes } from 'crypto'
import { Request, Response, NextFunction } from 'express'


import { setToken, verifyJWT } from '../helpers'

function createSesison(req: Request, res: Response) {
  // Generate a sessionId
  const sessionId = randomBytes(32).toString('hex')
  // Set the auth token as a cookie
  return setToken({ sessionId }, res, req)
}

class SessionMiddleware {
  static async session(req: Request, res: Response, next: NextFunction) {
    // Get the JWT from the cookies
    let { token } = req.cookies
    if (!token) {
      token = createSesison(req, res)
    }
    // Verify the token
    let jwtPayload = await verifyJWT(token)
    if (!jwtPayload) {
      token = createSesison(req, res)
      jwtPayload = await verifyJWT(token)
    }
    // Save the JWT payload to the request body
    req.body['jwtPayload'] = jwtPayload
    next()
  }
}


export default SessionMiddleware
