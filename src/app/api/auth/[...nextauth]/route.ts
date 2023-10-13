import NextAuth, { NextAuthOptions } from 'next-auth'
import EmailProvider from 'next-auth/providers/email'

import { MongoDBAdapter } from '@next-auth/mongodb-adapter'

import { MongoClient } from 'mongodb'

import Database from '@/services/database.service'

import Chat, { Chat as ChatInterface } from '@/models/chat'

import { isAdmin } from '@/helpers'

const { DB_DSN, SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } = process.env

const client = new MongoClient(DB_DSN || '')
const clientPromise = client.connect()

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    EmailProvider({
      server: {
        host: SMTP_HOST,
        port: SMTP_PORT,
        auth: {
          user: SMTP_USER,
          pass: SMTP_PASS,
        },
      },
      from: SMTP_FROM,
    })
  ],
  callbacks: {
    signIn: async ({ user }) => {
      if (!user.email) return false
      // If the user is an admin allow them in
      if (isAdmin(user.email.toLowerCase())) return true
      // If the user is not an admin check if they have access to a chat demo
      await Database.connect()
      const chat = await Chat.exists({ users: user.email.toLowerCase() }).lean<ChatInterface>().exec()
      return (!!chat)
    },
  },
  session: { strategy: 'jwt' },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }