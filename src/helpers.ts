import { randomBytes } from 'crypto'
import dotenv from 'dotenv'
import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'

// Enviorment variables
dotenv.config()
const { JWT_SECRET, JWT_TTL } = process.env

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

/**
 * Sets up a "token" cookie for authentication using JWT
 *
 * @param {object} data The data to include in the token
 * @param {Express.Response} res The response object
 */
function setToken(data: any, res: Response, req: Request) {
  const ttl = parseInt(JWT_TTL || '')
  const token = jwt.sign(data, JWT_SECRET || '', { algorithm: 'HS256', expiresIn: ttl })
  res.cookie('token', token, { maxAge: ttl * 1000, sameSite: 'none', secure: req.secure, httpOnly: true, domain: req.hostname })
  return token
}

/**
 * Removes the session cookie
 */
function unsetToken(res: Response, req: Request) {
  const ttl = parseInt(JWT_TTL || '')
  res.cookie('token', '', { maxAge: ttl * 1000, sameSite: 'none', secure: req.secure, httpOnly: true, domain: req.hostname })
}

function generateSessionId() {
  return randomBytes(32).toString('hex')
}

function generateChatId() {
  return randomBytes(32).toString('hex')
}

function resetSessionId(res: Response, req: Request) {
  const sessionId = generateSessionId()
  const { id } = req.body.jwtPayload
  setToken({ id, sessionId }, res, req)
}

export { verifyJWT, setToken, unsetToken, generateSessionId, resetSessionId, generateChatId }