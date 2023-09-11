import NextAuth, { NextAuthOptions } from 'next-auth'
import EmailProvider from 'next-auth/providers/email'

import { MongoDBAdapter } from '@next-auth/mongodb-adapter'

import { MongoClient } from 'mongodb'

const { DB_DSN, SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM, ADMIN_EMAILS } = process.env

const adminEmails = ADMIN_EMAILS?.split(',')

const client = new MongoClient(DB_DSN || '')
const clientPromise = client.connect()

const authOptions: NextAuthOptions = {
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
    signIn: ({ user }) => !!((user.email) && (adminEmails?.includes(user.email.toLowerCase()))),
  },
  session: { strategy: 'jwt' },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }